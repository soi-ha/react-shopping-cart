import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import CartPage from './pages/CartPage';
import OrderConfirmPage from './pages/OrderConfirmPage';

import './index.css';

const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: CartPage,
    },
    {
      path: '/order-confirm',
      Component: OrderConfirmPage,
    },
  ],
  { basename: '/react-shopping-cart/dist' },
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
);
