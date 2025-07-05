import React, { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import LogoBlue from "../../assets/images/logo_blue.svg";
import LogoWhite from "../../assets/images/logo_white.svg";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";
import { FaHome, FaFileAlt, FaComments, FaFilter, FaPen, FaClock, FaSignOutAlt, FaGlobe } from "react-icons/fa"; // Icons imported here

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const location = useLocation(); // Hook to get the current route

  // closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-oepn-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="" />
          <span className="sidebar-brand-text">Quickclip.</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <i className="fas fa-times" size={24}></i>
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/"
                className={`menu-link ${location.pathname === "/" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <FaHome />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/summarizer"
                className={`menu-link ${location.pathname === "/summarizer" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <FaFileAlt />
                </span>
                <span className="menu-link-text">Youtube Summarizer</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/chatbot"
                className={`menu-link ${location.pathname === "/chatbot" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <FaComments />
                </span>
                <span className="menu-link-text">Youtube ChatBot</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/commentfilter"
                className={`menu-link ${location.pathname === "/commentfilter" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <FaFilter />
                </span>
                <span className="menu-link-text">Yt Comment Filter</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/pdfsum"
                className={`menu-link ${location.pathname === "/pdfsum" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <FaPen />
                </span>
                <span className="menu-link-text">PDF Summarizer</span>
              </Link>
            </li>
            
            <li className="menu-item">
              <Link
                to="/pdfchatbot"
                className={`menu-link ${location.pathname === "/pdfchatbot" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <FaClock />
                </span>
                <span className="menu-link-text">Pdf Chatbot</span>
              </Link>
            </li>
            
           
            <li className="menu-item">
              <Link
                to="/websummarizer"
                className={`menu-link ${location.pathname === "/websummarizer" ? "active" : ""}`}
              >
                <span className="menu-link-icon">
                  <FaGlobe />
                </span>
                <span className="menu-link-text">Website Summarizer</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
