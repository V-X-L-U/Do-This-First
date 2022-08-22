import { logoutUserHandler } from "./PageHeaderLogic";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import styles from "./PageHeader.module.css";
import PropTypes from "prop-types";

const SidebarItem = ({ label, action }) => {
  return (
    <button className={styles.navDropdownItem} onClick={action}>
      {label}
    </button>
  );
};

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const logUserOut = async () => {
    const errMessage = await logoutUserHandler();
    if (errMessage.length === 0) navigate("/");
  };

  return (
    <div className={styles.navDropdown}>
      <CloseSidebarButton onClick={onClose} />
      <div className={styles.menuItemContainer}>
        <SidebarItem label={"TODO"} action={() => navigate("/tasks")} />
        <SidebarItem label={"Create Task"} action={() => navigate("/create")} />
        <SidebarItem label={"Log out"} action={logUserOut} />
      </div>
    </div>
  );
};

const CloseSidebarButton = ({ onClick }) => {
  return (
    <button className={styles.closeSidebarBtn} onClick={onClick}>
      <MdClose className={styles.closeIcon} />
    </button>
  );
};

const HamburgerNavButton = ({ onClick }) => {
  return (
    <button className={styles.hamburgerNavBtn} onClick={onClick}>
      <FiMenu className={styles.hamburgerIcon} />
    </button>
  );
};

const PageHeader = ({ pageTitle, bgColor, trailingComp, showNav }) => {
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  return (
    <h1
      className={styles.pageHeader}
      style={{
        backgroundColor: bgColor,
      }}
    >
      {showNav ? (
        <HamburgerNavButton onClick={() => setShowNavDropdown(true)} />
      ) : (
        <></>
      )}
      {showNavDropdown ? (
        <Sidebar onClose={() => setShowNavDropdown(false)} />
      ) : (
        <></>
      )}
      {pageTitle}
      {trailingComp === null ? <></> : trailingComp}
    </h1>
  );
};

SidebarItem.propTypes = {
  label: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};

Sidebar.propTypes = {
  onClose: PropTypes.func.isRequired,
};

CloseSidebarButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

HamburgerNavButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

PageHeader.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  trailingComp: PropTypes.element,
  showNav: PropTypes.bool,
};

export default PageHeader;
