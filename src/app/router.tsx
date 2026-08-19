import { createBrowserRouter } from 'react-router';

import { AuthLayout } from './AuthLayout';
import { RootLayout } from './RootLayout';
import { ROUTES } from './routes';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProductListPage } from '@/pages/ProductListPage';
import { SignupPage } from '@/pages/SignupPage';

export const router = createBrowserRouter([
  {
    // 헤더/네비게이션이 있는 일반 화면
    path: ROUTES.home,
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: ROUTES.products, Component: ProductListPage },
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
