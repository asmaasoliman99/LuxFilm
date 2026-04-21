import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider,createBrowserRouter } from 'react-router';
import { MainLayouts } from './Layouts/MainLayouts';
import  Home  from './Pages/Home';
import MovieDetails from './pages/MovieDetails';
import GenrePage from './Pages/GenrePage';
import './index.css'





const router = createBrowserRouter([
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
