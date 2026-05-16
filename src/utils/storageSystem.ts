/**
 * Advanced Storage System for Site Configuration
 * Multi-layer storage with automatic backups, error recovery, and data validation
 */

import { DEFAULT_SITE_CONFIG, hydrateSiteConfig, type SiteConfig } from '../config/siteConfig';

// Storage keys
const STORAGE_KEYS = {
  PRIMARY: 'portfolio.site-config.v1',
  BACKUP: 'portfolio.site-config.backup.v1',
  SESSION: 'portfolio.site-config.session.v1',
  METADATA: 'portfolio.site-config.metadata.v1',
  RECOVERY: 'portfolio.site-config.recovery.v1',
  HISTORY: 'portfolio.site-config.history.v1',
} as const;

const MAX_VERSION_HISTORY = 12;

// Storage metadata
interface StorageMetadata {
  lastSaved: number;
  lastBackup: number;
  version: string;
  checksum: string;
  size: number;
  saveCount: number;
}

// Storage result
interface StorageResult {
  success: boolean;
  data?: SiteConfig;
  error?: string;
  source?: 'primary' | 'backup' | 'session' | 'recovery' | 'default';
  metadata?: StorageMetadata;
}

interface StorageVersionSnapshot {
  id: string;
  label: string;
  savedAt: number;
  checksum: string;
  size: number;
  config: SiteConfig;
}

interface CustomizationPackage {
  format: 'webiiiiiiiiiiiiiii.customization-package';
  version: '2.0.0';
  exportedAt: number;
  config: SiteConfig;
  history: StorageVersionSnapshot[];
  metadata: StorageMetadata;
}

// Compression utilities
const compress = (data: string): string => {
  try {
    // Simple compression using JSON.stringify with space removal
    return JSON.stringify(JSON.parse(data));
  } catch {
    return data;
  }
};

const decompress = (data: string): string => {
  try {
    return JSON.stringify(JSON.parse(data));
  } catch {
    return data;
  }
};

// Checksum calculation
const calculateChecksum = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

// Data validation
const validateSiteConfig = (data: unknown): data is SiteConfig => {
  if (!data || typeof data !== 'object') return false;

  const config = data as Partial<SiteConfig>;

  // Check required top-level properties
  if (typeof config.introText !== 'string') return false;
  if (!Array.isArray(config.projects)) return false;
  if (!Array.isArray(config.testimonials)) return false;
  if (!config.featured || typeof config.featured !== 'object') return false;

  return true;
};

// Safe JSON parse with error handling
const safeParse = <T>(data: string | null, fallback: T): T => {
  if (!data) return fallback;

  try {
    const parsed = JSON.parse(data);
    return parsed as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
};

// Safe JSON stringify with error handling
const safeStringify = (data: unknown): string | null => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Failed to stringify data:', error);
    return null;
  }
};

// Storage operations with error handling
const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set ${key}:`, error);
    return false;
  }
};

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get ${key}:`, error);
    return null;
  }
};

const safeRemoveItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove ${key}:`, error);
    return false;
  }
};

const safeSessionStorageGetItem = (key: string): string | null => {
  try {
    return sessionStorage?.getItem(key) ?? null;
  } catch (error) {
    console.warn(`Failed to get session storage item ${key}:`, error);
    return null;
  }
};

const safeSessionStorageSetItem = (key: string, value: string): boolean => {
  try {
    sessionStorage?.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to set session storage item ${key}:`, error);
    return false;
  }
};

// Get storage metadata
const getMetadata = (): StorageMetadata => {
  const metadataStr = safeGetItem(STORAGE_KEYS.METADATA);
  if (!metadataStr) {
    return {
      lastSaved: 0,
      lastBackup: 0,
      version: '1.0.0',
      checksum: '',
      size: 0,
      saveCount: 0,
    };
  }

  return safeParse(metadataStr, {
    lastSaved: 0,
    lastBackup: 0,
    version: '1.0.0',
    checksum: '',
    size: 0,
    saveCount: 0,
  });
};

// Update storage metadata
const updateMetadata = (data: string, isBackup: boolean = false, incrementSaveCount: boolean = true): void => {
  const metadata = getMetadata();
  const now = Date.now();

  metadata.lastSaved = now;
  if (isBackup) {
    metadata.lastBackup = now;
  }
  metadata.checksum = calculateChecksum(data);
  metadata.size = new Blob([data]).size;
  if (incrementSaveCount) {
    metadata.saveCount += 1;
  }

  safeSetItem(STORAGE_KEYS.METADATA, JSON.stringify(metadata));
};

const loadVersionHistory = (): StorageVersionSnapshot[] => {
  const data = safeGetItem(STORAGE_KEYS.HISTORY);
  if (!data) return [];

  try {
    const parsed = JSON.parse(data) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry, index) => {
        try {
          if (!entry || typeof entry !== 'object') return null;
          const snapshot = entry as Partial<StorageVersionSnapshot> & { config?: unknown };
          const config = hydrateSiteConfig(snapshot.config);

          return {
            id: typeof snapshot.id === 'string' && snapshot.id.trim() ? snapshot.id : `version-${index + 1}`,
            label: typeof snapshot.label === 'string' && snapshot.label.trim() ? snapshot.label : `Version ${index + 1}`,
            savedAt: typeof snapshot.savedAt === 'number' ? snapshot.savedAt : Date.now(),
            checksum: typeof snapshot.checksum === 'string' ? snapshot.checksum : '',
            size: typeof snapshot.size === 'number' ? snapshot.size : 0,
            config,
          };
        } catch (entryError) {
          console.warn(`Failed to load version ${index + 1}:`, entryError);
          return null;
        }
      })
      .filter((item): item is StorageVersionSnapshot => !!item);
  } catch (error) {
    console.error('Failed to load version history:', error);
    return [];
  }
};

const saveVersionHistory = (history: StorageVersionSnapshot[]): void => {
  safeSetItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, MAX_VERSION_HISTORY)));
};

const createVersionSnapshot = (config: SiteConfig): StorageVersionSnapshot => {
  const savedAt = Date.now();
  const serializedConfig = JSON.stringify(config);
  const metadata = getMetadata();
  const nextVersionNumber = Math.max(1, metadata.saveCount);

  return {
    id: `version-${savedAt}`,
    label: `Version ${nextVersionNumber}`,
    savedAt,
    checksum: calculateChecksum(serializedConfig),
    size: new Blob([serializedConfig]).size,
    config,
  };
};

const appendVersionSnapshot = (config: SiteConfig): void => {
  const nextHistory = [createVersionSnapshot(config), ...loadVersionHistory()].slice(0, MAX_VERSION_HISTORY);
  saveVersionHistory(nextHistory);
};

// Save to primary storage
const saveToPrimary = (config: SiteConfig): boolean => {
  const data = safeStringify(config);
  if (!data) return false;

  const compressed = compress(data);
  const success = safeSetItem(STORAGE_KEYS.PRIMARY, compressed);

  if (success) {
    updateMetadata(compressed, false, true);
  }

  return success;
};

// Save to backup storage
const saveToBackup = (config: SiteConfig): boolean => {
  const data = safeStringify(config);
  if (!data) return false;

  const compressed = compress(data);
  const success = safeSetItem(STORAGE_KEYS.BACKUP, compressed);

  if (success) {
    updateMetadata(compressed, true, false);
  }

  return success;
};

// Save to session storage (temporary)
const saveToSession = (config: SiteConfig): boolean => {
  try {
    const data = safeStringify(config);
    if (!data) return false;

    return safeSessionStorageSetItem(STORAGE_KEYS.SESSION, compress(data));
  } catch (error) {
    console.error('Failed to save to session storage:', error);
    return false;
  }
};

// Create recovery point
const createRecoveryPoint = (config: SiteConfig): boolean => {
  try {
    const data = safeStringify(config);
    if (!data) return false;

    const recoveryData = {
      timestamp: Date.now(),
      data: compress(data),
      metadata: getMetadata(),
    };

    safeSetItem(STORAGE_KEYS.RECOVERY, JSON.stringify(recoveryData));
    return true;
  } catch (error) {
    console.error('Failed to create recovery point:', error);
    return false;
  }
};

const saveCurrentConfigToHistory = (config: SiteConfig): void => {
  appendVersionSnapshot(config);
};

// Load from primary storage
const loadFromPrimary = (): SiteConfig | null => {
  const data = safeGetItem(STORAGE_KEYS.PRIMARY);
  if (!data) return null;

  try {
    const decompressed = decompress(data);
    const parsed = JSON.parse(decompressed);

    if (validateSiteConfig(parsed)) {
      return parsed;
    }

    console.warn('Primary storage data validation failed');
    return null;
  } catch (error) {
    console.error('Failed to load from primary storage:', error);
    return null;
  }
};

// Load from backup storage
const loadFromBackup = (): SiteConfig | null => {
  const data = safeGetItem(STORAGE_KEYS.BACKUP);
  if (!data) return null;

  try {
    const decompressed = decompress(data);
    const parsed = JSON.parse(decompressed);

    if (validateSiteConfig(parsed)) {
      console.info('Loaded from backup storage');
      return parsed;
    }

    console.warn('Backup storage data validation failed');
    return null;
  } catch (error) {
    console.error('Failed to load from backup storage:', error);
    return null;
  }
};

// Load from session storage
const loadFromSession = (): SiteConfig | null => {
  try {
    const data = safeSessionStorageGetItem(STORAGE_KEYS.SESSION);
    if (!data) return null;

    const decompressed = decompress(data);
    const parsed = JSON.parse(decompressed);

    if (validateSiteConfig(parsed)) {
      console.info('Loaded from session storage');
      return parsed;
    }

    return null;
  } catch (error) {
    console.error('Failed to load from session storage:', error);
    return null;
  }
};

// Load from recovery point
const loadFromRecovery = (): SiteConfig | null => {
  const data = safeGetItem(STORAGE_KEYS.RECOVERY);
  if (!data) return null;

  try {
    const recovery = JSON.parse(data);
    const decompressed = decompress(recovery.data);
    const parsed = JSON.parse(decompressed);

    if (validateSiteConfig(parsed)) {
      console.info('Loaded from recovery point');
      return parsed;
    }

    return null;
  } catch (error) {
    console.error('Failed to load from recovery point:', error);
    return null;
  }
};

// Main load function with fallback chain
export const loadSiteConfig = (): StorageResult => {
  // Try primary storage first
  const primaryData = loadFromPrimary();
  if (primaryData) {
    return {
      success: true,
      data: primaryData,
      source: 'primary',
      metadata: getMetadata(),
    };
  }

  // Try backup storage
  const backupData = loadFromBackup();
  if (backupData) {
    // Restore primary from backup
    saveToPrimary(backupData);
    return {
      success: true,
      data: backupData,
      source: 'backup',
      metadata: getMetadata(),
    };
  }

  // Try session storage
  const sessionData = loadFromSession();
  if (sessionData) {
    // Restore primary and backup from session
    saveToPrimary(sessionData);
    saveToBackup(sessionData);
    return {
      success: true,
      data: sessionData,
      source: 'session',
      metadata: getMetadata(),
    };
  }

  // Try recovery point
  const recoveryData = loadFromRecovery();
  if (recoveryData) {
    // Restore all storage layers from recovery
    saveToPrimary(recoveryData);
    saveToBackup(recoveryData);
    saveToSession(recoveryData);
    return {
      success: true,
      data: recoveryData,
      source: 'recovery',
      metadata: getMetadata(),
    };
  }

  // All failed, return default
  console.warn('All storage layers failed, using default config');
  return {
    success: false,
    data: DEFAULT_SITE_CONFIG,
    source: 'default',
    error: 'No valid data found in any storage layer',
  };
};

// Main save function with multi-layer redundancy
export const saveSiteConfig = (config: SiteConfig): StorageResult => {
  const results = {
    primary: false,
    backup: false,
    session: false,
    recovery: false,
  };

  // Validate data before saving
  if (!validateSiteConfig(config)) {
    return {
      success: false,
      error: 'Invalid site config data',
    };
  }

  // Save to primary storage
  results.primary = saveToPrimary(config);

  // Save to backup storage (always)
  results.backup = saveToBackup(config);

  // Save to session storage (for current session)
  results.session = saveToSession(config);

  // Create recovery point every 10 saves
  const metadata = getMetadata();
  if (metadata.saveCount % 10 === 0) {
    results.recovery = createRecoveryPoint(config);
  }

  const success = results.primary || results.backup || results.session;

  if (!success) {
    console.error('All storage layers failed to save');
    return {
      success: false,
      error: 'Failed to save to any storage layer',
    };
  }

  saveCurrentConfigToHistory(config);

  // Log warnings for failed layers
  if (!results.primary) {
    console.warn('Failed to save to primary storage');
  }
  if (!results.backup) {
    console.warn('Failed to save to backup storage');
  }
  if (!results.session) {
    console.warn('Failed to save to session storage');
  }

  return {
    success: true,
    metadata: getMetadata(),
  };
};

// Reset all storage
export const resetAllStorage = (): boolean => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      safeRemoveItem(key);
    });

    // Also clear session storage
    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        sessionStorage?.removeItem(key);
      } catch {
        // Ignore session storage errors
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to reset storage:', error);
    return false;
  }
};

// Get storage info for debugging
export const getStorageInfo = () => {
  const metadata = getMetadata();
  const primarySize = safeGetItem(STORAGE_KEYS.PRIMARY)?.length || 0;
  const backupSize = safeGetItem(STORAGE_KEYS.BACKUP)?.length || 0;
  const sessionSize = safeSessionStorageGetItem(STORAGE_KEYS.SESSION)?.length || 0;
  const recoverySize = safeGetItem(STORAGE_KEYS.RECOVERY)?.length || 0;
  
  let history: StorageVersionSnapshot[] = [];
  try {
    history = loadVersionHistory();
  } catch (error) {
    console.warn('Failed to load version history in getStorageInfo:', error);
    history = [];
  }

  return {
    metadata,
    history,
    historyCount: history.length,
    sizes: {
      primary: primarySize,
      backup: backupSize,
      session: sessionSize,
      recovery: recoverySize,
      history: safeGetItem(STORAGE_KEYS.HISTORY)?.length || 0,
    },
    total: primarySize + backupSize + sessionSize + recoverySize + (safeGetItem(STORAGE_KEYS.HISTORY)?.length || 0),
  };
};

// Export storage data as JSON (for manual backup)
export const exportStorageData = (config?: SiteConfig): string | null => {
  try {
    const fallbackConfig = config ?? loadSiteConfig().data ?? DEFAULT_SITE_CONFIG;
    const data = {
      format: 'webiiiiiiiiiiiiiii.customization-package',
      version: '2.0.0',
      exportedAt: Date.now(),
      config: fallbackConfig,
      history: loadVersionHistory(),
      metadata: getMetadata(),
    };

    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Failed to export storage data:', error);
    return null;
  }
};

// Import storage data from JSON (for manual restore)
export const importStorageData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);

    if (data?.format === 'webiiiiiiiiiiiiiii.customization-package' && data.config) {
      const config = hydrateSiteConfig(data.config);
      if (!validateSiteConfig(config)) {
        throw new Error('Invalid configuration data');
      }

      saveSiteConfig(config);

      if (Array.isArray(data.history)) {
        const restoredHistory = data.history
          .map((entry: unknown, index: number) => {
            if (!entry || typeof entry !== 'object') return null;
            const snapshot = entry as Partial<StorageVersionSnapshot> & { config?: unknown };
            return {
              id: typeof snapshot.id === 'string' ? snapshot.id : `version-${index + 1}`,
              label: typeof snapshot.label === 'string' ? snapshot.label : `Version ${index + 1}`,
              savedAt: typeof snapshot.savedAt === 'number' ? snapshot.savedAt : Date.now(),
              checksum: typeof snapshot.checksum === 'string' ? snapshot.checksum : '',
              size: typeof snapshot.size === 'number' ? snapshot.size : 0,
              config: hydrateSiteConfig(snapshot.config),
            };
          })
          .filter((entry): entry is StorageVersionSnapshot => !!entry)
          .slice(0, MAX_VERSION_HISTORY);

        saveVersionHistory(restoredHistory);
      }

      if (data.metadata) {
        safeSetItem(STORAGE_KEYS.METADATA, JSON.stringify(data.metadata));
      }

      return true;
    }

    if (!data.primary || !data.backup) {
      // Backward-compatible raw storage import
      throw new Error('Invalid storage data format');
    }

    // Validate data before importing
    const primaryParsed = JSON.parse(decompress(data.primary));
    if (!validateSiteConfig(primaryParsed)) {
      throw new Error('Invalid primary data');
    }

    // Save imported data
    safeSetItem(STORAGE_KEYS.PRIMARY, data.primary);
    safeSetItem(STORAGE_KEYS.BACKUP, data.backup);

    if (data.metadata) {
      safeSetItem(STORAGE_KEYS.METADATA, JSON.stringify(data.metadata));
    }

    if (Array.isArray(data.history)) {
      saveVersionHistory(data.history as StorageVersionSnapshot[]);
    }

    return true;
  } catch (error) {
    console.error('Failed to import storage data:', error);
    return false;
  }
};

export const getVersionHistory = (): StorageVersionSnapshot[] => {
  return loadVersionHistory();
};

export const restoreVersionSnapshot = (snapshotId: string): SiteConfig | null => {
  const snapshot = loadVersionHistory().find((entry) => entry.id === snapshotId);
  if (!snapshot) return null;

  const hydrated = hydrateSiteConfig(snapshot.config);
  if (!validateSiteConfig(hydrated)) return null;

  saveSiteConfig(hydrated);
  return hydrated;
};
