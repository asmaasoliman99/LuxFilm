import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { LanguageProvider } from "./context/LanguageProvider";
import ThemeProvider from "./context/ThemeContext";
import { MainLayouts } from "./Layouts/MainLayouts";
import Home from "./Pages/Home";
import MovieDetails from "./Pages/MovieDetails";
import GenrePage from "./Pages/GenrePage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import WishlistPage from "./Pages/WishlistPage";
import AccountPage from "./Pages/AccountPage";
import NotFound from "./Pages/NotFound";
import SearchResults from "./Pages/SearchResults";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
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
        path: "/genre/:genreId/:genreName",
        element: <GenrePage />,
      },
      {
        path: "/search",
        element: <SearchResults />,
      },
      {
        path: "/wishlist",
        element: <WishlistPage />,
      },
      {
        path: "/account",
        element: <AccountPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <WishlistProvider>
            <RouterProvider router={router} />
            <Toaster position="top-right" reverseOrder={false} />
          </WishlistProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);
