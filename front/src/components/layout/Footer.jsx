// src/components/layout/Footer.js
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="container">
      <div className="footer bg-dark text-white mt-5 p-4 text-center">
        &copy; {new Date().getFullYear()} DevConnector
        <br />
        <Link to="/about">About this project</Link>
        <br />
        Footer
      </div>
    </div>
  );
};

export default Footer;
