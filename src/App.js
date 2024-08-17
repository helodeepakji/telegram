

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import LeaderBoard from "./pages/Leaderboard";
import Referral from "./pages/Referral";
import Bottom from "./components/Bottom";
import Task from "./pages/Task";
import Wallet from "./pages/Wallet";
import Fight from "./pages/Fight";


const tele = window.Telegram.WebApp;

const App = () => {

  useEffect(() => {
    tele.ready();
  })


  const ProtectedRoute = ({ element }) => {
    // return user ? element : <Navigate to="/" />;
    return element;
  };

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/leaderboard" element={<ProtectedRoute element={<LeaderBoard />} />} />
          <Route path="/referral" element={<ProtectedRoute element={<Referral />} />} />
          <Route path="/tasks" element={<ProtectedRoute element={<Task />} />} />
          <Route path="/wallet" element={<ProtectedRoute element={<Wallet />} />} />
          <Route path="/fight" element={<ProtectedRoute element={<Fight />} />} />
        </Routes>
      </div>
      <Bottom />
    </Router>
  );
};

export default App;


// <Route
//             path="/leaderboard"
//             element={<ProtectedRoute element={<LeaderBoard />} />}
//           />
//           <Route
//             path="/status"
//             element={<ProtectedRoute element={<Status />} />}
//           />
// <Route path="/*" element={<p>Comming Soon</p>} />