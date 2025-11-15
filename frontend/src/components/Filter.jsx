import React from "react";
import { Funnel } from "lucide-react";
const Filter = ({ currentFilter, onFilterChange }) => {
  return (
    <div>
      <div className="flex items-center justify-evenly mt-5">
        <h3 className="text-4xl font-bold font-sans text-infor-content tracking-tight">
          Events
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
              <a onClick={() => onFilterChange("all")}>All</a>
            </li>
            <li>
              <a onClick={() => onFilterChange("class")}>Class</a>
            </li>
            <li>
              <a onClick={() => onFilterChange("other")}>Other events</a>
            </li>
            <li>
              <a onClick={() => onFilterChange("ongoing")}>Đang diễn ra</a>
            </li>
            <li>
              <a onClick={() => onFilterChange("upcoming")}>Sắp diễn ra</a>
            </li>
            <li>
              <a onClick={() => onFilterChange("ended")}>Đã kết thúc</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Filter;
