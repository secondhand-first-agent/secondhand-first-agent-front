import { createBrowserRouter } from 'react-router';

import { AuthLayout } from './AuthLayout';
import { RootLayout } from './RootLayout';
import { ROUTES } from './routes';
import { ComingSoonPage } from '@/pages/ComingSoonPage';
import { BestDealPage } from '@/pages/BestDealPage';
import { HomePage } from '@/pages/HomePage';
import { HistoryPage } from '@/pages/HistoryPage';
import { HowItWorksPage } from '@/pages/HowItWorksPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { ProductListPage } from '@/pages/ProductListPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { SearchPage } from '@/pages/SearchPage';
import { SignupPage } from '@/pages/SignupPage';
import { TermsPage } from '@/pages/TermsPage';

const COMING_SOON = [{ path: ROUTES.wishlist, title: '찜 목록' }];

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: ROUTES.search, Component: SearchPage },
      { path: ROUTES.bestDeal, Component: BestDealPage },
      { path: ROUTES.history, Component: HistoryPage },
      { path: ROUTES.howItWorks, Component: HowItWorksPage },
      { path: ROUTES.productDetail, Component: ProductDetailPage },
      { path: ROUTES.products, Component: ProductListPage },
      { path: ROUTES.profile, Component: ProfilePage },
      { path: ROUTES.settings, Component: SettingsPage },
      { path: ROUTES.terms, Component: TermsPage },
      { path: ROUTES.privacy, Component: PrivacyPage },
      ...COMING_SOON.map(({ path, title }) => ({
        path,
        element: <ComingSoonPage title={title} />,
      })),
      { path: '*', Component: NotFoundPage },
    ],
  },
  {
    Component: AuthLayout,
    children: [
      { path: ROUTES.login, Component: LoginPage },
      { path: ROUTES.signup, Component: SignupPage },
    ],
  },
]);
