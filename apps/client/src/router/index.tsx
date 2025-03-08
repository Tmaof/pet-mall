import { createBrowserRouter } from 'react-router-dom';
import { Index } from '@/views/index';
import { Signin } from '@/views/auth/signin';
import { Signup } from '@/views/auth/signup';

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
]);

export { router };
