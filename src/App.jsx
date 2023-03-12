import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { signInWithEmailAndPassword } from "firebase/auth";

import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Setup from "./components/Setup";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<Setup />} />
      </Routes>
    </>
  );
}

export default App;
