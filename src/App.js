import React from "react";
import { useRoutes } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Error from "./components/Error";
import { AuthProvider } from "./contexts/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Main from "./layouts/main.jsx";
import Dashboard from "./components/user/dashboard.jsx";
import Groups from "./components/user/groups.jsx";
import Subscriptions from "./components/user/subscriptions.jsx";
import Budgets from "./components/user/budgets.jsx";
import Notifications from "./components/user/notifications.jsx";
import Admin from "./components/admin/admin.jsx";
import AdminLogin from "./components/auth/login/AdminLogin.jsx";

function App() {
  const routesArray = [
    {
      path: "/",
      element: <Login />,
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
      path: "/home",
      element: <Main />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "groups",
          element: <Groups />,
        },
        {
          path: "subscriptions",
          element: <Subscriptions />,
        },
        {
          path: "budgets",
          element: <Budgets/>
        },
        {
          path: "notifications",
          element: <Notifications />
        },
      ],
    },
    {
      path: "/admin/login",
      element: <AdminLogin/>
    },
    {
      path: "/admin/dashboard",
      element: <Admin/>
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
