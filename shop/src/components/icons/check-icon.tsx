import React from "react";

const CheckIcon: React.FC<React.SVGAttributes<{}>> = ({
    width = 20,
    height = 20,
    ...props
  }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-check2"
      viewBox="0 0 16 16"
    >
      <path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0"></path>
    </svg>
  );
}

export default CheckIcon;
