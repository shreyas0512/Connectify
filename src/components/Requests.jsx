import React, { useEffect, useRef, useContext } from "react";
import { ProfileContext } from "../Contexts/ProfileContext";
import drop from "../assets/dropdown.png";
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import {
  arrayUnion,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  arrayRemove,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const Requests = (props) => {
  console.log("props in requests", props);
  const { requ, setRequ } = useContext(ProfileContext);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const [noofmut, setNoofmut] = useState(0);
  const [isZero, setIsZero] = useState(false);

  const userid = props.currentuser;
  //fetch users having uid

  async function getReceived() {
    console.log("get received called");
    const userRef = doc(db, "users", userid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log("Document data:");
      const received = docSnap.data().received;
      console.log("received array ", received);
      const q = query(collection(db, "users"), where("uid", "in", received));
      const querySnapshot = await getDocs(q);

      const newrec = querySnapshot.docs.map((doc) => doc.data());

      console.log(newrec);
      if (newrec.length > 0) {
        setIsZero(true);
      }
      setRequ(newrec);
      console.log("requ", newrec);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    getReceived();
  }, [userid]);

  useEffect(() => {
    getReceived();
    console.log("requ called on refresh");
  }, []);

  useEffect(() => {
    console.log(isZero);
  }, [requ]);

  //function to find no of mutuals with requested user and current user

  return (
    <div className="flex mt-6 ml-[12rem]">
      {isOpen ? (
        ""
      ) : (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-md h-11 w-64   mr-4 rounded-md font-bold text-black  pl-20 pt-3  pr-12  text-sm flex cursor-pointer hover:bg-gray-200 hover:transition duration-200"
        >
          <div className="h-2 w-2  pr-2 mr-2 mt-[5px] bg-blue-500 shadow-md rounded-full "></div>
          <div> Requests</div>
        </div>
      )}
      {isOpen && (
        <div ref={ref} className="h-[10rem] ">
          <div
            ref={ref}
            className="z-[99999] bg-white min-h-[10rem] flex flex-col items-start justify-start shadow-md  w-64  mr-4 rounded-md font-bold text-black  pl-12 pt-3 pr-12   text-sm cursor-pointer relative  "
          >
            {isZero ? (
              <div className="flex flex-col -ml-8">
                {requ.map((req) => {
                  const handleClick = async (e) => {
                    if (e.target.id === "accept") {
                      console.log("accept");

                      const profRef = doc(db, "users", req.uid);
                      const userRef = doc(db, "users", userid);
                      const profSnap = await getDoc(profRef);
                      const userSnap = await getDoc(userRef);
                      const friends1 = profSnap.data().friends;
                      const friends2 = userSnap.data().friends;

                      friends1.push(userid);
                      friends2.push(req.uid);
                      await updateDoc(profRef, {
                        friends: friends1,
                      });

                      await updateDoc(userRef, {
                        friends: friends2,
                      });
                    } else if (e.target.id === "reject") {
                      console.log("reject");
                    }

                    //to delete the request from the database
                    const userRef = doc(db, "users", userid);
                    const profRef = doc(db, "users", req.uid);
                    await updateDoc(userRef, {
                      received: arrayRemove(req.uid),
                    });
                    await updateDoc(profRef, {
                      sent: arrayRemove(userid),
                    });
                    //refresh page
                    window.location.reload();
                    //function to update requests after accept or reject is clicked
                  };

                  return (
                    <div className="flex flex-col">
                      <div className="flex items-start justify-start -mt-6">
                        <div className="flex flex-col">
                          <div className="text-[#444444] text-[13px] w-32 font-semibold pt-4  ">
                            {req.name}
                          </div>
                        </div>
                        <div
                          className="rounded-full bg-blue-600 shadow-md h-5 w-5 mt-5 ml-6 hover:bg-blue-400"
                          id="accept"
                          onClick={handleClick}
                        ></div>
                        <div
                          className="rounded-full bg-red-600 shadow-md h-5 w-5 mt-5 ml-6 -mr-6 hover:bg-red-400"
                          id="reject"
                          onClick={handleClick}
                        ></div>
                      </div>
                      <div className="w-[210px] h-[1.5px] bg-gray-300 mb-3 mt-2"></div>
                    </div>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
