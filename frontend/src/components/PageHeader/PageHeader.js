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
      <NavButton isShowingDropdown={true} onClick={onClose} />
      <div className={styles.menuItemContainer}>
        <SidebarItem label={"TODO"} action={() => navigate("/tasks")} />
        <SidebarItem label={"Create Task"} action={() => navigate("/create")} />
        <SidebarItem label={"Log out"} action={logUserOut} />
      </div>
    </div>
  );
};

const NavButton = ({ isShowingDropdown, onClick }) => {
  return (
    <button className={styles.navButton} onClick={onClick}>
      {!isShowingDropdown ? (
        <FiMenu className={styles.hamburgerIcon} />
      ) : (
        <MdClose className={styles.closeIcon} />
      )}
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
      {showNav ? <NavButton isShowingDropdown={false} /> : <></>}
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

NavButton.propTypes = {
  isShowingDropdown: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

PageHeader.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  trailingComp: PropTypes.element,
  showNav: PropTypes.bool,
};

export default PageHeader;
