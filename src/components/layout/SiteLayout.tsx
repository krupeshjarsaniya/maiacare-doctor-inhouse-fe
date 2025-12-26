"use client";
import React, { useRef, useState } from "react";
import { Nav } from "react-bootstrap";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineMenu,
} from "react-icons/hi";
import {
  MdWindow,
  MdSettings,
  MdOutlineCalendarToday,
  MdOutlineLogout,
} from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import { RiChat3Line, RiNotificationLine } from "react-icons/ri";
import { IoBagAddOutline } from "react-icons/io5";
import Logo from "../../assets/images/logo.png";
import Maia from "../../assets/images/maia.png";
import UserProfileIcon from "../../assets/images/user-icon.png";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/Hook/Redux/Store/store";
import { FaBoxesStacked } from "react-icons/fa6";
import { logout } from "@/utils/apis/apiHelper";
import { ClearData } from "@/utils/Helper";
import { setToken } from "@/Hook/Redux/Slice/tokenSlice";
import toast from "react-hot-toast";

interface Props {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const SiteLayout = ({ collapsed, setCollapsed, children }: Props) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const navRef = useRef<HTMLDivElement | null>(null);
  const authData = useSelector((state: RootState) => state.auth);
  const { title, subtitle, showBack } = useSelector(
  (state: RootState) => state.header
);


  // 🔥 Offcanvas state
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  console.log("authData", authData);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <FaBoxesStacked size={22} /> },
    { label: "Profile", href: "/profile", icon: <MdWindow size={22} /> },
    // { label: "EditProfile", href: "/EditProfile"},
    // { label: "Doctors", href: "/doctors", icon: <FaBoxesStacked size={22} /> },
    { label: "Patients", href: "/patients", icon: <BsPeople size={22} /> },
    // { label: "Inventory", href: "/inventory", icon: <FaBoxesStacked size={22} /> },
    // { label: "Appointments", href: "/appointments", icon: <MdOutlineCalendarToday size={22} />, },
    // { label: "Treatment Plan", href: "/treatment-plan", icon: <IoBagAddOutline size={22} />, },
    { label: "Settings", href: "/settings", icon: <MdSettings size={22} /> },
  ];

  const handleScrollDown = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ top: 100, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    logout().then(() => {
      ClearData();
      toast.success("Logout successfully");
      localStorage.clear();
      dispatch(setToken(""));
      router.push("/login");
    }).catch(() => {
      toast.error("Logout failed");
    });
  };

  return (
    <div className="layout">
      {/* ====== DESKTOP SIDEBAR ====== */}
      <aside
        className={`sidebar desktop-sidebar ${collapsed ? "sidebar--collapsed" : "sidebar--expanded"
          }`}
      >
        <button
          type="button"
          className="sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <HiOutlineChevronDoubleRight />
          ) : (
            <HiOutlineChevronDoubleLeft />
          )}
        </button>

        <div className="sidebar__top">
          <Link href="/dashboard" className="sidebar__logo-link">
            {/* <img src={Logo.src} alt="Logo" className="sidebar__logo" /> */}
            {collapsed ? (
              <img
                src={Logo.src}
                alt="Collapsed Logo"
                className="sidebar__logo"
              />
            ) : (
              <img
                src={Maia.src}
                alt="Expanded Logo"
                className="sidebar__logo"
              />
            )}
          </Link>
          <hr className="sidebar__divider" />
          <Nav className="sidebar__nav" ref={navRef}>
            {navItems.map((item, i) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href + i}
                  href={item.href}
                  className={`sidebar__nav-item ${isActive ? "is-active" : ""}`}
                >
                  <span className="sidebar__icon">{item.icon}</span>
                  <span className="sidebar__text">{item.label}</span>
                </Link>
              );
            })}
          </Nav>
        </div>
        <div
          className="sidebar__nav-item d-flex align-items-center justify-content-center mb-2"
          onClick={handleLogout}
        >
          <MdOutlineLogout size={20} />Logout
        </div>
        <div className="sidebar__bottom">
          <div
            role="button"
            className="sidebar__collapse"
            onClick={handleScrollDown}
          >
            <FaChevronDown size={20} />
          </div>
          <div className="sidebar__user">
            <img
              src={authData.user?.profilePicture || UserProfileIcon.src}
              alt="User"
              className="sidebar__user-avatar"
            />
            <span className="sidebar__text">
              {authData.user?.name || "John Doe"}
            </span>
          </div>
        </div>
      </aside>

      {/* ====== OFFCANVAS SIDEBAR (MOBILE/TABLET) ====== */}
      <div
        className={`offcanvas-backdrop ${showOffcanvas ? "show" : ""}`}
        onClick={() => setShowOffcanvas(false)}
      ></div>
      <aside
        className={`sidebar offcanvas-sidebar ${showOffcanvas ? "open" : ""}`}
      >
        <div className="offcanvas-header">
          <button
            type="button"
            className="sidebar__toggle"
            onClick={() => setShowOffcanvas(false)}
          >
            <HiOutlineChevronDoubleLeft size={18} />
          </button>
        </div>
        <div className="sidebar__top">
          <Link
            href="/dashboard"
            className="sidebar__logo-link"
            onClick={() => setShowOffcanvas(false)}
          >
            {/* <img src={Logo.src} alt="Logo" className="sidebar__logo" /> */}
            <img src={Maia.src} alt="Expanded Logo" className="sidebar__logo" />
          </Link>
          <hr className="sidebar__divider" />
          <Nav className="sidebar__nav">
            {navItems.map((item, i) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href + i}
                  href={item.href}
                  className={`sidebar__nav-item ${isActive ? "is-active" : ""}`}
                  onClick={() => setShowOffcanvas(false)}
                >
                  <span className="sidebar__icon">{item.icon}</span>
                  <span className="sidebar__text">{item.label}</span>
                </Link>
              );
            })}
          </Nav>
        </div>

        <div
          className="sidebar__nav-item d-flex align-items-center justify-content-start mb-2"
          onClick={handleLogout}
        >
          <MdOutlineLogout size={20} />
          <span className="sidebar__text">Logout</span>
        </div>

        <div className="sidebar__bottom ">
          <div
            role="button"
            className="sidebar__collapse"
            onClick={handleScrollDown}
          >
            <FaChevronDown size={20} />
          </div>
          <div className="sidebar__user">
            <img
              src={authData.user?.profilePicture || UserProfileIcon.src}
              alt="User"
              className="sidebar__user-avatar"
            />
            <span className="sidebar__text">
              {authData.user?.name || "John Doe"}
            </span>
          </div>
        </div>
      </aside>

      <main className="layout__content">
        <header className="layout__header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            {/* ☰ menu button visible only on mobile/tablet */}
            <button
              className="mobile-menu-btn"
              onClick={() => setShowOffcanvas(true)}
            >
              <HiOutlineChevronDoubleRight size={18} />
            </button>
            {title == "EditProfile"
              ?
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" onClick={() => router.push('/profile')}>
                <rect x="0.5" y="0.5" width="55" height="55" rx="7.5" fill="white" />
                <rect x="0.5" y="0.5" width="55" height="55" rx="7.5" stroke="#DDE1E8" />
                <path d="M37.0001 27.9999C37.0001 28.1988 36.9211 28.3896 36.7804 28.5303C36.6398 28.6709 36.449 28.7499 36.2501 28.7499H21.5604L27.0307 34.2193C27.1004 34.289 27.1557 34.3717 27.1934 34.4628C27.2311 34.5538 27.2505 34.6514 27.2505 34.7499C27.2505 34.8485 27.2311 34.9461 27.1934 35.0371C27.1557 35.1281 27.1004 35.2109 27.0307 35.2806C26.961 35.3502 26.8783 35.4055 26.7873 35.4432C26.6962 35.4809 26.5986 35.5003 26.5001 35.5003C26.4016 35.5003 26.304 35.4809 26.2129 35.4432C26.1219 35.4055 26.0392 35.3502 25.9695 35.2806L19.2195 28.5306C19.1497 28.4609 19.0944 28.3782 19.0567 28.2871C19.0189 28.1961 18.9995 28.0985 18.9995 27.9999C18.9995 27.9014 19.0189 27.8038 19.0567 27.7127C19.0944 27.6217 19.1497 27.539 19.2195 27.4693L25.9695 20.7193C26.1102 20.5786 26.3011 20.4995 26.5001 20.4995C26.6991 20.4995 26.89 20.5786 27.0307 20.7193C27.1715 20.86 27.2505 21.0509 27.2505 21.2499C27.2505 21.449 27.1715 21.6398 27.0307 21.7806L21.5604 27.2499H36.2501C36.449 27.2499 36.6398 27.3289 36.7804 27.4696C36.9211 27.6103 37.0001 27.801 37.0001 27.9999Z" fill="#2B4360" />
              </svg>
              :
              ""
            }
            {showBack && (
 <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" onClick={() => router.push('/patients')}>
                <rect x="0.5" y="0.5" width="55" height="55" rx="7.5" fill="white" />
                <rect x="0.5" y="0.5" width="55" height="55" rx="7.5" stroke="#DDE1E8" />
                <path d="M37.0001 27.9999C37.0001 28.1988 36.9211 28.3896 36.7804 28.5303C36.6398 28.6709 36.449 28.7499 36.2501 28.7499H21.5604L27.0307 34.2193C27.1004 34.289 27.1557 34.3717 27.1934 34.4628C27.2311 34.5538 27.2505 34.6514 27.2505 34.7499C27.2505 34.8485 27.2311 34.9461 27.1934 35.0371C27.1557 35.1281 27.1004 35.2109 27.0307 35.2806C26.961 35.3502 26.8783 35.4055 26.7873 35.4432C26.6962 35.4809 26.5986 35.5003 26.5001 35.5003C26.4016 35.5003 26.304 35.4809 26.2129 35.4432C26.1219 35.4055 26.0392 35.3502 25.9695 35.2806L19.2195 28.5306C19.1497 28.4609 19.0944 28.3782 19.0567 28.2871C19.0189 28.1961 18.9995 28.0985 18.9995 27.9999C18.9995 27.9014 19.0189 27.8038 19.0567 27.7127C19.0944 27.6217 19.1497 27.539 19.2195 27.4693L25.9695 20.7193C26.1102 20.5786 26.3011 20.4995 26.5001 20.4995C26.6991 20.4995 26.89 20.5786 27.0307 20.7193C27.1715 20.86 27.2505 21.0509 27.2505 21.2499C27.2505 21.449 27.1715 21.6398 27.0307 21.7806L21.5604 27.2499H36.2501C36.449 27.2499 36.6398 27.3289 36.7804 27.4696C36.9211 27.6103 37.0001 27.801 37.0001 27.9999Z" fill="#2B4360" />
              </svg>
)}

            <div>
              <h2 className="layout__title">{title}</h2>
              {/* <h4 className="layout__subtitle mt-1">{subtitle}</h4> */}

              <h4 className="layout__subtitle mt-1">{subtitle.includes(">")
                ?
                <>
                  <p><span className="header-sub-title-color">{subtitle.split(">")[0]}&nbsp;
                    <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.85319 7.85319L1.60319 14.1032C1.42707 14.2793 1.1882 14.3783 0.939126 14.3783C0.690054 14.3783 0.451184 14.2793 0.275063 14.1032C0.0989432 13.9271 1.85573e-09 13.6882 0 13.4391C-1.85573e-09 13.1901 0.0989432 12.9512 0.275063 12.7751L5.86178 7.18991L0.276626 1.60319C0.18942 1.51598 0.120245 1.41245 0.0730491 1.29851C0.0258536 1.18457 0.00156224 1.06245 0.00156224 0.939126C0.00156224 0.815798 0.0258536 0.693678 0.0730491 0.579738C0.120245 0.465798 0.18942 0.36227 0.276626 0.275064C0.363832 0.187858 0.467361 0.118682 0.581301 0.0714868C0.695241 0.0242913 0.817361 -9.18863e-10 0.940689 0C1.06402 9.18864e-10 1.18614 0.0242913 1.30008 0.0714868C1.41402 0.118682 1.51755 0.187858 1.60475 0.275064L7.85475 6.52506C7.94205 6.61226 8.01127 6.71584 8.05846 6.82985C8.10564 6.94386 8.12985 7.06606 8.12971 7.18945C8.12956 7.31284 8.10506 7.43498 8.05761 7.54888C8.01016 7.66278 7.94069 7.76619 7.85319 7.85319Z" fill="#CBD5E1" />
                    </svg>

                    &nbsp;</span>{subtitle.split(">")[1]}</p>
                </>
                :
                subtitle}</h4>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="header-icon-container">
              <RiChat3Line size={18} />
            </span>
            <Link
              href="/notifications"
              className="header-icon-container sitelayout-header-icon"
            >
              <RiNotificationLine size={18} />
            </Link>
          </div>
        </header>
        <div className="layout__body">{children}</div>
      </main>
    </div>
  );
};

export default SiteLayout;
