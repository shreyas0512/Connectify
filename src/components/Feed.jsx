import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Mutuals from "./Mutuals";
import { ProfileContext } from "../Contexts/ProfileContext";
import { useContext } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

const Feed = () => {
  const [userid, setUserid] = useState("");
  const { requ, setRequ } = useContext(ProfileContext);
  console.log(requ);
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
    <div className="bg-bgcolor h-screen bg-cover bg-no-repeat w-screen fixed overflow-x-auto flex flex-col items-center  ">
      <div className="z-20">
        <Header />
      </div>
      <div className="flex space-x-16 ml-[20rem]">
        <div className="flex  -ml-[22rem] flex-col bg-white w-64 h-[30rem] rounded-md shadow-md  "></div>
        <div className=" h-screen w-[30rem]  flex flex-col">
          <div className="bg-green w-fill h-40  rounded-md shadow-md flex flex-col justify-center items-center ">
            <textarea
              className="w-[29rem] h-20 mt-4
              m-2 rounded-md shadow-md p-2 focus:border-none focus:outline-none resize-none"
              placeholder="What's on your mind?"
            />
            <div className="text-green bg-white shadow-lg p-1 w-28 rounded-md text-center mr-2  text-xl font-semibold self-end cursor-pointer">
              Post
            </div>
          </div>
          <div className="bg-white w-fill h-[30rem] rounded-md shadow-md mt-8 "></div>
        </div>
        <div className="bg-white shadow-md rounded-md flex flex-col">
          <div className="text-3xl font-semibold p-16 pt-2 text-green ">
            Mutuals
          </div>
          {/* {mutiszero ? "" : <Mutuals users={mutualusers} />} */}
        </div>
      </div>
    </div>
  );
};

export default Feed;
