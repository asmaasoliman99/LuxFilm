import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { MainLayouts } from "./Layouts/MainLayouts";
import Home from "./Pages/Home";
import MovieDetails from "./Pages/MovieDetails";
import GenrePage from "./Pages/GenrePage";
import SearchResults from "./Pages/SearchResults";
import { LanguageProvider } from "./context/LanguageProvider";
import "./index.css";
import NotFound from "./Pages/NotFound";

const router = createBrowserRouter([
  {
        path: "*",
        element: <NotFound/>,
      },
  {
    path: "/",
    element: <MainLayouts />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/movie/:id",
        element: <MovieDetails />,
      },
      {
        path: "/search",
        element: <SearchResults />,
      },
      {
        path: "/genre/:genreId/:genreName",
        element: <GenrePage />,
      },
      
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </StrictMode>,
);
