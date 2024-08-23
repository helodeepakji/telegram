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

const socket = io('https://telegram.softairtechnology.com');

const Battle = () => {
    const location = useLocation();
    const { opponentId } = location.state || {};

    const [userId, setUserId] = useState(0);
    const [username, setUsername] = useState('user');
    const [username2, setUsername2] = useState('user');
    const [room, setRoom] = useState('');
    const [fighter2Top, setFighter2Top] = useState(0);
    const [socketEffects, setSocketEffects] = useState([]);
    const [fighter1Top, setFighter1Top] = useState(0);
    const [effects, setEffects] = useState([]);
    const [fighter1Power, setFighter1Power] = useState(100);
    const [fighter2Power, setFighter2Power] = useState(100);
    const [isUserReady, setIsUserReady] = useState(false);
    const [isOpponentReady, setIsOpponentReady] = useState(false);
    const [userEffect, setUserEffect] = useState(null);
    const [opponentEffect, setOpponentEffect] = useState(null);

    const [isGameOver, setIsGameOver] = useState(false);
    const [winner, setWinner] = useState(null);


    const moveUp = () => {
        if (isUserReady && isOpponentReady) {
            setFighter1Top((prevTop) => {
                const newTop = prevTop > -50 ? prevTop - 50 : prevTop;
                socket.emit('moveFighter2', { room: room, newTop });
                return newTop;
            });
        }
    };

    const moveDown = () => {
        if (isUserReady && isOpponentReady) {
            setFighter1Top((prevTop) => {
                const newTop = prevTop <= 50 ? prevTop + 50 : prevTop;
                socket.emit('moveFighter2', { room: room, newTop });
                return newTop;
            });
        }
    };

    const addEffect = (type) => {
        if (isUserReady && isOpponentReady) {
            setUserEffect(type);
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

            if (type === 'lightning' && fighter1Top == fighter2Top) {
                if (opponentEffect === 'shield') {
                    // No change in power
                } else if (opponentEffect === 'fire') {
                    setFighter1Power(prev => prev - 2);
                    setFighter2Power(prev => prev - 2);
                } else {
                    setFighter2Power(prev => prev - 2);
                }
            } else if (opponentEffect === 'lightning') {
                setFighter1Power(prev => prev - 2);
            }

            const effectFighter2 = {
                id: Date.now(),
                type,
                style: { right: `${x}px`, top: `${y + fighter1Top}px` },
            };

            socket.emit('addFighterEffect', { room: room, effect: effectFighter2 });
        }
    };

    useEffect(() => {
        fetch('/username')
            .then(response => response.json())
            .then(data => {
                setUsername(data.username);
                setUserId(data.user_id);
                socket.emit('userLogin', { userId: data.user_id, username: data.username });
            });

        fetch('/getUsername/' + opponentId)
            .then(response => response.json())
            .then(data => {
                setUsername2(data.username);
                const roomName = [userId, opponentId].sort().join('-');
                setRoom(roomName);
            });

        socket.on('moveFighter2', ({ userid, newTop }) => {
            if (userid !== userId) {
                setFighter2Top(newTop);
            }
        });

        socket.on('addFighterEffect', ({ userid, effect }) => {
            if (userid !== userId) {
                setSocketEffects((prevEffects) => [...prevEffects, effect]);

                setTimeout(() => {
                    setSocketEffects((prevEffects) => prevEffects.filter((e) => e.id !== effect.id));
                }, effect.type === 'lightning' ? 500 : 100);

                setOpponentEffect(effect.type);

                if (effect.type === 'lightning' && fighter1Top == fighter2Top) {
                    if (userEffect === 'shield') {
                        // No change in power
                    } else if (userEffect === 'lightning') {
                        setFighter1Power(prev => prev - 2);
                        setFighter2Power(prev => prev - 2);
                    } else {
                        setFighter1Power(prev => prev - 2);
                    }
                }
            }
        });

        socket.on('opponentReady', () => {
            setIsOpponentReady(true);
        });

        return () => {
            socket.off('moveFighter2');
            socket.off('addFighterEffect');
            socket.off('opponentReady');
        };
    }, [userId, opponentId]);

    useEffect(() => {
        if (room) {
            socket.emit('joinFightRoom', room);
        }
    }, [room]);

    const handleUserReady = () => {
        setIsUserReady(true);
        socket.emit('userReady', room);
    };


    useEffect(() => {
        if (fighter1Power <= 0 && fighter2Power > 0) {
            setWinner('opponent');
            setIsGameOver(true);
        } else if (fighter2Power <= 0 && fighter1Power > 0) {
            setWinner('user');
            setIsGameOver(true);
        } else if (fighter1Power <= 0 && fighter2Power <= 0) {
            setWinner('draw');
            setIsGameOver(true);
        }
    }, [fighter1Power, fighter2Power]);

    const handleRestart = () => {
        setFighter1Power(100);
        setFighter2Power(100);
        setIsGameOver(false);
        setWinner(null);
        setEffects([]);
        setSocketEffects([]);
        setUserEffect(null);
        setOpponentEffect(null);
        setIsUserReady(false);
        setIsOpponentReady(false);

        socket.emit('resetGame', { room });
    };

    socket.on('resetGame', () => {
        handleRestart();
    });

    return (
        <div className="content container-sm contentfight">
            {isGameOver ? (
                <div className="game-over-screen">
                    {winner === 'user' ? (
                        <h1>Congratulations! You Won!</h1>
                    ) : winner === 'opponent' ? (
                        <h1>You Lost! Better Luck Next Time!</h1>
                    ) : (
                        <h1>It's a Draw!</h1>
                    )}
                    <button onClick={handleRestart}>Play Again</button>
                </div>
            ) : (
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
                            <div className="progress-bar" style={{ width: `${fighter1Power}%` }}></div>
                        </div>
                        <div className="level">
                            <div className="text">
                                <p>01:00</p>
                            </div>
                        </div>
                        <div className="progress one two">
                            <div className="progress-bar" style={{ width: `${fighter2Power}%` }}></div>
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
                            <div className="">
                                <button onClick={handleUserReady} disabled={isUserReady}>
                                    {isUserReady ? "Waiting for Opponent..." : "Ready"}
                                </button>
                            </div>
                        </div>
                        <div className="others">
                            <div className="top">
                                <img id="sparkle" className="circle-image" src={FireImg} alt="" onClick={() => addEffect('lightning')} />
                            </div>
                            <div className="middle">
                                <img className="circle-image" src={RankImg} alt="" onClick={() => addEffect('shield')} />
                            </div>
                            <div className="bottom">
                                <img className="circle-image" src={AttackImg} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            )};
        </div>
    );
};

export default Battle;