import { ShowDialogProvider } from '@/utils/show-dialog';
import { Signin } from '@/views/auth/signin';
import { Signup } from '@/views/auth/signup';
import { ClientCenter } from '@/views/client-center';
import { Details } from '@/views/details';
import { Index } from '@/views/index';
import { Payment } from '@/views/payment';
import { Search } from '@/views/search';
import { createBrowserRouter, Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <ShowDialogProvider>
      <Outlet />
    </ShowDialogProvider>
  );
};

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
