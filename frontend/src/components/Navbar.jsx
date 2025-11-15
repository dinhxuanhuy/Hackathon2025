import React from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10 min-h-18 min-w-screen flex items-center justify-center">
      <div className="mx-auto max-w-6xl p-4 w-full">
        <div className="flex items-center justify-center gap-8">
          <img src="../../public/utemap.png" alt="" className="max-h-7"/>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
