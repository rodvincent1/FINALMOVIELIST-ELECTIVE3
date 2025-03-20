// components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-secondary py-6 mt-10">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} ElecMovie. All rights reserved.</p>
        <div className="mt-4">
          <a href="#" className="hover:text-accent mx-2">Privacy Policy</a>
          <a href="#" className="hover:text-accent mx-2">Terms of Service</a>
          <a href="#" className="hover:text-accent mx-2">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;