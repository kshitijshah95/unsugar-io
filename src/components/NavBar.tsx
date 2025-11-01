import React from "react";
import { Link } from "react-router-dom";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  return (
    <header>
      <Link to="/">Unsugar.io</Link>
      <Link to="/blog">Blog</Link>
    </header>
  )
}

export default NavBar;