import React from "react";
import FightImg from "../assets/figher.png";
// import Top from "../components/Top";
// import Header from "../components/Header";
// import HeroComp from "../components/HeroComp";

const Fight = () => {
  return (
    <div className="content container-sm text-center">
      <div className="center">
        <img src={FightImg} style={{ width: '150px' , paddingTop: '100px' }} className="bag" alt="" />
      </div>
      <div className="">
        <h4 className="text">Connect Fight</h4>
        <h5 className="smalltxt">
          connect Fight to access upcoming earning features coming
        </h5>
        <h5>Soon!</h5>
        <br/>
      </div>
      <div className="comesoonimg">
         <button className="coming_soon">Coming Soon</button>
      </div>
    </div>
  );
};

export default Fight;