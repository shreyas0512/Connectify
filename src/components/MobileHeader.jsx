import React from "react";
import addfriendmobile from "../assets/addfriendmobile.png";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useEffect } from "react";
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

const MobileHeader = (props) => {
  const navigate = useNavigate();
  const [searcher, setSearcher] = useState("");
  const [searchresults, setSearchresults] = useState([]);
  const [focus, setFocus] = useState(false);
  const searchRef = useRef();
  const fetchResults = async () => {
    const q = query(
      collection(db, "users"),
      where("name", ">=", searcher),
      where("name", "<=", searcher + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    const newrec = [];
    querySnapshot.forEach((doc) => {
      newrec.push(doc.data());
    });
    setSearchresults(newrec);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setFocus(false);
    }
  };
  async function handleKeyDown(event) {
    if (event.key === "Enter") {
      const q = query(collection(db, "users"), where("name", "==", searcher));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        const path = `/profile/${doc.id}`;
        navigate(path);
      });
    }
  }
  useEffect(() => {
    fetchResults();
    console.log("results", searchresults);
  }, [searcher]);

  return (
    <div>
      <div className="flex w-screen">
        <input
          type="text"
          placeholder="Search"
          className="w-2/4 p-1 rounded-md shadow-md m-4  text-xs focus:outline-none "
          value={searcher}
          onChange={(e) => {
            setSearcher(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />

        <div>
          <img
            src={addfriendmobile}
            alt="asd"
            className=" h-6 w-6 mt-5 ml-16 "
          />
        </div>
        <div>
          <img
            src={props.selfData.imgurl}
            alt="asd"
            className=" h-8 w-8 mt-3.5 ml-8 mr-8 rounded-full"
            onClick={() => {
              navigate(`/profile/${props.selfData.uid}`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
