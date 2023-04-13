import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { db } from "../firebase";

const Posts = (props) => {
  console.log(props.posts);
  const navigate = useNavigate();

  return (
    <div>
      {props.posts.map((post) => {
        const handleClick = () => {
          const path = `/profile/${post.uid}`;
          navigate(path);
        };
        return (
          <div className="bg-white flex flex-col  justify-center mt-8 mb-8 shadow-md rounded-md">
            <div
              onClick={handleClick}
              className="text-green font-semibold sm:text-2xl self-start my-2 sm:m-4 mx-2 mt-2 cursor-pointer hover:text-[#3d7438]"
            >
              {post.name}
            </div>
            <div className="text-gray-400 ml-2 sm:mx-4 text-xs sm:text-lg">
              {post.time}
            </div>
            <div className="text-black  text-[10px] sm:text-[16px] sm:mx-4 self-start m-4 ml-2">
              {post.content}
            </div>
            <img src={post.img} alt="" className=" w-fill rounded-lg p-1 " />
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
