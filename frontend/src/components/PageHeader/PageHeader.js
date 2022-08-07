import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import styles from "./PageHeader.module.css";
import PropTypes from "prop-types";

const NavButton = ({ isOpen, onClick }) => {
  return (
    <button onClick={onClick}>
      {!isOpen ? (
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
      {showNav ? <NavButton isOpen={false} /> : <></>}
      {pageTitle}
      {trailingComp === null ? <></> : trailingComp}
    </h1>
  );
};

NavButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

PageHeader.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  trailingComp: PropTypes.element,
  showNav: PropTypes.bool,
};

export default PageHeader;
