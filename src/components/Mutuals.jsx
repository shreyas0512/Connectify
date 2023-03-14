import React from "react";
import { useEffect } from "react";
import Mutualuser from "./Mutualuser";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
const Mutuals = (props) => {
  const [mutusers, setMutusers] = React.useState([]);

  console.log(props.users);

  return (
    <div className="flex flex-row">
      <div>
        {props.users.map((user) => {
          return <Mutualuser users={user} />;
        })}
      </div>
    </div>
  );
};

export default Mutuals;
