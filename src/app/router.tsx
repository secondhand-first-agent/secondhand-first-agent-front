import { createBrowserRouter } from 'react-router';

import { RootLayout } from './RootLayout';
import { HomePage } from '@/pages/HomePage';
import { ProductListPage } from '@/pages/ProductListPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'products', Component: ProductListPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
