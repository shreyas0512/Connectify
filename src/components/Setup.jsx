import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  setDoc,
  addDoc,
  doc,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase";
const Setup = () => {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [interests, setInterests] = useState("");
  const [userid, setUserid] = useState("");
  const [file, setFile] = useState(null);
  const [imgUploaded, setImgUploaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [queri, setQueri] = useState("");
  const [results, setResults] = useState([]);
  const [focus, setFocus] = useState(false);
  var received = {
    uid: "",
    read: false,
  };
  let navigate = useNavigate();

  useEffect(() => {
    setName(localStorage.getItem("name"));
    //setUid(localStorage.getItem("uid"));
  }, []);
  function handleImg(e) {
    e.preventDefault();
    const file = e.target.files[0];
    console.log(file);
    setImgUploaded(true);
    setFile(file);
  }

  //function to fetch autocomplete results
  const fetchResults = async () => {
    const q = query(
      collection(db, "users"),
      where("name", ">=", queri),
      where("name", "<=", queri + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    const newrec = [];
    querySnapshot.forEach((doc) => {
      newrec.push(doc.data());
    });

    setResults(newrec);
  };

  useEffect(() => {
    fetchResults();
    console.log("results", results);
  }, [queri]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid + " is the user");
        console.log("user is signed in");
        setUserid(user.uid);
        console.log("UID is ", userid);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    setImgError(false);
    e.preventDefault();
    if (file == null) {
      setImgError(true);
    }

    const storage = getStorage();
    const storageRef = ref(storage, "images/" + file.name);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        console.log(snapshot);
      })
      .catch((error) => {
        console.log(error);
        setImgError(true);
      })
      .then(async () => {
        const url = await getDownloadURL(storageRef);
        console.log(url);

        const userRef = doc(collection(db, "users"), userid);
        setDoc(userRef, {
          name: name,
          email: localStorage.getItem("email"),
          phone: localStorage.getItem("phone"),
          about: about,
          interests: interests,
          uid: userid,
          imgurl: url,
          friends: [],
          received: [],
          sent: [],
        });
        const path = `/profile/${userid}`;
        navigate(path);
      })

      .catch((error) => {
        console.log(error);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className=" min-w-screen min-h-screen bg-bgcolor flex flex-col bg-repeat-y overflow-x-hidden overflow-y-scroll justify-center box-border m-0">
      <div className=" flex flex-col  items-center justify-center mt-8   ">
        <div className="w-screen justify-center flex flex-col items-center">
          <div className="text-lg mt-8 sm:text-3xl font-bold text-green ">
            Hi {name}, Let's setup your account...
          </div>
          <div className="bg-white mt-8 flex flex-col w-9/12  items-center justify-center rounded-md shadow-md">
            <div className="text-[#444444] text-lg px-2 sm:text-2xl font-semibold pt-4 text-center">
              Share something about yourself...
            </div>
            <div className="text-[#444444] text-xl font-regular pt-4">
              about
            </div>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-9/12 pb-16 bg-[#f0f0f0] border-2 resize-none border-gray-200 p-2 rounded-md focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
            />
            <div className="text-[#444444] text-xl font-regular pt-4">
              Interests
            </div>
            <input
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              type="text"
              className="w-9/12 h-12 bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md  focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
            />
            <div className="text-[#444444] text-lg sm:text-xl font-semibold pt-4 pb-4">
              Upload an Image of yourself!
            </div>
            <div className="flex flex-col justify-center items-center">
              <label
                htmlFor="asdsa"
                className="cursor-pointer font-bold text-lg sm:text-xl bg-green p-2 text-white rounded-md"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="asdsa"
                onChange={handleImg}
                style={{
                  visibility: "hidden",
                }}
              />
              {imgUploaded ? (
                <div className="text-[#444444] text-xl font-regular pt-4">
                  <div className="flex justify-center -mt-2">
                    <img
                      src={file ? URL.createObjectURL(file) : ""}
                      alt="img"
                      className=" w-24 h-24 rounded-full border-2 shadow-md"
                    />
                  </div>
                  <div className="text-sm sm:text-lg">
                    You can always change this later
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {/* <div className="bg-white mt-12  w-12/12 h-[22rem] rounded-md shadow-md flex flex-col items-center">
          <div className="pt-4 text-green font-bold text-3xl  ">
            Let’s get you going by connecting!
          </div>
          <input
            type="text"
            onFocus={() => {
              setFocus(true);
              console.log("focus");
            }}
            onBlur={() => {
              setFocus(false);
              console.log("blur");
            }}
            onChange={(e) => setQueri(e.target.value)}
            className=" w-7/12 h-12 mt-8 bg-[#f3f2f2] border-0 border-gray-200 p-2 rounded-md  focus:outline-none focus:border-green shadow-md text-xl font-light"
            placeholder="search for users"
          />
          {focus && (
            <div className="w-7/12 z-30 bg-[#f3f2f2] border-0 border-gray-200 p-2 rounded-md  focus:outline-none focus:border-green shadow-md text-xl font-light">
              {results.map((result) => (
                <div className="flex flex-row items-center">
                  <div>{result.name}</div>
                </div>
              ))}
            </div>
          )}
        </div> */}
        <div
          onClick={handleSubmit}
          className="bg-green p-2 mt-8    mb-8 rounded-md hover:bg-white hover:text-green hover:border-green border-2 cursor-pointer transition font-bold text-lg sm:text-2xl text-white"
        >
          View your profile
        </div>
        {imgError ? (
          <div className="text-center -mt-8 text-red-700">
            You Must Upload Image to Create Account
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Setup;
