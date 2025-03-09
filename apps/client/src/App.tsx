import '@/assets/scss/reset.scss';
import '@/assets/scss/theme-css-variables.scss';
import 'normalize.css';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
