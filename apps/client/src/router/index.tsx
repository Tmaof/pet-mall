import { Signin } from '@/views/auth/signin';
import { Signup } from '@/views/auth/signup';
import { Details } from '@/views/details';
import { Index } from '@/views/index';
import { Search } from '@/views/search';
import { createBrowserRouter } from 'react-router-dom';
import { ClientCenter } from '@/views/client-center';

const router = createBrowserRouter([
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
]);

export { router };
