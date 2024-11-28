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
import Income from "./components/user/income.jsx";
import Expenses from "./components/user/expenses.jsx";
import RetirementTrackerPage from "./components/user/retirementTracker"; // Import the RetirementTrackerPage component
import RecurringPaymentsPage from "./components/user/RecurringPaymentsPage.jsx"; // Import the RecurringPaymentsPage component

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
          element: <Budgets />,
        },
        {
          path: "notifications",
          element: <Notifications />,
        },
        {
          path: "income",
          element: <Income />,
        },
        {
          path: "retirement-tracker",  
          element: <RetirementTrackerPage />, 
        },
        {
          path: "expenses",
          element: <Expenses />
        },
        {
         path: "recurring-payments",  
         element: <RecurringPaymentsPage />, 
        },
      ],
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