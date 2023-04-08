import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { ProfileContext } from "../Contexts/ProfileContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const { selfid, setSelfid } = useContext(ProfileContext);
  const [email, setEmail] = useState("");
  const { name, setName } = useContext(ProfileContext);
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(true);

  const [ud, setUd] = useState("");
  const [errormes, setErrormes] = useState("");
  let navigate = useNavigate();

  function setLocalStorage() {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      const uid = user.uid;

      setSelfid(uid);
    }
  });

  //set the name of user to name state variable
  async function setNameState() {
    const profRef = doc(db, "users", selfid);
    const docSnap = await getDoc(profRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setName(docSnap.data().name);
      console.log("Name is ", docSnap.data().name);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  useEffect(() => {
    setNameState();
    console.log("Name is ", name);
  }, [selfid]);

  useEffect(() => {
    // localStorage.setItem("uid", ud);
  }, [ud]);
  const handleSignUp = (e) => {
    setErrormes("");
    e.preventDefault();
    if (name == "") {
      setErrormes("Please Enter Name");
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          console.log(userCredential);
          const user = userCredential.user;
          const uid1 = user.uid;
          console.log(uid1);
          setUd(uid1);
          setLocalStorage();
          //localStorage.setItem("uid", uid1);

          let path = "/setup";
          if (name == "") {
            console.log("name is empty");
          } else {
            navigate(path);
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === "auth/internal-error") {
            setErrormes("Please Enter Password");
          }
          if (errorCode === "auth/wrong-password") {
            setErrormes("Wrong Password");
          }
          if (errorCode === "auth/email-already-in-use") {
            setErrormes("Email already in use");
          }
          if (errorCode === "auth/invalid-email") {
            setErrormes("Invalid Email");
          }
          if (errorCode === "auth/weak-password") {
            setErrormes("Weak Password");
          }
        });
    }
  };

  const handleLogin = (e) => {
    setErrormes("");
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        console.log(userCredential);
        const user = userCredential.user;
        const uid1 = user.uid;
        console.log(uid1);
        setUd(uid1);
        //localStorage.setItem("uid", uid1);
        setLocalStorage();
        let path = `/profile/${uid1}`;
        navigate(path);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/wrong-password") {
          setErrormes("Wrong Password");
          console.log(errormes);
        } else if (errorCode === "auth/user-not-found") {
          setErrormes("User not found");
        } else if (errorCode === "auth/invalid-email") {
          setErrormes("Invalid Email");
        } else if (errorCode === "auth/too-many-requests") {
          setErrormes("Too many requests");
        }

        console.log(errormes);
      });
  };
  function LoginPop() {
    setSignup(!signup);
    setLogin(!login);
  }

  return (
    <div className="bg-bgcolor h-screen flex flex-col sm:flex-row justify-center items-center bg-cover bg-no-repeat w-screen fixed overflow-y-auto">
      <div className="flex flex-col mt-10 self-start ml-9 sm:ml-48 sm:mt-64">
        <div className="font-bold self-start  sm:text-6xl text-4xl text-green  sm:mt-0 ">
          Connectify
        </div>
        <div className=" mt-2 mb-2 sm:mt-10 text-md sm:text-2xl  text-[#767676] font-medium">
          A place to network, connect and mingle, Join Now
        </div>
      </div>
      <div className="bg-white self-start ml-8 mb-8  w-10/12 sm:w-fit  sm:mr-16 sm:p-24 pt-64 sm:pt-64 sm:ml-24 rounded-xl shadow-md flex flex-col sm:mt-16 justify-center items-center">
        {signup ? (
          <form
            onSubmit={handleSignUp}
            className="flex flex-col space-y-8 font-light text-xl justify-center w-full px-4 sm:w-[25rem]"
          >
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md -mt-48 mx-4 focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              placeholder="Phone Number"
              className=" bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md  mx-4 focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email Address"
              className=" bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md mx-4  focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md  mx-4  focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
            />
          </form>
        ) : null}
        <div className=" mt-12 flex flex-col">
          <div className="flex flex-row space-x-1">
            {signup ? (
              <div className="sm:ml-8 text-lg">Already have an account? </div>
            ) : (
              <div className="sm:ml-8 text-lg">Dont have an account? </div>
            )}
            {login ? (
              <h1
                className="text-textgreen cursor-pointer mb-2 text-lg "
                onClick={LoginPop}
              >
                Register
              </h1>
            ) : (
              <h1
                className="text-textgreen cursor-pointer mb-2 text-lg "
                onClick={LoginPop}
              >
                Login
              </h1>
            )}
          </div>
          {signup ? (
            <button
              className="bg-green text-white font-bold text-2xl p-2 rounded-md  sm:w-[25rem] "
              onClick={handleSignUp}
            >
              Register
            </button>
          ) : null}

          <div className="">
            {login ? (
              <div className="flex flex-col space-y-8 -mt-64">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email Address"
                  className="bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md  focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md   focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
                />
                <button
                  className="bg-green text-white font-bold text-2xl p-2 rounded-md   "
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="mt-8 ml-8 text-red-700">{errormes}</div>
      </div>
    </div>
  );
}

export default Login;
