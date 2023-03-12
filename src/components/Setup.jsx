import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, setDoc, addDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const Setup = () => {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [interests, setInterests] = useState("");
  const [uid, setUid] = useState("");
  const [file, setFile] = useState(null);
  const [imgUploaded, setImgUploaded] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem("name"));
    setUid(localStorage.getItem("uid"));
  }, []);
  function handleImg(e) {
    e.preventDefault();
    const file = e.target.files[0];
    console.log(file);
    setImgUploaded(true);
    setFile(file);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + file.name);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        console.log(snapshot);
      })
      .then(async () => {
        const url = await getDownloadURL(storageRef);
        console.log(url);

        const userRef = doc(collection(db, "users"), uid);
        setDoc(userRef, {
          name: name,
          about: about,
          interests: interests,
          uid: uid,
          imgurl: url,
        });
      });
  };
  return (
    <div className="h-screen w-screen bg-bgcolor flex flex-col bg-repeat-y overflow-scroll items-center">
      <div className=" justify-center w-[63rem]">
        <div className="text-4xl font-bold text-green self-start  mt-12">
          Hi {name},<br /> Let's setup your account...
        </div>
        <div className="bg-white mt-8 w-12/12 h-[40rem] rounded-md shadow-md">
          <div className="ml-48 ">
            <div className="text-[#444444] text-3xl font-semibold pt-4">
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
            <div className="text-[#444444] text-3xl font-semibold pt-4 mt-[1.5rem]">
              Upload an Image of yourself!
            </div>
            <div className="mt-8">
              <label
                htmlFor="asdsa"
                className="cursor-pointer font-bold text-xl bg-green p-2 text-white rounded-md"
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
                  <div className="">
                    <img
                      src={file ? URL.createObjectURL(file) : ""}
                      alt="img"
                      className="w-64 h-64 rounded-full ml-[30rem] -mt-[7rem] border-2 shadow-md"
                    />
                  </div>
                  <div className="-mt-32">You can always change this later</div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="bg-white mt-12  w-12/12 h-[22rem] rounded-md shadow-md flex flex-col items-center">
          <div className="pt-4 text-green font-bold text-3xl  ">
            Let’s get you going by connecting!
          </div>
          <input
            type="text"
            className=" w-7/12 h-12 mt-8 bg-[#f3f2f2] border-0 border-gray-200 p-2 rounded-md  focus:outline-none focus:border-green shadow-md text-xl font-light"
            placeholder="search for users"
          />
        </div>
        <div
          onClick={handleSubmit}
          className="bg-green p-2 mt-8 w-[17rem] ml-[23rem] pl-8 mb-8 rounded-md hover:bg-white hover:text-green hover:border-green border-2 cursor-pointer transition font-bold text-2xl text-white"
        >
          View your profile
        </div>
      </div>
    </div>
  );
};

export default Setup;
