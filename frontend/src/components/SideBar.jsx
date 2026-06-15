import { NavLink, useNavigate } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";

import {
  HiOutlineDocumentArrowDown,
  HiOutlineClipboardDocumentCheck,
  HiOutlineDocumentChartBar,
} from "react-icons/hi2";

const SideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
     <aside className="h-screen w-[250px] bg-blue-500 text-white flex flex-col justify-between border-r border-white/10">
      
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="px-6 py-5 border-b-2 border-white border-dotted">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="EPFO Logo"
              className="w-12 h-12 rounded-full"
            />

            <div>
               <h2 className="font-bold text-xl leading-none mb-1 font-sora">
                EPFO
              </h2>

              <p className="text-sky-300 text-sm font-medium">
                DTMS
              </p>

              {/* <p className="text-xs text-white/70">
                Digital Tapal Management System
              </p> */}
            </div>
          </div>
        </div>

        {/* Menu */}
        <ul className="flex flex-col gap-2 px-3 py-6">
          {sidebarMenu.map(({ id, label, icon: Icon, path }) => (
            <li key={id}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300
                  ${
                    isActive
                      ? "bg-sky-300 text-blue-800 shadow-lg"
                      : "text-white hover:bg-white/20 hover:text-white"
                  }`
                }
              >
                <Icon className="text-xl" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout */}
         <div className="flex flex-col gap-2 px-4 py-6 border-t-2 border-white border-dotted">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium
          bg-sky-400 text-blue-900 hover:bg-sky-500 hover:text-white transition-all duration-300"
        >
          <RiLogoutBoxRLine className="text-xl" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SideBar;

const sidebarMenu = [
  {
    id: 1,
    label: "Receipt Entry",
    path: "/tapal/receipt-entry",
    icon: HiOutlineDocumentArrowDown,
  },
  {
    id: 2,
    label: "Acknowledgement",
    path: "/tapal/acknowledgement",
    icon: HiOutlineClipboardDocumentCheck,
  },
  {
    id: 3,
    label: "Reports",
    path: "/tapal/reports",
    icon: HiOutlineDocumentChartBar,
  },
];