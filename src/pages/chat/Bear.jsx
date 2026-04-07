import React from 'react';
import './chat.css';

const Bear = ({ className }) => (
  <img 
    src="/bear.svg" 
    className={`bear-icon ${className || ''}`}
    alt="YeBOT Icon"
    referrerPolicy="no-referrer"
  />
);

export default Bear;
