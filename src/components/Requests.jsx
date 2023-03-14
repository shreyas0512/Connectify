import React from "react";
import drop from "../assets/dropdown.png";

const Requests = () => {
  return (
    <div className="flex mt-4 ml-[18rem]">
      <div className="bg-white shadow-md h-11  mr-8 rounded-md font-bold text-black  pl-12 pt-3 pr-12   text-sm flex cursor-pointer hover:bg-gray-200 hover:transition duration-200">
        <div className="h-2 w-2  pr-2 mr-2 mt-[5px] bg-blue-500 shadow-md rounded-full "></div>
        <div> Requests</div>
        <img src={drop} className="h-3 w-4 mt-1 ml-3" />
      </div>
    </div>
  );
};

export default Requests;
