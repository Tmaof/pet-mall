import { RootLayout } from '@/layout';
import { Signin } from '@/views/auth/signin';
import { Signup } from '@/views/auth/signup';
import { ClientCenter } from '@/views/client-center';
import { Details } from '@/views/details';
import { Index } from '@/views/index';
import { Payment } from '@/views/payment';
import { Search } from '@/views/search';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      {
        path: '/signin',
        element: <Signin />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/search',
        element: <Search />,
      },
      {
        path: '/details/:id',
        element: <Details />,
      },
      {
        path: '/client-center',
        element: <ClientCenter />,
      },
      {
        path: '/payment',
        element: <Payment />,
      },
    ],
  },
]);

export { router };
