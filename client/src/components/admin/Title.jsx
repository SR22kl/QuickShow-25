import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <>
      <h1 className="text-2xl font-semibold">
        {text1} <span className="text-red-500">{text2}</span>
      </h1>
    </>
  );
};

export default Title;
