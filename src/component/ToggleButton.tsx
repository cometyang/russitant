import React, { useState } from "react";

const ToggleButton = ({ onLabel: string, offLabel:string }) => {
  const [isOn, setIsOn] = useState(false);

  const handleClick = () => {
    setIsOn(!isOn);
  };

  return (
    <button onClick={handleClick}>
      {isOn ? onLabel : offLabel}
    </button>
  );
};

export default ToggleButton;