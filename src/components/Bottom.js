import React from "react";
import { NavLink } from "react-router-dom";
import coinImag from "../assets/coin.png";

const Bottom = () => {
    return (
        <div className="bottom-nav">
            <div className="nav-container">
                <div className="nav-item-div">
                    <NavLink to="/home" className="nav-item" activeClassName="selected" exact>
                        <i className="fa fa-home"></i>
                        <span>Tap</span>
                    </NavLink>
                </div>
                <div className="nav-item-div">
                    <NavLink to="/leaderboard" className="nav-item" activeClassName="selected" exact>
                        <i className="fa fa-trophy"></i>
                        <span>Leaderboard</span>
                    </NavLink>
                </div>
                <div className="nav-item-div">
                    <NavLink to="/referral" className="nav-item" activeClassName="selected" exact>
                        <i className="fa fa-user-plus"></i>
                        <span>Referral</span>
                    </NavLink>
                </div>
                <div className="nav-item-div">
                    <NavLink to="/tasks" className="nav-item" activeClassName="selected" exact>
                        <i className="fa fa-tasks"></i>
                        <span>Tasks</span>
                    </NavLink>
                </div>
                <div className="nav-item-div">
                    <NavLink to="/wallet" className="nav-item" activeClassName="selected" exact>
                        <img src={coinImag} alt="Wallet" style={{ width: '20px' }} />
                        <span>Wallet</span>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Bottom;