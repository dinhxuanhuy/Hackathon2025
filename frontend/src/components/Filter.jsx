import React from "react";
import { Funnel } from "lucide-react";
const Filter = () => {
  return (
    <div>
      <div className="flex items-center justify-evenly mt-5">
        <h3 className="text-3xl font-bold text-primary tracking-tight">
          Các sự kiện
        </h3>
      </div>
      <div className="flex items-center justify-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-md m-1">
            Filter <Funnel className="size-4" />
          </div>
          <ul
            tabIndex="-1"
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li>
              <a>All</a>
            </li>
            <li>
              <a>Class</a>
            </li>
            <li>
              <a>Other events</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Filter;
