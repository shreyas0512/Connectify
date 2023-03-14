import React from "react";

const Mutualuser = (props) => {
  return (
    <div>
      <img
        src={props.users.imgurl}
        alt=""
        className="h-10 w-10 rounded-md ml-8"
      />
      <div className="flex flex-col ml-4">
        <div className="text-xl font-bold text-green">{props.users.name}</div>
      </div>
    </div>
  );
};

export default Mutualuser;
