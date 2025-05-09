import { useState, useEffect } from 'react';
import '../styles.css';

function Checkbox({ checked, onChange, disabled = false }) {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleClick = () => {
    if (!disabled) {
      setIsChecked(!isChecked);
      onChange?.(!isChecked);
    }
  };

  return (
    <div 
      className={`ios-checkbox ${isChecked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
    >
      <div className="ios-checkbox-inner" />
    </div>
  );
}

export default Checkbox; 