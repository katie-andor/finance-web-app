import React from "react";
import Sidebar from "../sidebar/sidebar";

const Subscriptions = () => {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col w-[83%]">
        <div className="m-2 font-montserrat text-[60px] font-extrabold flex flex-row justify-between items-baseline">
          <h1>Subscriptions</h1>
          <h2 className="text-[30px]">Total Cost: $120.99</h2>
        </div>
        <div className="w-full flex flex-row h-[500px]">
            <div className="flex flex-col mb-6 mr-2 ml-2 font-montserrat">
            <div className="flex-grow"></div>
                <div className="w-[140px] h-full bg-[#ED1C1C] text-[32px] text-white text-center font-bold pt-4">$13.99</div>
                <h2 className="text-center text-[32px]">Netflix</h2>
            </div>
            <div className="flex flex-col mb-6 mr-2 ml-2 font-montserrat">
            <div className="flex-grow"></div>
                <div className="w-[140px] h-[80%] bg-[#2640A5] text-[32px] text-white text-center font-bold pt-4">$15.99</div>
                <h2 className="text-center text-[32px]">Amazon</h2>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
