import React from "react";

const Error = () => {
  return (
    <div className="h-screen w-full bg-[#C7CB85] flex items-center font-montserrat">
      <div className="border-8 border-[#7EA172] rounded-xl mr-auto ml-auto">
        <h1 className="text-black text-[60px] m-12"><span className="font-extrabold">Whoops!</span> <span className="font-light italic">Looks like <br/> there was an error </span> {':('}</h1>
        </div>
    </div>
  );
};

export default Error;
