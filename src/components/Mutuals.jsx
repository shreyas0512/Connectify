import React from "react";
import { useEffect } from "react";
import Mutualuser from "./Mutualuser";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
const Mutuals = (props) => {
  const [mutusers, setMutusers] = React.useState([]);

  console.log(props.users);

  return (
    <div className="flex flex-col">
      <div>
        {props.users.map((user) => {
          return (
            <div>
              <Mutualuser users={user} />
              <div className="bg-gray-200 h-[2px] m-3 -mt-1 shadow-md w-[15rem]"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Mutuals;
