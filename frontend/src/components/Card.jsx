import { PenSquareIcon, Trash2Icon } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import "flowbite";

const Card = ({ event }) => {
  return (
    <div className="card w-full min-h-60 bg-base-100 shadow-sm">
      <div className="card-body p-8">
        <span className="badge badge-lg badge-warning text-base">
          {event.tier}
        </span>
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-5xl font-bold flex-1 leading-tight">
            {event.title}
          </h2>
          <span className="text-3xl whitespace-nowrap">lorem</span>
        </div>
        <ul className="mt-8 flex flex-col gap-3 text-lg">
          <li>
            <span>High-resolution image generation</span>
          </li>
        </ul>
        <div className="mt-auto pt-8">
          <button className="btn btn-primary btn-block btn-xl text-xl py-7 px-4">
            Direction
          </button>
        </div>
      </div>
    </div>
  );
};
export default Card;
