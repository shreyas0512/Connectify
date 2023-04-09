import React from "react";
import MobileHeader from "./MobileHeader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect, useContext } from "react";
import { ProfileContext } from "../Contexts/ProfileContext";


const Profilemob = (props) => {
  const navigate = useNavigate();
  const { mutualusers, interests } = useContext(ProfileContext);

  return (
    <div className="bg-white h-screen w-screen flex flex-col items-center">
      <MobileHeader selfData={props.selfData} />

      <div className="bg-[#FFFFFF] w-11/12 mt-24 -ml-2 rounded-md shadow-md flex flex-col">
        <div className="flex">
          <img
            src={props.userdata.imgurl}
            className="rounded-full h-[100px] bg-gray-200 w-[100px] ml-6 -mt-8 shadow-sm object-cover"
          />
          <div className="flex flex-col">
            <div className="font-semibold text-md ml-8 mt-2 w-full">
              {props.userdata.name}
            </div>
            {!props.isUser ? (
              !props.isFriend ? (
                <div className="bg-green text-white rounded-md px-3 text-sm py-0.5 ml-8 w-28  mt-2">
                  + Connect
                </div>
              ) : (
                <div className="bg-green text-white rounded-md px-3 text-sm py-0.5 ml-8 w-28  mt-2">
                  Unfriend
                </div>
              )
            ) : (
              <div className="bg-green text-white rounded-md px-3 text-sm py-0.5 ml-8 w-28  mt-2">
                Edit Profile
              </div>
            )}
            {!props.isUser ? (
              <div className="text-gray-400 text-xs ml-8 mt-2 w-full">
                {mutualusers.length} Mutual Friends
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="h-[1px] w-full bg-gray-300 mt-32 -ml-64 mr-2 rounded-sm"></div>
        </div>
        <div className="ml-2 font-medium">About</div>
        <div className="ml-2 text-gray-500 text-xs mt-2 w-full m-2">
          {props.userdata.about}
        </div>
      </div>
      <div className="bg-[#FFFFFF] w-11/12 mt-4 -ml-2 rounded-md shadow-md flex flex-col ">
        <div className="ml-2 font-medium pt-2">Interests</div>
        <div className="ml-2 text-gray-600 text-xs mt-2 w-full m-2 py-1">
          {interests.split(" ").map((interest) => {
            return (
              <div className="bg-gray-200 rounded-md px-2 py-0.5 text-xs inline-block mr-2">
                {interest}
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-[#FFFFFF] w-11/12 mt-4 -ml-2 rounded-md shadow-md p-2 flex flex-col">
        {props.isUser ? <div>Friends</div> : <div>Mutuals</div>}
        <div className="flex flex-wrap mt-12 gap-y-8">
          {mutualusers.map((user) => {
            return (
              <div className="flex flex-col items-center">
                <img
                  src={user.imgurl}
                  className="rounded-full h-[80px] bg-gray-200 w-[80px] ml-6 -mt-8 shadow-sm object-cover"
                  onClick={() => {
                    navigate(`/profile/${user.uid}`);
                  }}
                />
                <div
                  className="text-xs text-gray-800 mt-2 text-center ml-6   w-[80px] hover:text-green"
                  onClick={() => {
                    navigate(`/profile/${user.uid}`);
                  }}
                >
                  {user.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profilemob;
