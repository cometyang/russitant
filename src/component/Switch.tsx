import React, { useState } from "react";

const Switch = ({
  name,
  value,
  onChange,
  disabled,
  ...otherProps
}) => {
  const [isChecked, setIsChecked] = useState(value);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <label>
      <input
        type="checkbox"
        name={name}
        value={isChecked}
        onChange={handleChange}
        {...otherProps}
      />
      {isChecked ? "Open AI On" : "Open AI Off"}
    </label>
  );
};

export default Switch; 