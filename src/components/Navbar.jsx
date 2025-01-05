import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="text-white px-4 py-2 shadow-md">
      <div className="flex justify-between ">
        <div className="text-lg font-bold">Custom Sheets </div>
        <div className="flex space-x-4">
          <Link to="/" className="hover:cursor-not-allowed transition-colors">
            Home
          </Link>
          <Link
            to="/about"
            className="hover:cursor-not-allowed transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:cursor-not-allowed transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
