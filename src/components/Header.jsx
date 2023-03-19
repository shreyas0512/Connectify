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
  const [searchresults, setSearchresults] = useState([]);
  const [focus, setFocus] = useState(false);

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
    fetchResults();
    console.log("results", searchresults);
  }, [searcher]);

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
      <div className=" relative">
        <input
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="w-96 h-12 rounded-md bg-white shadow-md m-6 -ml-6 font-medium pl-2 focus:outline-none resize-none"
          placeholder="Search for Users"
          value={searcher}
          onChange={(e) => {
            setSearcher(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        {focus && (
          <div className="w-full -ml-6 h-30 z-30 overflow-auto bg-[#f3f2f2] border-0 border-gray-200 p-2 rounded-md  focus:outline-none focus:border-green shadow-md text-xl font-light -mt-5 absolute">
            {searchresults
              ? searchresults.map((result) => (
                  <div className="flex flex-row items-center">
                    <div
                      key={result.id}
                      className="font-medium mt-1 w-fill cursor-pointer"
                      onClick={() => {
                        const path = `/profile/${result.id}`;
                        console.log(path);
                        navigate(path);
                      }}
                    >
                      {result.name}
                    </div>
                  </div>
                ))
              : ""}
          </div>
        )}
      </div>
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
