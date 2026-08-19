import { Outlet } from 'react-router';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
