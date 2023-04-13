import React from "react";
import { useState, useContext } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

const Popupreq = (props) => {
  const { requ, setRequ, suggestions } = useContext(ProfileContext);
  const navigate = useNavigate();

  const popupRef = useRef(null);
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (popupRef.current && !popupRef.current.contains(event.target)) {
  //       props.setTrigger(false);
  //       console.log("clicked outside");
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  return (
    <div className="w-screen h-screen  absolute bg-[#bcb8b899] flex justify-center items-center  overflow-y-hidden bg-cover bg-repeat overflow-auto">
      <div
        className="bg-[#FFFFFF] w-5/6 h-4/6 self-center center shadow-md rounded-md flex flex-col "
        ref={popupRef}
      >
        <div className="flex justify-between">
          <div className=" ml-2 text-textgreen font-semibold mt-2 mb-2 ">
            Requests
          </div>
          <div
            className="font-black self-end mr-4 mb-2 text-lg"
            onClick={() => {
              props.setTrigger(false);
            }}
          >
            X
          </div>
        </div>
        <div className="h-2/4 overflow-scroll text-sm">
          {requ.map((req) => {
            async function acceptreq() {
              const userRef = doc(db, "users", props.userid);
              const profRef = doc(db, "users", req.uid);
              const userSnap = await getDoc(userRef);
              const profSnap = await getDoc(profRef);
              const user = userSnap.data();
              const prof = profSnap.data();
              const friends1 = user.friends;
              const friends2 = prof.friends;
              friends1.push(prof.uid);
              friends2.push(user.uid);

              const newsent = prof.sent.filter(
                (item) => item.uid !== props.userid
              );

              await updateDoc(userRef, {
                friends: friends1,
                received: arrayRemove(req.uid),
              });
              await updateDoc(profRef, {
                friends: friends2,
                sent: arrayRemove(props.userid),
              });
              const newreq = requ.filter((item) => item.uid !== req.uid);
              setRequ(newreq);

              console.log("accepted");
              window.location.reload();
            }
            return (
              <div className="flex mx-2  mb-4 items-center justify-around ">
                <img
                  src={req.imgurl}
                  alt="asd"
                  className="h-10 w-10  rounded-full"
                />
                <div
                  className="mt-2 w-9 text-md"
                  onClick={() => {
                    navigate(`/profile/${req.uid}`);
                    props.setTrigger(false);
                  }}
                >
                  {req.name}
                </div>
                <div className="flex ">
                  <div
                    className="bg-blue-700 mt-2 px-2 py-0.5 rounded-full h-full  text-[#ececec] text-xs"
                    onClick={() => {
                      acceptreq();
                      console.log("accepted");
                    }}
                  >
                    Accept
                  </div>
                  <div
                    className="bg-red-700 mt-2 ml-2  px-2 py-0.5 rounded-full h-full   text-[#ececec] text-xs"
                    onClick={async () => {
                      const userRef = doc(db, "users", props.userid);
                      const profRef = doc(db, "users", req.uid);
                      const userSnap = await getDoc(userRef);
                      const profSnap = await getDoc(profRef);
                      const user = userSnap.data();
                      const prof = profSnap.data();
                      const newsent = prof.sent.filter(
                        (item) => item.uid !== props.userid
                      );
                      await updateDoc(userRef, {
                        received: arrayRemove(req.uid),
                      });
                      await updateDoc(profRef, {
                        sent: arrayRemove(props.userid),
                      });
                      const newreq = requ.filter(
                        (item) => item.uid !== req.uid
                      );
                      setRequ(newreq);
                      console.log("rejected");
                      window.location.reload();
                    }}
                  >
                    Reject
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <div className="ml-2 text-textgreen font-semibold">
            Recommendations
          </div>
          <div className=" text-sm flex flex-wrap   justify-start items-center  ">
            {suggestions.map((sug) => {
              return (
                <div className="flex flex-col mx-4    mb-4 items-center justify-center mt-4 ">
                  <img
                    src={sug.imgurl}
                    alt="asd"
                    className="h-12 w-12  rounded-full"
                    onClick={() => {
                      navigate(`/profile/${sug.uid}`);
                      props.setTrigger(false);
                    }}
                  />
                  <div
                    className="mt-2 w-9 text-sm h-4"
                    onClick={() => {
                      navigate(`/profile/${sug.uid}`);
                      props.setTrigger(false);
                    }}
                  >
                    {sug.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popupreq;
