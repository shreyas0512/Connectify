import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import logout from "../assets/logout.png";
import { signOut } from "firebase/auth";

const Profile = () => {
  const [name, setName] = useState("");
  const { abc } = useParams();
  const uid = abc;
  const [profpic, setProfpic] = useState("");

  const interestRef = doc(db, "users", uid);
  const [about, setAbout] = useState("");
  const [interests, setInterests] = useState("");
  const aboutRef = doc(db, "users", uid);
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
  useEffect(() => {
    console.log(uid);
    if (uid) {
      getPic();
    }
  }, [uid]);

  return (
    <div className="bg-bgcolor h-screen bg-cover bg-no-repeat w-screen fixed overflow-x-auto flex flex-col">
      <div className="flex flex-row justify-between">
        <input
          className="w-72 h-12 rounded-md bg-white shadow-md m-8 ml-4 font-medium pl-2 focus:outline-none resize-none "
          placeholder="Search for Users"
        />
        <div className="flex mt-4">
          <div className="bg-green pr-2 h-12  mr-8 rounded-md font-bold text-white pt-3 pl-16 text-sm flex cursor-pointer">
            <img
              src={profpic}
              alt="a"
              className="h-10 w-10 -ml-14 rounded-sm -mt-[8px] mr-3 cursor-pointer"
            />
            Hi, {name}
          </div>
          <img src={logout} className="h-8 w-8 mt-2 mr-2 cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <div className="bg-white p-12 m-4 mt-28 shadow-md rounded-lg flex flex-col w-[52rem]">
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
                <div className="bg-green w-[11rem] mt-6 rounded-md text-2xl font-regular p-2 text-white shadow-md cursor-pointer">
                  + Connect
                </div>
              </div>
            </div>
            <div className="h-[2.5px] w-[50rem] bg-[#DBDADA] mt-4 -ml-8 "></div>
            <div className="text-xl text-[#929191] -ml-8">
              14 Mutual Friends
            </div>
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
        <div className="bg-white shadow-md mt-28 mr-4 rounded-md flex flex-col">
          <div className="text-3xl font-semibold p-16 pt-2 text-green ">
            Mutuals
          </div>
          <div className="flex flex-row">
            <img src={profpic} alt="" className="h-10 w-10 rounded-md ml-8" />
            <div className="flex flex-col ml-4">
              <div className="text-xl font-bold text-green">John Doe</div>
              <div className="text-sm font-light text-gray-700">
                14 Mutual Friends
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
