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
  const [feedposts, setFeedPosts] = useState([]);
  const [img, setImg] = useState(null);
  const [content, setContent] = useState("");
  const [postUpdated, setPostUpdated] = useState(false);

  //function to update the post object to the document of the user by uploading image first

  const postData = async () => {
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
          }),
        }).then(() => {
          //to update or refresh page after post
          setPostUpdated(true);
          if (postUpdated) {
            setContent("");
            setImg(null);
          }
        });

        console.log(postUpdated);
      });
  };

  //function to fetch friends posts from the database
  const fetchPosts = async () => {
    const userRef = doc(collection(db, "users"), userid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const friends = userDoc.data().friends;
      const q = query(collection(db, "users"), where("uid", "in", friends));
      const querySnapshot = await getDocs(q);
      const newrec = [];
      querySnapshot.forEach((doc) => {
        newrec.push(doc.data().posts);
        console.log(doc.data().posts);
      });
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid + " is the user");
        console.log("user is signed in");
        setUserid(user.uid);
      }
    });
    fetchPosts();
  }, []);

  return (
    <div className="bg-bgcolor h-screen bg-cover bg-no-repeat w-screen fixed overflow-x-auto flex flex-col items-center  ">
      <div className="z-20">
        <Header />
      </div>
      <div className="flex space-x-16 ml-[20rem]">
        <div className="flex  -ml-[22rem] flex-col bg-white w-64 h-[30rem] rounded-md shadow-md  "></div>
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
          <div className="bg-white w-fill h-[30rem] rounded-md shadow-md mt-8 ">
            {/*friends posts */}
          </div>
        </div>
        <div className="bg-white shadow-md rounded-md flex flex-col">
          <div className="text-3xl font-semibold p-16 pt-2 text-green ">
            All Friends
          </div>
          {/* {mutiszero ? "" : <Mutuals users={mutualusers} />} */}
        </div>
      </div>
    </div>
  );
};

export default Feed;
