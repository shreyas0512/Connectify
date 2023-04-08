import React from "react";
import addfriendmobile from "../assets/addfriendmobile.png";

const MobileHeader = (props) => {
  return (
    <div>
      <div className="flex w-screen">
        <input
          type="text"
          placeholder="Search"
          className="w-2/4 p-1 rounded-md shadow-md m-4 focus:outline-none "
        />
        <div>
          <img
            src={addfriendmobile}
            alt="asd"
            className=" h-7 w-7 mt-5 ml-16 "
          />
        </div>
        <div>
          <img
            src={props.userdata.imgurl}
            alt="asd"
            className=" h-8 w-8 mt-5 ml-8 mr-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
