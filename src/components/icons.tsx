  import React from 'react';
  import {
    FacebookIcon,
    TwitterIcon,
    TelegramIcon,
    InstagramIcon,
    LinkedinIcon,
    GithubIcon,
    YoutubeIcon,
    DribbbleIcon,
    FigmaIcon,
    GlobeIcon,
    MailIcon,
    BehanceIcon,
    HomeIcon,
    UserIcon,
    BriefcaseIcon,
    MessageSquareIcon,
    FileTextIcon,
    SlidersHorizontalIcon,
    RotateCcwIcon,
    RefreshCwIcon,
    XIcon,
    BarChart3Icon,
    ExternalLinkIcon,
    InboxIcon,
    LogOutIcon,
    SaveIcon,
    SettingsIcon,
    DownloadIcon,
    UploadIcon,
  } from './custom-icons';
  import type { SiteSocialIconKey } from '../config/siteConfig';

  type IconProps = {
    size?: number;
    strokeWidth?: number;
    className?: string;
  };

  // Re-export all icons from custom library
  export { 
    FacebookIcon, 
    TwitterIcon, 
    TelegramIcon,
    InstagramIcon, 
    LinkedinIcon, 
    GithubIcon, 
    YoutubeIcon, 
    DribbbleIcon, 
    FigmaIcon, 
    GlobeIcon, 
    MailIcon, 
    BehanceIcon,
    HomeIcon,
    UserIcon,
    BriefcaseIcon,
    MessageSquareIcon,
    FileTextIcon,
    SlidersHorizontalIcon,
    RotateCcwIcon,
    RefreshCwIcon,
    XIcon,
    BarChart3Icon,
    ExternalLinkIcon,
    InboxIcon,
    LogOutIcon,
    SaveIcon,
    SettingsIcon,
    DownloadIcon,
    UploadIcon,
  };

type SocialIconComponent = React.ComponentType<IconProps>;

export const SOCIAL_ICON_COMPONENTS: Record<SiteSocialIconKey, SocialIconComponent> = {
  behance: BehanceIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  github: GithubIcon,
  twitter: TwitterIcon,
  telegram: TelegramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  dribbble: DribbbleIcon,
  figma: FigmaIcon,
  globe: GlobeIcon,
  mail: MailIcon,
};

export const getSocialIconComponent = (icon: SiteSocialIconKey): SocialIconComponent => {
  return SOCIAL_ICON_COMPONENTS[icon] ?? GlobeIcon;
};
