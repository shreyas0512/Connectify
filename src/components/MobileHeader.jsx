import React, { useContext } from "react";
import addfriendmobile from "../assets/addfriendmobile.png";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useEffect } from "react";
import logoutimg from "../assets/logout.png";
import home from "../assets/home-filled.png";
import Popupreq from "./Popupreq";
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

const MobileHeader = (props) => {
  const [openrequests, setOpenrequests] = useState(false);
  const navigate = useNavigate();
  const [searcher, setSearcher] = useState("");
  const [searchresults, setSearchresults] = useState([]);
  const [focus, setFocus] = useState(false);
  const searchRef = useRef();
  const { requ, setRequ, setSuggestions, suggestions } =
    useContext(ProfileContext);

  //function to fetch requests
  const userid = props.selfData.uid;
  console.log("userid", userid);
  const fetchRequests = async () => {
    const userRef = doc(db, "users", userid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const data = docSnap.data();
      const requests = data.received;

      console.log("requests", requests);
      const q = query(collection(db, "users"), where("uid", "in", requests));
      const querySnapshot = await getDocs(q);
      const newrec = querySnapshot.docs.map((doc) => doc.data());
      console.log("newrec", newrec);
      setRequ(newrec);
    }
  };

  async function getSuggestions() {
    //get all users
    const userRef = doc(db, "users", userid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const myfriends = docSnap.data().friends;
      console.log("my friends", myfriends);
      //get friends of my friends
      const q = query(collection(db, "users"), where("uid", "in", myfriends));
      const querySnapshot = await getDocs(q);
      const newrec = [];
      querySnapshot.forEach((doc) => {
        //map over list of friends of friends
        doc.data().friends.map((friend) => {
          if (!myfriends.includes(friend)) {
            newrec.push(friend);
          }
        });
      });
      console.log("newrec");
      console.log(newrec);
      //get unique values
      const unique = [...new Set(newrec)];
      console.log("unique");
      console.log(unique);
      //remove my id
      const filtered = unique.filter((item) => item !== userid);
      console.log("filtered");
      console.log(filtered);
      //got uid of all fitered users
      const q2 = query(collection(db, "users"), where("uid", "in", filtered));
      const querySnapshot2 = await getDocs(q2);
      const newrec2 = [];
      querySnapshot2.forEach((doc) => {
        newrec2.push(doc.data());
      });
      console.log("newrec2");
      console.log(newrec2);
      setSuggestions(newrec2);
    }
  }
  useEffect(() => {
    fetchRequests();
    getSuggestions();
  }, []);
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
      {openrequests && (
        <Popupreq
          trigger={openrequests}
          setTrigger={setOpenrequests}
          userid={userid}
        />
      )}
      <div className="flex w-screen justify-between">
        <input
          type="text"
          placeholder="Search"
          className="w-2/4 p-1 px-2 rounded-md shadow-md m-4  text-xs focus:outline-none "
          value={searcher}
          onChange={(e) => {
            setSearcher(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <div className="flex mt-5 space-x-4 mr-4">
          <div>
            <img
              src={addfriendmobile}
              alt="asd"
              className="   h-4 w-4  "
              onClick={() => {
                fetchRequests();
                getSuggestions();

                setOpenrequests(true);
                console.log(openrequests);
              }}
            />
          </div>
          <img
            src={home}
            alt="asd"
            className=" h-4 w-4  "
            onClick={() => {
              navigate("/feed");
            }}
          />
          <img
            src={logoutimg}
            alt="asd"
            className=" h-4 w-4  "
            onClick={() => {
              auth.signOut();
              navigate("/");
            }}
          />
          <div className="">
            <img
              src={props.selfData.imgurl}
              alt="asd"
              className=" h-5 w-5  rounded-full"
              onClick={() => {
                navigate(`/profile/${props.selfData.uid}`);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
