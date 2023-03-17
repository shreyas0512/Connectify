import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";

const Feed = () => {
  const [userid, setUserid] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid + " is the user");
        console.log("user is signed in");
        setUserid(user.uid);
      }
    });
  }, []);

  return (
    <div className="bg-bgcolor h-screen bg-cover bg-no-repeat w-screen fixed overflow-x-auto flex flex-col items-center ">
      <Header />
      <div className="flex space-x-24 ml-96">
        <div className="flex  -ml-[36rem] flex-col bg-white w-64 h-[32rem] rounded-md shadow-md"></div>
        <div className="bg-white h-screen w-[38rem]"></div>
        <div className=""></div>
      </div>
    </div>
  );
};

export default Feed;
