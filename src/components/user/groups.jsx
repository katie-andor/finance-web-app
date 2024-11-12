import React from "react";
import Sidebar from "../sidebar/sidebar";
import moneystack from "../../images/moneystack.svg"

const Groups = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="m-2 font-montserrat font-extrabold text-[60px] w-full h-[625px] overflow-y-auto">
        Groups
        <div className="flex flex-col">
            <div className="bg-[#C7CB85] mr-[5%] rounded-lg flex justify-between">
                <div className="flex-col flex-nowrap w-[70%]">
                <h2 className="font-extrabold text-[30px] pl-2">Money Masters</h2>
                <p className="font-normal text-[22px] pl-2">Katie, Hamna</p>
                </div>
                <div>
                <img src={moneystack} alt="A cartoon stack of paper money." width={70} className="m-2"/>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
