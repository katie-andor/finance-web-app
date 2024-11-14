import React from "react";
import Sidebar from "../sidebar/sidebar";
import foodicon from "../../images/food_icon.svg";
import travelicon from "../../images/travel_icon.svg";
import funicon from "../../images/fun_icon.svg";
import billicon from "../../images/bill_icon.svg";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Budgets = () => {
  return (
    <div className="flex font-montserrat">
      <Sidebar />
      <div className="flex flex-col w-full h-[625px] overflow-y-auto">
        <div className="m-2 font-extrabold text-[60px] flex flex-row justify-start items-start">
          Budgets
          <img src={foodicon} alt="food icon" width={80} className="ml-2" />
          <img src={travelicon} alt="travel icon" width={80} className="ml-2" />
          <img src={funicon} alt="fun icon" width={80} className="ml-2" />
          <img src={billicon} alt="bill icon" width={80} className="ml-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 mr-2">
          <div className="border-2 border-black rounded-xl h-[300px]">
            <div className="flex flex-row justify-between items-center border-b-2 border-black rounded-tr-xl rounded-tl-xl h-[60px] bg-[#C7CB85] w-full">
              <h2 className="m-2 font-extrabold text-[32px]">Groceries</h2>
              <XMarkIcon width={35} className="mr-2" />
            </div>
            <div className="flex flex-col mt-4">
              <div className="flex flex-row">
                <img src={foodicon} alt="food icon" width={90} className="m-4"/>
                <div className="border-2 border-black w-full m-2 rounded-xl p-2">
                  Items:
                </div>
              </div>
              <div className="flex flex-row justify-between w-[90%] mr-auto ml-auto mt-4">
                <h3 className="font-semibold text-[20px]">$0</h3>
                <h3 className="font-semibold text-[20px]">$350</h3>
              </div>
              <div className="flex flex-row h-[30px] w-[90%] m-4 mt-2 mr-auto ml-auto">
                <div className="bg-[#C7CB85] w-3/4"></div>
                <div className="bg-[#8F8F8F] w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
