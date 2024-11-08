import React from "react";

const Sidebar = () => {
  return (
    <div className="m-6 rounded-md w-[180px] h-[600px] bg-[#7EA172] flex flex-col items-center justify-around text-[20px] font-montserrat font-semibold">
      <div className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2">
        <h2>Dashboard</h2>
      </div>
      <div className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2">
        <h2>Groups</h2>
      </div>
      <div className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2">
        <h2>Subscriptions</h2>
      </div>
      <div className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2">
        <h2>Budgets</h2>
      </div>
      <div className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2">
        <h2>Expenses</h2>
      </div>
      <div className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2">
        <h2>
          Recurring <br /> Payments
        </h2>
      </div>
      <div className="font-montserrat font-semibold text-center rounded-md bg-white p-2 w-[160px] ml-2 mr-2">
        <h2>Notifications</h2>
      </div>
    </div>
  );
};

export default Sidebar;
