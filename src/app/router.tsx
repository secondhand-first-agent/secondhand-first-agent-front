import { createBrowserRouter } from 'react-router';

import { AuthLayout } from './AuthLayout';
import { RootLayout } from './RootLayout';
import { ROUTES } from './routes';
import { ComingSoonPage } from '@/pages/ComingSoonPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProductListPage } from '@/pages/ProductListPage';
import { SearchPage } from '@/pages/SearchPage';
import { SignupPage } from '@/pages/SignupPage';

/** 아직 화면이 없는 경로들. 만들어지는 대로 하나씩 빼면 됩니다. */
const COMING_SOON = [
  { path: ROUTES.bestDeal, title: 'Best Deal' },
  { path: ROUTES.howItWorks, title: '이용 방법' },
  { path: ROUTES.profile, title: '내 프로필' },
  { path: ROUTES.wishlist, title: '찜 목록' },
  { path: ROUTES.history, title: '이동 내역' },
  { path: ROUTES.settings, title: '설정' },
];

export const router = createBrowserRouter([
  {
    // 헤더 · 푸터가 있는 일반 화면
    path: ROUTES.home,
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: ROUTES.search, Component: SearchPage },
      { path: ROUTES.products, Component: ProductListPage },
      ...COMING_SOON.map(({ path, title }) => ({
        path,
        element: <ComingSoonPage title={title} />,
      })),
      { path: '*', Component: NotFoundPage },
    ],
  },
  {
    // 네비게이션 없이 폼에만 집중하는 인증 화면
    Component: AuthLayout,
    children: [
      { path: ROUTES.login, Component: LoginPage },
      { path: ROUTES.signup, Component: SignupPage },
    ],
  },
]);
