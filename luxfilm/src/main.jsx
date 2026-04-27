import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './Context/AuthContext';
import { WishlistProvider } from './Context/WishlistContext';
import { MainLayouts } from './Layouts/MainLayouts';
import Home from './Pages/Home';
import MovieDetails from './Pages/MovieDetails';
import GenrePage from './Pages/GenrePage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import WishlistPage from './Pages/WishlistPage';
import AccountPage from './Pages/AccountPage';
import './index.css';
import SearchResults from './Pages/Search';
import { LanguageProvider } from './Context/Language';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <MainLayouts />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/movie/:id',
        element: <MovieDetails />,
      },
      {
        path: '/genre/:genreId/:genreName',
        element: <GenrePage />,
      },
      {
        path: '/wishlist',
        element: <WishlistPage />,
      },
      {
        path: '/account',
        element: <AccountPage />,
      },
      {
        path:'/Search',
        element:<SearchResults/>
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
    <AuthProvider>
      <WishlistProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <RouterProvider router={router} />
      </WishlistProvider>
    </AuthProvider>
    </LanguageProvider>
  </StrictMode>
);
