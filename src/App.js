import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Error from "./components/Error";

import Header from "./components/header";
import Home from "./components/home";

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
      errorElement: <Error />
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <Error />
    },
    {
      path: "/register",
      element: <Register />,
      errorElement: <Error />
    },
    {
      path: "/home",
      element: <Home />,
      errorElement: <Error />
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      {routesElement}
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;