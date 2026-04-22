import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider,createBrowserRouter } from 'react-router';
import { MainLayouts } from './Layouts/MainLayouts';
import  Home  from './Pages/Home';
import MovieDetails from './pages/MovieDetails';
import GenrePage from './Pages/GenrePage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import './index.css'





const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: <MainLayouts />, 
    children: [
      {
        index:true,
        element:<Home />,
      },
      {
        path:"/movie/:id",
        element:<MovieDetails />
      },
      {
        path:"/genre/:genreId/:genreName",
        element: <GenrePage />
      }
       
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router ={router} />
  </StrictMode>,
)
