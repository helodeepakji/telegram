import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import FightImg1 from "../assets/figher.png";
import FightImg2 from "../assets/fighter3.png";
import LogoImg from "../assets/logo (1).png";
import UpImg from "../assets/up.png";
import DownImg from "../assets/down.png";
import FireImg from "../assets/circle1.png";
import RankImg from "../assets/circle2.png";
import AttackImg from "../assets/circle3.png";
import { io } from "socket.io-client";

const socket = io('http://127.0.0.1:8000');

const Battle = () => {

    const location = useLocation();
    const { opponentId } = location.state || {}; 
console.log(opponentId);
console.log("Location state:", location.state);


    

    // const [opponentId, setOpponentId] = useState(0);
    const [userId, setUserId] = useState(0);
    const [username, setUsername] = useState('user');
    const [username2, setUsername2] = useState('user');
    const [room, setRoom] = useState('');
    const [fighter2Top, setFighter2Top] = useState(0);
    const [socketEffects, setSocketEffects] = useState([]);
    const [fighter1Top, setFighter1Top] = useState(0);
    const [effects, setEffects] = useState([]);

    const moveUp = () => {
        setFighter1Top((prevTop) => {
            const newTop = prevTop > -50 ? prevTop - 50 : prevTop;
            socket.emit('moveFighter2', { room: room, newTop }); // Emit the movement to the server
            return newTop;
        });
    };

    const moveDown = () => {
        setFighter1Top((prevTop) => {
            const newTop = prevTop <= 50 ? prevTop + 50 : prevTop;
            socket.emit('moveFighter2', { room: room, newTop }); // Emit the movement to the server
            return newTop;
        });
    };

    const addEffect = (type) => {
        const fighter1 = document.querySelector('.fighter1Img');
        const rect = fighter1.getBoundingClientRect();
        const x = rect.width / 2 + (type === 'lightning' ? 35 : -5);
        const y = rect.height / 2 + (type === 'lightning' ? -60 : -80);

        const effect = {
            id: Date.now(),
            type,
            style: { left: `${x}px`, top: `${y + fighter1Top}px` },
        };

        setEffects((prevEffects) => [...prevEffects, effect]);

        setTimeout(() => {
            setEffects((prevEffects) => prevEffects.filter((e) => e.id !== effect.id));
        }, type === 'lightning' ? 500 : 100);

        const effectFighter2 = {
            id: Date.now(),
            type,
            style: { right: `${x}px`, top: `${y + fighter1Top}px` },
        };

        socket.emit('addFighterEffect', { room: room, effect: effectFighter2 });
    };

    // const addFighterEffect = (type) => {
    //     const fighter1 = document.querySelector('.fighter2Img');
    //     const rect = fighter1.getBoundingClientRect();
    //     const x = rect.width / 2 + (type === 'lightning' ? 35 : -5);
    //     const y = rect.height / 2 + (type === 'lightning' ? -90 : -80);

    //     const effect = {
    //         id: Date.now(),
    //         type,
    //         style: { right: `${x}px`, top: `${y + fighter2Top}px` },
    //     };

    //     setSocketEffects((prevEffects) => [...prevEffects, effect]);

    //     setTimeout(() => {
    //         setSocketEffects((prevEffects) => prevEffects.filter((e) => e.id !== effect.id));
    //     }, type === 'lightning' ? 500 : 100);
    // };

    useEffect(() => {

        fetch('/username')
            .then(response => response.json())
            .then(data => {
                setUsername(data.username);
                setUserId(data.user_id);
                socket.emit('userLogin', { userId : data.user_id, username: data.username });
            });

        fetch('/getUsername/' + opponentId)
            .then(response => response.json())
            .then(data => {
                setUsername2(data.username);
                const roomName = [userId, opponentId].sort().join('-');
                setRoom(roomName);
            });


        // Listen for fighter movement from the socket
        socket.on('moveFighter2', ({ userid, newTop }) => {
            if (userid !== userId) {
                setFighter2Top(newTop);
                console.log(`Received moveFighter2 with newTop: ${newTop}`);
            }
        });

        // Listen for fighter effects from the socket
        socket.on('addFighterEffect', ({ userid, effect }) => {
            if (userid !== userId) {
                setSocketEffects((prevEffects) => [...prevEffects, effect]);

                setTimeout(() => {
                    setSocketEffects((prevEffects) => prevEffects.filter((e) => e.id !== effect.id));
                }, effect.type === 'lightning' ? 500 : 100);
            }
        });

        // Cleanup on component unmount
        return () => {
            socket.off('moveFighter2');
            socket.off('addFighterEffect');
        };
        // }
    }, [userId, opponentId]);

    useEffect(() => {
        if (room) {
            socket.emit('joinFightRoom', room);
        }
    }, [room]);

    return (
        <div className="content container-sm contentfight">
            <div className="inner-box">
                <div className="first">
                    <div className="moon-bunny">
                        <img src={LogoImg} />
                        <h6>{username}</h6>
                    </div>
                    <h2>VS</h2>
                    <div className="moon-bunny pudgy">
                        <img src={LogoImg} />
                        <h6>{username2}</h6>
                    </div>
                </div>
                <div className="first">
                    <div className="progress one">
                        <div className="progress-bar"></div>
                    </div>
                    <div className="level">
                        <div className="text">
                            <p>01:00</p>
                        </div>
                    </div>
                    <div className="progress one two">
                        <div className="progress-bar"></div>
                    </div>
                </div>
                <div className="fighters">
                    <div className="fighter1">
                        <img className="fighter1Img" src={FightImg1} alt="" style={{ top: `${fighter1Top}px`, position: 'relative' }} />
                        {effects.map((effect) => (
                            <div key={effect.id} className={effect.type} style={effect.style}></div>
                        ))}
                    </div>
                    <div className="fighter2">
                        <img className="fighter2Img" src={FightImg2} alt="" style={{ top: `${fighter2Top}px`, position: 'relative' }} />
                        {socketEffects.map((effect) => (
                            <div key={effect.id} className={effect.type} style={effect.style}></div>
                        ))}
                    </div>
                </div>
                <div id="shadow"></div>
                <div className="circlesBox">
                    <div className="arrows">
                        <div className="">
                            <img className="circle-image move-up" src={UpImg} onClick={moveUp} alt="" />
                        </div>
                        <div className="">
                            <img className="circle-image move-down" src={DownImg} onClick={moveDown} alt="" />
                        </div>
                    </div>
                    <div className="others">
                        <div className="top">
                            <img id="sparkle" className="circle-image" src={FireImg} alt="" onClick={() => addEffect('lightning')} />
                        </div>
                        <div className="middle">
                            <img class="circle-image" src={RankImg} alt="" onClick={() => addEffect('shield')} />
                        </div>
                        <div className="bottom">
                            <img className="circle-image" src={AttackImg} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Battle;