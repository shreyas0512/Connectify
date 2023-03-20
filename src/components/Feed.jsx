import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Mutuals from "./Mutuals";
import { ProfileContext } from "../Contexts/ProfileContext";
import { useContext } from "react";
import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gallery from "../assets/gallery.png";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Posts from "./Posts";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const Feed = () => {
  const [userid, setUserid] = useState("");
  const { requ, setRequ } = useContext(ProfileContext);
  const [feedposts, setFeedposts] = useState([]);
  const [img, setImg] = useState(null);
  const [content, setContent] = useState("");
  const [postUpdated, setPostUpdated] = useState(false);
  const [friends, setFriends] = useState([]);
  const { name, setName } = useContext(ProfileContext);
  const [suggestions, setSuggestions] = useState([]);
  const [imgError, setImgError] = useState(false);

  //function to get all details of friends of user from database
  const getFriends = async () => {
    const userRef = doc(collection(db, "users"), userid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      console.log("Document data:", userDoc.data());
      const allfrnds = userDoc.data().friends;
      console.log("friends array ", allfrnds);
      const q = query(collection(db, "users"), where("uid", "in", allfrnds));
      const querySnapshot = await getDocs(q);
      const newrec = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        newrec.push(doc.data());
      });
      console.log("newrec");
      console.log(newrec);
      setFriends(newrec);
    } else {
      console.log("No such document!");
    }
  };

  //function to get users name
  const getName = async () => {
    const userRef = doc(collection(db, "users"), userid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      setName(userDoc.data().name);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getName();
  }, [userid]);

  useEffect(() => {
    getFriends();
  }, [userid]);

  //function to update the post object to the document of the user by uploading image first
  const postData = async () => {
    setImgError(false);
    if (img == null) {
      setImgError(true);
    }

    setPostUpdated(false);

    const storage = getStorage();
    const storageRef = ref(storage, "postimages/" + img.name);
    uploadBytes(storageRef, img)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        console.log(snapshot);
      })
      .then(async () => {
        const url = await getDownloadURL(storageRef);
        console.log(url);

        const userRef = doc(collection(db, "users"), userid);

        updateDoc(userRef, {
          posts: arrayUnion({
            content: content,
            img: url,
            time: new Date().toLocaleString(),
            uid: userid,
            name: name,
          }),
        });
        setImg(null);
        setContent("");
        //to update or refresh page after post
        setPostUpdated(true);
        if (postUpdated) {
          setContent("");

          //after a timeout of 2 second, set postUpdated to false
        }
      });
  };

  const newrec = [];
  //function to fetch friends posts from the database

  const fetchPosts = async () => {
    const userRef = doc(collection(db, "users"), userid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      console.log("fetching posts");
      const friends = userDoc.data().friends;
      const q = query(collection(db, "users"), where("uid", "in", friends));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const posts = doc.data().posts;
        if (posts) {
          posts.forEach((post) => {
            newrec.push(post);
            console.log(newrec);
          });
          setFeedposts(newrec);
        }
      });
    } else {
      console.log("No such document!");
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
    getSuggestions();
  }, [userid]);
  useEffect(() => {
    getSuggestions();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [userid]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid + " is the user");
        console.log("user is signed in");
        setUserid(user.uid);
      }
    });
  }, []);

  return (
    <div className="bg-bgcolor h-screen bg-cover bg-no-repeat w-screen fixed overflow-x-auto flex flex-col items-center">
      <div className="z-20">
        <Header />
      </div>
      <div className="flex space-x-16 ml-[20rem]">
        <div className="flex  -ml-[22rem] flex-col bg-white w-64 h-[30rem] rounded-md shadow-md overflow-y-auto overflow-x-hidden scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-400 scrollbar-corner-neutral-800">
          <div className="text-2xl font-semibold text-center pt-2 text-green mb-4">
            Suggestions
          </div>
          <Mutuals users={suggestions} />
        </div>
        <div className=" h-screen w-[30rem]  flex flex-col">
          <div className="bg-white w-fill  rounded-md shadow-md flex flex-col justify-center  ">
            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              className="w-[29rem] h-20 mt-4
              m-2 rounded-md shadow-md p-2  focus:border-none focus:outline-none resize-none"
              placeholder="What's on your mind?"
            />
            <div className="flex self-end">
              <div className="mt-4 flex flex-col">
                <label for="hiddenFileInput" className="ml-8">
                  <img
                    src={gallery}
                    alt=""
                    className="w-8 h-8 mr-4 mt-0.5 cursor-pointer shadow-xl"
                  />
                </label>
                <input
                  type="file"
                  id="hiddenFileInput"
                  onChange={(e) => setImg(e.target.files[0])}
                  style={{ visibility: "hidden" }}
                />
                {imgError && (
                  <div className="text-center text-red-700 text-md mb-8 ml-24">
                    You must upload image before posting
                  </div>
                )}
                {postUpdated && (
                  <div className="text-center text-[#36953e] text-md mb-8 ml-24 font-semibold">
                    Posted Succesfully!
                  </div>
                )}
                {img ? (
                  <img
                    src={img ? URL.createObjectURL(img) : ""}
                    alt=""
                    className="w-96 h-96 ml-12 rounded-md mb-4 mt-0.5 cursor-pointer shadow-md "
                  />
                ) : (
                  ""
                )}
              </div>
              <div
                onClick={postData}
                className="text-white mt-4 bg-green shadow-lg p-1 w-28 rounded-md text-center mr-2 h-10  text-xl font-semibold  cursor-pointer"
              >
                Post
              </div>
            </div>
          </div>
          <div className=" w-fill  mt-8 text-black ">
            {/*friends posts */}

            <Posts posts={feedposts} />
          </div>
        </div>
        <div className="bg-white shadow-md  mr-4 rounded-md flex flex-col overflow-x-hidden h-[30rem] ">
          <div className="text-2xl font-semibold p-16 pt-2 text-green ">
            All Friends
          </div>
          <div className="-mt-8 ml-8 mb-2 text-gray-400"></div>
          <div className="flex flex-row">
            <Mutuals users={friends} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
