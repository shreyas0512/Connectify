import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Mutuals from "./Mutuals";
import Requests from "./Requests";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ProfileContext } from "../Contexts/ProfileContext";
import { useContext } from "react";
import homeLogo from "../assets/home.png";
import { useMediaQuery } from "react-responsive";
import Profilemob from "./Profilemob";

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
import logout from "../assets/logout.png";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Header from "./Header";

//main function

const Profile = () => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1000px)" });
  const [name, setName] = useState("");
  const { abc } = useParams();
  const [selfData, setSelfData] = useState([]);
  const { interests, setInterests } = useContext(ProfileContext);
  const { selfid, setSelfid } = useContext(ProfileContext);
  const { mutualusers, setMutualusers } = useContext(ProfileContext);
  //const [uid, setUid] = useState("");
  const uid = abc;
  console.log(selfid, "asdaqdefdf");
  console.log(uid + "abc");

  const [profpic, setProfpic] = useState(""); //to store profile pic
  const [isFriend, setIsFriend] = useState(false); //to check if user is friend
  const [userid, setUserid] = useState("");
  const [visible, setVisible] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [userData, setUserData] = useState([]);

  const interestRef = doc(db, "users", uid);
  const [about, setAbout] = useState("");

  const [searcher, setSearcher] = useState("");
  const [userName, setuserName] = useState("");
  const [userprofpic, setuserprofpic] = useState("");
  const [queri, setQueri] = useState("");
  const [pending, setPending] = useState(false);
  const [alreadyrec, setAlreadyrec] = useState(false);

  const [loading, setLoading] = useState(false);

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
        setSelfid(user.uid);
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
      setSelfData(docSnap.data());
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
      setUserData(docSnap.data());
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

  //function to show that you have already received a request from the user and to show the accept button
  async function checkReqlist() {
    const userRef = doc(db, "users", userid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const received = docSnap.data().received;
      if (received.includes(uid)) {
        setAlreadyrec(true);
      } else {
        setAlreadyrec(false);
      }
    }
  }

  useEffect(() => {
    checkReqlist();
  }, [uid, userid]);

  //function to accept request and add to friends list
  async function acceptRequest() {
    const userRef = doc(db, "users", userid);
    const profRef = doc(db, "users", uid);
    const profSnap = await getDoc(profRef);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        received: arrayRemove(uid),
        friends: arrayUnion(uid),
      });
    }
    if (profSnap.exists()) {
      await updateDoc(profRef, {
        sent: arrayRemove(userid),
        friends: arrayUnion(userid),
      });
    }
    setIsFriend(true);
    setPending(false);

    console.log("request accepted");
    window.location.reload();
  }

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

  //function to unfriend user and remove from friends array
  async function unfriend() {
    const userRef = doc(db, "users", userid);
    const profRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    await updateDoc(userRef, { friends: arrayRemove(uid) });
    await updateDoc(profRef, { friends: arrayRemove(userid) });
    setIsFriend(false);
    window.location.reload();
  }

  //function to call mutuals function
  async function mutuals() {
    setMutualusers([]);
    console.log("Mutuals");
    const userRef = doc(db, "users", userid);
    const profRef = doc(db, "users", uid);

    const docSnap = await getDoc(userRef);
    const profSnap = await getDoc(profRef);

    const userfriends = docSnap.data().friends;
    const profriends = profSnap.data().friends;
    const mutual = userfriends.filter((uid) => profriends.includes(uid));
    console.log("mutuals is calle1212");

    setMutualcount(mutual.length);

    const q = query(collection(db, "users"), where("uid", "in", mutual));
    const querySnapshot = await getDocs(q);
    const newmut = [];
    querySnapshot.forEach((doc) => {
      newmut.push(doc.data());

      //console.log(doc.id, " => ", doc.data());
    });

    console.log(newmut);
    setMutualusers(newmut);
  }

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
  }, [uid, userid, isTabletOrMobile]);

  useEffect(() => {
    if (uid === userid) {
      setIsUser(true);
    } else setIsUser(false);
  }, [uid, userid]);

  useEffect(() => {
    console.log("req changed");

    checkFriend();
  }, []);

  useEffect(() => {
    checkRequest();

    checkFriend();
  }, [uid, userid, isTabletOrMobile]);

  useEffect(() => {
    if (userid) {
      console.log("id cahged");
    }
  }, [userid]);

  return (
    <>
      {isTabletOrMobile ? (
        <Profilemob
          selfData={selfData}
          userdata={userData}
          isFriend={isFriend}
          alreadyrec={alreadyrec}
          isUser={isUser}
          mutualusers={mutualusers}
        />
      ) : (
        <div
          className="bg-bgcolor h-screen bg-cover bg-no-repeat w-screen fixed overflow-x-auto flex flex-col items-center"
          onClick={reqVisible}
        >
          <Header />

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
                    ) : alreadyrec ? (
                      <div
                        className="bg-green w-[13rem] mt-6 rounded-md text-2xl font-regular p-2 text-white shadow-md cursor-pointer"
                        onClick={acceptRequest}
                      >
                        Accept Request
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
                <div className="-ml-8 text-lg font-light text-gray-700 w-fill">
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
              <div className="bg-white shadow-md mt-16 mr-4 rounded-md flex flex-col overflow-x-hidden">
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
      )}
    </>
  );
};

export default Profile;
