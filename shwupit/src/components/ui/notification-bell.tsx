import React from "react";
import { Badge } from "./badge";

const NotificationBell = () => {
  return (
    <div className="relative">
      {/* <Badge className="absolute text-lg">
        1
      </Badge> */}
      <svg
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="h-5 w-5 text-current"
        width="21"
        height="21"
      >
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"></path>
      </svg>
    </div>
  );
};

export default NotificationBell;
