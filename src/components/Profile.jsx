import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Mutuals from "./Mutuals";
import Requests from "./Requests";
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
} from "firebase/firestore";
import { db, auth } from "../firebase";
import logout from "../assets/logout.png";
import { onAuthStateChanged, signOut } from "firebase/auth";
//main function

const Profile = () => {
  const [name, setName] = useState("");
  const { abc } = useParams();

  const uid = abc;
  console.log(uid + "abc");
  const [profpic, setProfpic] = useState("");
  const [isFriend, setIsFriend] = useState(false);
  const [userid, setUserid] = useState("");
  const [visible, setVisible] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const interestRef = doc(db, "users", uid);
  const [about, setAbout] = useState("");
  const [interests, setInterests] = useState("");
  const [searcher, setSearcher] = useState("");
  const [userName, setuserName] = useState("");
  const [userprofpic, setuserprofpic] = useState("");
  const [pending, setPending] = useState(false);
  const [friends, setFriends] = useState(false);
  const [mutualusers, setMutualusers] = useState([]);

  const [req, setReq] = useState([]);

  const [mutualcount, setMutualcount] = useState("");
  const navigate = useNavigate();
  const aboutRef = doc(db, "users", uid);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid + " is the user");
        console.log("user is signed in");
        setUserid(user.uid);
      }
    });
  }, []);

  useEffect(() => {
    console.log(userid + "is being changed yay");
  }, [userid]);
  //function to get user data using local storage uid

  async function getuserdata() {
    const userRef = doc(db, "users", userid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      setuserName(docSnap.data().name);
      setuserprofpic(docSnap.data().imgurl);
    } else {
      console.log("No such document!");
    }
  }

  //function to get profile pic and name of account being viewed

  async function getPic() {
    const picRef = doc(db, "users", uid);
    const docSnap = await getDoc(picRef);
    if (docSnap.exists()) {
      setProfpic(docSnap.data().imgurl);
      setName(docSnap.data().name);
    } else {
      console.log("No such document!");
    }
    const docSnap2 = await getDoc(aboutRef);
    if (docSnap2.exists()) {
      setAbout(docSnap2.data().about);
    } else {
      console.log("No such document!");
    }
    const docSnap3 = await getDoc(interestRef);
    if (docSnap3.exists()) {
      setInterests(docSnap3.data().interests);
    }
  }
  const inter = interests.split(" ");

  //function to check if already a friend

  async function checkFriend() {
    const userRef = doc(db, "users", userid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const friends = docSnap.data().friends;
      if (friends.includes(uid)) {
        setIsFriend(true);
      } else {
        setIsFriend(false);
      }
    }
    console.log("is friend " + isFriend);
  }

  //function to get received requests

  async function getReceived() {
    console.log("get received called");
    const userRef = doc(db, "users", userid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const received = docSnap.data().received;
      console.log("received array ", received);
      const q = query(collection(db, "users"), where("uid", "in", received));
      const querySnapshot = await getDocs(q);
      const newrec = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        newrec.push(doc.data());
      });
      console.log(newrec);

      setReq(newrec);
    }
  }

  async function addConnection() {
    // add connection to current user from local storage uid and store friends as an array
    const userRef = doc(db, "users", userid);
    const profRef = doc(db, "users", uid);
    const profSnap = await getDoc(profRef);

    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const sent = docSnap.data().sent;
      sent.push(uid);
      await updateDoc(userRef, { sent: sent });
    } else {
      console.log("couldnt send request");
    }
    //to add connection request received in other end and store received as an array
    if (profSnap.exists()) {
      const received = profSnap.data().received;
      received.push(userid);
      await updateDoc(profRef, { received: received });
    } else {
      console.log("couldnt add receive notification");
    }

    checkRequest();
  }

  //function to update requests for requests component

  //function to check if request already sent

  async function checkRequest() {
    setPending(false);
    console.log("check request");
    const userRef = doc(db, "users", userid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const sent = docSnap.data().sent;
      if (sent.includes(uid)) {
        setPending(true);
        console.log("request already sent");
      } else {
        console.log("request sent");
      }
    } else {
      console.log("couldnt send request");
    }
  }

  const reqVisible = () => {
    setVisible(!visible);
  };

  //function to compute mutual friends and show count
  async function mutuals() {
    console.log("Mutuals");
    const userRef = doc(db, "users", userid);
    const profRef = doc(db, "users", uid);

    const docSnap = await getDoc(userRef);
    const profSnap = await getDoc(profRef);

    const userfriends = docSnap.data().friends;
    const profriends = profSnap.data().friends;
    const mutual = userfriends.filter((uid) => profriends.includes(uid));
    setMutualcount(mutual.length);
    const q = query(collection(db, "users"), where("uid", "in", mutual));
    const querySnapshot = await getDocs(q);
    const newmut = [];
    querySnapshot.forEach((doc) => {
      newmut.push(doc.data());
      //console.log(doc.id, " => ", doc.data());
    });
    setMutualusers(newmut);
  }

  //function to unfriend user and remove from friends array
  async function unfriend() {
    const userRef = doc(db, "users", userid);
    const profRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    await updateDoc(userRef, { friends: arrayRemove(uid) });
    await updateDoc(profRef, { friends: arrayRemove(userid) });
    setIsFriend(false);
  }

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
  //use effects to call functions on page load and on change of state

  useEffect(() => {
    mutuals();
  }, [uid, userid]);
  useEffect(() => {
    console.log(uid);
    getuserdata();
    if (uid) {
      getPic();
    }
  }, [uid, userid]);

  useEffect(() => {
    if (uid === userid) {
      setIsUser(true);
    } else setIsUser(false);
  }, [uid, userid]);

  useEffect(() => {
    console.log("req changed");
    getReceived();
    checkFriend();
  }, []);

  useEffect(() => {
    checkRequest();

    getReceived();
    checkFriend();
  }, [uid, userid]);

  useEffect(() => {
    if (userid) {
      console.log("id cahged");
    }
  }, [userid]);

  return (
    <div
      className="bg-bgcolor h-screen bg-cover bg-no-repeat w-screen fixed overflow-x-auto flex flex-col items-center"
      onClick={reqVisible}
    >
      <div className="flex flex-row ">
        <input
          className="w-72 h-12 rounded-md bg-white shadow-md m-8 ml-4 font-medium pl-2 focus:outline-none resize-none "
          placeholder="Search for Users"
          value={searcher}
          onChange={(e) => {
            setSearcher(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <div className="h-[11rem] " onClick={getReceived}>
          <Requests reqs={req} currentuser={userid} />
        </div>
        <div className="flex mt-4 ml-[4rem]">
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
                  localStorage.removeItem("uid");
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
      <div className="flex flex-row space-x-12">
        <div className="flex flex-col">
          <div className="bg-white p-12 m-4 mt-16 shadow-md rounded-lg flex flex-col w-[52rem]">
            <div className="flex">
              <img
                src={profpic}
                alt=""
                className="h-52 w-52 rounded-full -mt-36 shadow-md -ml-8"
              />
              <div className="flex flex-col ml-8">
                <div className="text-4xl font-[600] text-[#444444] -mt-6 ">
                  {name}
                </div>
                {isUser ? (
                  <div className="bg-green w-[11rem] mt-6 rounded-md text-2xl font-regular p-2 text-white shadow-md cursor-pointer">
                    Edit Profile
                  </div>
                ) : pending ? (
                  <div
                    className=" w-[11rem] mt-6 rounded-md text-2xl font-regular p-2 text-black cursor-default"
                    onClick={addConnection}
                  >
                    Request Sent
                  </div>
                ) : isFriend ? (
                  <div
                    onClick={unfriend}
                    className="bg-green w-[11rem] mt-6 rounded-md text-2xl font-regular p-2 text-white shadow-md cursor-pointer pl-8 hover:bg-[#57c776]"
                  >
                    Unfriend
                  </div>
                ) : (
                  <div
                    className="bg-green w-[11rem] mt-6 rounded-md text-2xl font-regular p-2 text-white shadow-md cursor-pointer"
                    onClick={addConnection}
                  >
                    + Connect
                  </div>
                )}
              </div>
            </div>
            <div className="h-[2.5px] w-[50rem] bg-[#DBDADA] mt-4 -ml-8 "></div>
            {isUser ? (
              ""
            ) : (
              <div className="text-xl text-[#929191] -ml-8">
                {mutualcount} Mutual Friends
              </div>
            )}
            <div className="-ml-8 text-2xl font-medium mt-2">About</div>
            <div className="-ml-8 text-lg font-light text-gray-700 w-[52rem]">
              {about}
            </div>
          </div>
          <div className=" p-4 bg-white w-[52rem] m-4 shadow-md rounded-lg  ">
            <div className="text-2xl font-medium">Interests</div>
            <div className="flex flex-row mt-4">
              {inter.map((item) => {
                return (
                  <div className="bg-[#F2F2F2] rounded-md text-[#929191] font-medium text-sm px-4 py-2 mr-4">
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {isUser ? (
          <div className="bg-white shadow-md mt-16 mr-4 rounded-md flex flex-col">
            <div className="text-3xl font-semibold p-16 pt-2 text-green ">
              All Friends
            </div>
            <div className="-mt-8 ml-8 mb-2 text-gray-400">
              {mutualcount} Friends
            </div>
            <div className="flex flex-row">
              <Mutuals users={mutualusers} />
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md mt-16 mr-4 rounded-md flex flex-col">
            <div className="text-3xl font-semibold p-16 pt-2 text-green ">
              Mutuals
            </div>
            <Mutuals users={mutualusers} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
