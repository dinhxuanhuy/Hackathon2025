import React from "react";
import { Link } from "react-router-dom";
import { PlusIcon, Map } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-base-100 border-b border-base-content/10 min-h-18 min-w-screen flex items-center justify-center">
      <div className="mx-auto max-w-6xl p-4 w-full">
        <div className="flex items-center justify-start gap-8">
          <div max-w-screen>
            <h3 className="text-secondary text-xl font-bold font-sans">
              UTEMap
            </h3>
          </div>

          {/*<img src="../../public/utemap.png" alt="" className="max-h-7" />*/}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
