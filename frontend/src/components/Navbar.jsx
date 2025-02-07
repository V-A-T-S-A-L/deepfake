import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Importing icons for the menu

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="p-4 bg-black text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={"/"} className="text-xl font-bold text-purple-500">Veracity.AI</Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-purple-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center gap-5">
          <Link className="hover:text-purple-400 transition-colors ease-in">Features</Link>
          <Link className="hover:text-purple-400 transition-colors ease-in">About</Link>
          <Link to="/signup">
            <button className="bg-purple-500 hover:bg-purple-400 transition-colors ease-in px-4 py-2 rounded-lg">
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button className="border px-4 py-2 rounded-lg hover:bg-purple-500 hover:border-black transition-colors ease-in">Login</button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-4">
          <Link>Features</Link>
          <Link>About</Link>
          <Link to="/signup">
            <button className="bg-purple-500 px-4 py-2 rounded-lg w-full">
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button className="border px-4 py-2 rounded-lg w-full">
              Login
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
