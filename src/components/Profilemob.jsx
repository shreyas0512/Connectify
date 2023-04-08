import React from "react";
import MobileHeader from "./MobileHeader";

const Profilemob = (props) => {
  console.log(props.userdata);
  return (
    <div className="bg-white h-screen w-screen flex flex-col items-center">
      <MobileHeader userdata={props.userdata} />

      <div className="bg-[#FFFFFF] w-11/12 mt-24  rounded-md shadow-md flex flex-col">
        <div className="flex">
          <img
            src={props.userdata.imgurl}
            className="rounded-full h-[100px] bg-gray-200 w-[100px] ml-8 -mt-8 shadow-sm object-cover"
          />
          <div className="flex flex-col">
            <div className="font-semibold text-md ml-8 mt-2">
              {props.userdata.name}
            </div>
            <div className="bg-green text-white rounded-md px-3 text-sm py-0.5 ml-8  mt-2">
              + Connect
            </div>
            <div className="text-gray-400 text-xs ml-8 mt-2 w-full">
              14 Mutual Friends
            </div>
          </div>
          <div className="h-[1px] w-full bg-gray-300 mt-32 -ml-64 mr-2 rounded-sm"></div>
        </div>
        <div className="ml-2 font-medium">About</div>
        <div className="ml-2 text-gray-500 text-xs mt-2 w-full m-2">
          {props.userdata.about}
        </div>
      </div>
    </div>
  );
};

export default Profilemob;
