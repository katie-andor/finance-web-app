import React from "react";
import Sidebar from "../sidebar/sidebar";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

const Notifications = () => {
  return (
    <div className="flex font-montserrat">
      <Sidebar />
      <div className="flex flex-col w-full mt-2 h-[625px] overflow-y-auto">
        <h1 className="ml-2 font-extrabold text-[60px]">Notifications</h1>
        <h2 className="font-extrabold text-[40px] ml-2 ">
          Current Notifications
        </h2>
        <div className="grid grid-cols-2 gap-4 mr-2 mt-2">
          <div className="border-2 border-black rounded-xl h-[300px]">
            <div className="flex flex-row justify-between items-center border-b-2 border-black rounded-tr-xl rounded-tl-xl h-[60px] bg-[#C7CB85] w-full">
              <h2 className="m-2 font-extrabold text-[32px]">Verizon Bill</h2>
              <XMarkIcon width={35} className="mr-2" />
            </div>
            <div className="flex flex-col mt-2">
              <h3 className="ml-2 font-extrabold text-[32px]">Recurring:</h3>
              <div className="flex flex-row">
                  <h3 className="ml-2 font-semibold text-[30px]">
                    Every 29th of the Month
                  </h3>
                  <CalendarDaysIcon width={40} className="ml-2"/>
              </div>
              <div className="border-2 border-black w-[95%] mr-auto ml-auto m-2 rounded-xl p-2 h-[100px]">
                Reminder:
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
