// src/components/layout/Footer.js
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-black p-4 ">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between border-t">
        <span className="text-sm text-gray-500 sm:text-cneter dark:text-gray-400">
          © 2025{" "}
          <Link to="#" className="hover:underline">
            WHOISWATASHI{" "}
          </Link>
          . ALL Rights Reserved
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <Link to="#" className="hover:underline me-6">
              about
            </Link>
          </li>
          <li>
            <Link to="#" className=" hover:underline me-6" >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="#" className=" hover:underline me-6">
              Licensing
            </Link>
          </li>
          <li>
            <Link to="#" className=" hover:underline me-6">
              contact
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
