import React from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Button = (props) => {
  const navigate = useNavigate();

  const { url, title } = props;

  const handleClick = () => {
    navigate(url);
  };

  return (
    <div>
      <button
        className="px-6 py-1 transition-all border-2 rounded-full border-brightColor text-brightColor hover:bg-brightColor hover:text-white"
        onClick={handleClick}
      >
        {title}
      </button>
    </div>
  );
};

export default Button;
