import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mutualuser from "./Mutualuser";
import { collection, getDocs, query, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Suggestions = (props) => {
  const [userid, setUserid] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  //fetch user details from db
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid + " is the user in sug");
        setUserid(user.uid);
      } else {
        console.log("No user is signed in");
      }
    });
  }, []);

  //function to find users who are not friends of the current user but have mutual friends with the current user

  useEffect(() => {
    getSuggestions();
  }, [userid]);
  useEffect(() => {
    getSuggestions();
  }, []);

  return <div>
    
  </div>;
};

export default Suggestions;
