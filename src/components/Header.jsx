import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import logout from "../assets/logout.png";
import Requests from "./Requests";
import homeIcon from "../assets/home.png";

const Header = () => {
  const [userid, setUserid] = useState("");
  const [searcher, setSearcher] = useState("");
  const [userName, setUserName] = useState("");
  const [userprofpic, setUserprofpic] = useState("");

  const navigate = useNavigate();

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

  const gotoprof = () => {
    const path = `/profile/${userid}`;
    navigate(path);
  };

  //fetch user details from db
  async function getUserDetails() {
    const userRef = doc(db, "users", userid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserName(docSnap.data().name);
      setUserprofpic(docSnap.data().imgurl);
    } else {
      console.log("No such document!");
    }
  }

  useEffect(() => {
    getUserDetails();
  }, [userid]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid + " is the user");
        console.log("user is signed in");
        setUserid(user.uid);
      }
    });
    getUserDetails();
  }, []);

  return (
    <div className="flex flex-row w-min-screen  ml-16 min-w-screen">
      <img
        src={homeIcon}
        className="m-6 -ml-28 mr-12 mt-7 cursor-pointer h-10 w-10"
        onClick={() => {
          navigate("/feed");
        }}
      />

      <input
        className="w-96 h-12 rounded-md bg-white shadow-md m-6 -ml-6 font-medium pl-2 focus:outline-none resize-none "
        placeholder="Search for Users"
        value={searcher}
        onChange={(e) => {
          setSearcher(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      <div className="h-[10rem] ">
        {" "}
        {/*might need onclick to fix*/}
        <Requests currentuser={userid} />
      </div>
      <div className="flex mt-6 ml-[4rem]">
        <div
          onClick={gotoprof}
          className="bg-green pr-2 h-12  mr-8 rounded-md font-bold text-white pt-3 pl-16 text-sm flex cursor-pointer"
        >
          <img
            src={userprofpic}
            alt="a"
            className="h-10 w-10 -ml-14 rounded-sm -mt-[8px] mr-3 cursor-pointer"
          />
          {userName}
        </div>

        <img
          src={logout}
          className="h-8 w-8 mt-2 mr-2 cursor-pointer"
          onClick={() => {
            signOut(auth)
              .then(() => {
                console.log("signed out");

                navigate("/");

                // Sign-out successful.
              })
              .catch((error) => {
                // An error happened.
              });
          }}
        />
      </div>
    </div>
  );
};

export default Header;
