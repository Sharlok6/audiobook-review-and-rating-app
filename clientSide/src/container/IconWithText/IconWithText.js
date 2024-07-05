// IconWithText.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import './IconWithText.css'; // Make sure to import the CSS file

const IconWithText = ({ text }) => {
  return (
    <div className="icon-container">
      <FontAwesomeIcon icon={faMessage} size='5x'/>
      <span className="icon-text">{text}</span>
    </div>
  );
};

export default IconWithText;
