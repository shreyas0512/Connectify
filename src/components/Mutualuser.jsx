import React from "react";

const Mutualuser = (props) => {
  return (
    <div className="flex flex-col">
      <div className="flex m-3 -ml-4">
        <img
          src={props.users.imgurl}
          alt=""
          className="h-10 w-10 rounded-md ml-8"
        />
        <div className="flex flex-col ml-4">
          <div className="text-xl font-bold text-green">{props.users.name}</div>
          
        </div>
      </div>
    </div>
  );
};

export default Mutualuser;
