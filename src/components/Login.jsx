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
    e.preventDefault();
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
        navigate(path);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/wrong-password") {
        }
        setErrormes(errorCode);
        console.log(errorCode);
      });
  };

  const handleLogin = (e) => {
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
    <div className="bg-bgcolor h-screen flex items-center bg-cover bg-no-repeat w-screen fixed overflow-x-auto">
      <div className="flex flex-col ml-48">
        <div className="font-bold text-6xl text-green  -mt-32">Connectify</div>
        <div className=" mt-10 text-3xl w-80 text-[#767676] font-medium">
          A place to network, connect and mingle, Join Now
        </div>
      </div>
      <div className="bg-white   mr-16 p-24  pt-64 ml-24 rounded-xl shadow-md flex flex-col">
        {signup ? (
          <form
            onSubmit={handleSignUp}
            className="flex flex-col space-y-8 font-light text-xl justify-center"
          >
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md -mt-48 ml-8 w-[25rem] focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              placeholder="Phone Number"
              className=" bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md  ml-8 w-[25rem] focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email Address"
              className=" bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md  ml-8 w-[25rem] focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md  ml-8 w-[25rem] focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
            />
          </form>
        ) : null}
        <div className=" mt-12">
          <div className="flex flex-row space-x-1">
            {signup ? (
              <div className="ml-8 text-lg">Already have an account? </div>
            ) : (
              <div className="ml-8 text-lg">Dont have an account? </div>
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
              className="bg-green text-white font-bold text-2xl p-2 rounded-md ml-8 w-[25rem] hover: "
              onClick={handleSignUp}
            >
              Register
            </button>
          ) : null}

          <div>
            {login ? (
              <div className="flex flex-col space-y-8 -mt-64 ">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email Address"
                  className="bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md  ml-8 w-[25rem] focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="bg-[#f0f0f0] border-2 border-gray-200 p-2 rounded-md  ml-8 w-[25rem] focus:outline-none focus:border-green shadow-[inset_0px_4px_10px_-1px_rgba(169,169,169,0.1),inset_0px_-4px_4px_rgba(194,194,194,0.1)]"
                />
                <button
                  className="bg-green text-white font-bold text-2xl p-2 rounded-md ml-8 w-[25rem] hover: "
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
      </div>
    </div>
  );
}

export default Login;
