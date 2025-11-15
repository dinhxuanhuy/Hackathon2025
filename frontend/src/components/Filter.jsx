import React from "react";

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
            Filter
          </div>
          <ul
            tabIndex="-1"
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Filter;
