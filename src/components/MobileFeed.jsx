import React from "react";
import MobileHeader from "./MobileHeader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect, useContext } from "react";
import gallery from "../assets/gallery.png";
import { ProfileContext } from "../Contexts/ProfileContext";
import {
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
  setDoc,
  updateDoc,
  arrayRemove,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Posts from "./Posts";

const MobileFeed = (props) => {
  //fetch userid
  const [feedposts, setFeedposts] = useState([]);
  const navigate = useNavigate();
  const [selfData, setSelfData] = useState([]);

  async function getuserdata() {
    const userRef = doc(db, "users", props.userid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setSelfData(docSnap.data());
      // console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  }
  useEffect(() => {
    getuserdata();
  }, [props.userid]);

  return (
    <div className="bg-bgcolor min-h-screen   flex flex-col  items-center overflow-auto box-border ">
      <MobileHeader selfData={selfData} />
      <div className="  flex flex-col items-center w-screen mt-9">
        <div className="bg-white rounded-md shadow-md flex flex-col items-center box-border w-11/12 ">
          <textarea
            onChange={(e) => props.setContent(e.target.value)}
            value={props.content}
            className="  mt-2 w-10/12  rounded-md shadow-md p-2 text-xs  focus:border-none focus:outline-none resize-none"
            placeholder="What's on your mind?"
          />
          <div className="flex w-11/12 ml-4  justify-between items-center  px-2 py-2">
            <label for="hiddenFileInput" className="">
              <img
                src={gallery}
                alt=""
                className="w-6 h-5  cursor-pointer shadow-xl"
              />
            </label>
            <input
              type="file"
              id="hiddenFileInput"
              className="hidden"
              onChange={(e) => props.setImg(e.target.files[0])}
              style={{ visibility: "hidden" }}
            />
            {/* <div className="mt-4 flex flex-col">
              {props.imgError && (
                <div className="text-center text-red-700 text-[10px]  mx-4 ">
                  You must upload image before posting
                </div>
              )}
              {postUpdated && (
                <div className="text-center text-[#36953e] text-md mb-8 ml-24 font-semibold">
                  Posted Succesfully!
                </div>
              )}
              {props.img ? (
                <img
                  src={props.img ? URL.createObjectURL(props.img) : ""}
                  alt=""
                  className="w-64 h-64 self-center rounded-md mb-8 mt-0.5 cursor-pointer shadow-md "
                />
              ) : (
                ""
              )}
            </div> */}
            <div
              onClick={props.postData}
              className="text-white  bg-green shadow-lg h-full self-end mb-1  rounded-sm text-center mr-2 px-2   text-sm font-semibold  cursor-pointer"
            >
              Post
            </div>
          </div>
          <div className="mt-2 flex flex-col">
            {props.imgError && (
              <div className="text-center text-red-700 text-[10px]  mx-4 ">
                You must upload image before posting
              </div>
            )}
            {props.postUpdated && (
              <div className="text-center text-[#36953e] text-xs mb-2  font-semibold">
                Posted Succesfully!
              </div>
            )}
            {props.img ? (
              <img
                src={props.img ? URL.createObjectURL(props.img) : ""}
                alt=""
                className="w-64 h-64 self-center rounded-md mb-8 mt-0.5 cursor-pointer shadow-md "
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className=" w-fill   text-black mx-4">
          {/*friends posts */}

          <Posts posts={props.feedposts} />
        </div>
      </div>
    </div>
  );
};

export default MobileFeed;
