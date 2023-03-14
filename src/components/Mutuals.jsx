import React from "react";

const Mutuals = (props) => {
  return (
    <div className="flex flex-row">
      <img src="{profpic}" alt="" className="h-10 w-10 rounded-md ml-8" />
      <div className="flex flex-col ml-4">
        <div className="text-xl font-bold text-green">John Doe</div>
        <div className="text-sm font-light text-gray-700">
          14 Mutual Friends
        </div>
      </div>
    </div>
  );
};

export default Mutuals;
