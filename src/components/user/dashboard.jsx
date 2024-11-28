import React from "react";
import Sidebar from "../sidebar/sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="m-2 font-montserrat font-extrabold text-[60px] w-full h-[625px] overflow-y-auto">
        <h1>Overview Analysis</h1>
        <div className="grid grid-rows-2 grid-cols-2 gap-4 m-2">
          <div className="font-extrabold text-[30px] col-span-1 row-span-1">
            <h2>Friend Group Spending</h2>
            <div className="font-medium text-[22px]">
              <div className="p-2 bg-[#AB8A78] mt-2 rounded-md">1. Dilpreet</div>
              <div className="p-2 bg-[#7EA172] mt-2 rounded-md">2. Katie</div>
              <div className="p-2 bg-[#C7CB85] mt-2 rounded-md">3. Sim</div>
              <div className="p-2 bg-[#E7A977] mt-2 rounded-md">4. Hamna</div>
              <div className="p-2 bg-[#AB8A78] mt-2 rounded-md">5. Mahnoor</div>
            </div>
          </div>
          <div className="font-extrabold text-[30px] col-span-1 row-span-1">
            <h2>Statistics</h2>
          </div>
          <div className="font-extrabold text-[30px] col-span-2 row-span-1">
            <h2>Budgets</h2>
            <div className="border-4 border-[#AB8A78] rounded-md">
              <p>Groceries</p>
              <p>Groceries</p>
              <p>Groceries</p>
              <p>Groceries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;