import React from "react";
import { useRoutes } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/home";
import Error from "./components/Error";
import { AuthProvider } from "./contexts/authContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const routesArray = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "*",
      element: <Error />,
    },
  ];

  const routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
      {routesElement}
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
