import React, { useState, useEffect } from "react";
import LogoImg from "../assets/x_logo.png";
import coinImag from "../assets/coin.png";
import checkImg from "../assets/check_img.png";
import teleLogo from "../assets/tele_logo.png";
import ytLogo from "../assets/yt_logo.png";

const Task = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/getTask')
      .then(response => response.json())
      .then(data => {
        setTasks(data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const doneTask = async (task_id, task_link) => {
    alert('Task done function called'); // Alert to ensure function is called
    try {
      const response = await fetch(`/api/donTask/${task_id}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Coin added:', result);

        // Update the task state to mark it as seen
        setTasks(tasks.map(task => task.id === task_id ? { ...task, seen: true } : task));

        // Open the link in a new tab
        window.open(task_link, '_blank');
      } else {
        console.error('Error adding coin:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding coin:', error);
    }
  };

  return (
    <div className="container">
      <div className="header-container">
        <h2>Tasks</h2>
      </div>
      {tasks.map(task => (
        <div key={task.id} className="referral-container">
          <div className="referral-overlay">
            <div className="tasks-card">
              <div style={{ display: 'flex' }}>
                <img src={task.image} className="tasks-card-coin-left" alt="Task" />
                <div className="referral-card-content">
                  <h1 className="referral-card-title task-card-title">{task.heading}</h1>
                  <p className="referral-card-subtitle" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <span style={{ color: '#ffc227' }}>
                      <img style={{ width: '12px', height: '12px' }} src={coinImag} alt="Coin" />
                    </span>
                    {task.coin}
                  </p>
                </div>
              </div>
              {task.seen ? (
                <img src={checkImg} style={{ width: '30px' }} alt="Seen" />
              ) : (
                <div onClick={() => doneTask(task.id, task.link)}>
                  <i className="fa fa-angle-right fa-2x" style={{ color: '#fff' }} aria-hidden="true"></i>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Task;
