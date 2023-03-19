import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { db } from "../firebase";

const Posts = (props) => {
  console.log(props);
  return (
    <div>
      {props.posts.map((post) => {
        <div>
          <div className="text-black bg-red-500">asdas</div>;
        </div>;
      })}
    </div>
  );
};

export default Posts;
