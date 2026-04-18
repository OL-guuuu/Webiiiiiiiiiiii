import React, { lazy, Suspense, useEffect, useState } from 'react';
import Home from './pages/Home';
import { SiteConfigProvider } from './context/SiteConfigContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Articles = lazy(() => import('./pages/Articles'));

type AppRoute =
  | { page: 'home' }
  | { page: 'dashboard' }
  | {
      page: 'articles';
      slug?: string;
    };

const getRoute = (): AppRoute => {
  if (typeof window === 'undefined') return { page: 'home' };

  const hash = window.location.hash.replace(/^#/, '');
  const path = window.location.pathname;
  const routeSource = hash && hash !== '/' ? hash : path;
  const routeSegments = routeSource
    .replace(/^\/+/, '')
    .split('/')
    .filter(Boolean);

  const section = routeSegments[0]?.toLowerCase() ?? 'home';

  if (section === 'dashboard') {
    return { page: 'dashboard' };
  }

  if (section === 'articles') {
    const slug = routeSegments[1] ? decodeURIComponent(routeSegments[1].toLowerCase()) : undefined;
    return {
      page: 'articles',
      slug,
    };
  }

  return { page: 'home' };
};

function App() {
  const [route, setRoute] = useState<AppRoute>(() => getRoute());

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getRoute());
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <SiteConfigProvider>
      {route.page === 'dashboard' ? (
        <Suspense
          fallback={
            <main className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">Loading dashboard...</p>
            </main>
          }
        >
          <Dashboard />
        </Suspense>
      ) : route.page === 'articles' ? (
        <Suspense
          fallback={
            <main className="flex min-h-screen items-center justify-center bg-[#f4f6fa] text-[#111217]">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111217]/60">Loading articles...</p>
            </main>
          }
        >
          <Articles slug={route.slug} />
        </Suspense>
      ) : (
        <Home />
      )}
    </SiteConfigProvider>
  );
}

export default App;
