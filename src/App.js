import supabaseClient from "./config/supabaseClient";
import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Chat from "./components/Chat";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:room" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
