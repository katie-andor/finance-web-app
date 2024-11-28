import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="m-6 rounded-md w-[180px] h-[600px] bg-[#7EA172] flex flex-col items-center justify-around text-[20px] font-montserrat font-semibold">
      {/* <Link to="/home/dashboard">
        <button className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2 hover:bg-black hover:text-white">
          <h2>Dashboard</h2>
        </button>
      </Link> */}
      {/* <Link to="/home/groups">
        <button className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2 hover:bg-black hover:text-white">
          <h2>Groups</h2>
        </button>
      </Link> */}
      <Link to="/home/subscriptions">
        <button className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2 hover:bg-black hover:text-white">
          <h2>Subscriptions</h2>
        </button>
      </Link>
      <Link to="/home/budgets">
        <button className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2 hover:bg-black hover:text-white">
          <h2>Budgets</h2>
        </button>
      </Link>
      <Link to="/home/expenses">
        <button className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2 hover:bg-black hover:text-white">
          <h2>Expenses</h2>
        </button>
      </Link>
      <Link to="/home/income">
        <button className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2 hover:bg-black hover:text-white">
          <h2>Income</h2>
        </button>
      </Link>
      <Link to="/home/recurring-payments">
        <button className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2 hover:bg-black hover:text-white">
          <h2>Recurring <br /> Payments</h2>
        </button>
      </Link>
      <Link to="/home/retirement-tracker">
        <button className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2 hover:bg-black hover:text-white">
          <h2>Retirement Tracker</h2>
        </button>
      </Link>
      <Link to="/home/notifications">
        <button className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2 hover:bg-black hover:text-white">
          <h2>Notifications</h2>
        </button>
      </Link>
    </div>
  );
};

export default Sidebar;
