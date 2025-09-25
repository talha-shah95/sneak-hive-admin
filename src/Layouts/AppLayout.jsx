import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import "./style/AppLayout.css";

const AppLayout = ({ disableSidebar = false, redirectPath = null }) => {
  const [sideBarClass, setSideBarClass] = useState(
    window.innerWidth < 991 ? "collapsed" : ""
  );
  const navigate = useNavigate();

  function sideBarToggle() {
    setSideBarClass((prevClass) => (prevClass === "" ? "collapsed" : ""));
  }

  const handleResize = () => {
    if (window.innerWidth < 767) {
      setSideBarClass("collapsed");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (redirectPath) {
      return navigate(redirectPath);
    }
  }, [redirectPath]);

  return (
    <div>
      <Navbar sideBarToggle={sideBarToggle} sideBarClass={sideBarClass} />
      <div>
        <Sidebar
          sideBarToggle={sideBarToggle}
          sideBarClass={sideBarClass}
          disable={disableSidebar}
        />
        <div
          className={`screensSectionContainer ${
            sideBarClass ? "expanded" : ""
          }`}
        >
          <div className="appContainer">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
