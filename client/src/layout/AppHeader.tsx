import { useNavigate } from "react-router-dom";
import { type FormEvent, useState } from "react";
import { useHeader } from "../contexts/HeaderContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";

const AppHeader = () => {
  const { isOpen, toggleUserMenu } = useHeader();
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleUserFullNameFormat = () => {
    if (!user) return "";

    let fullName = `${user.user.last_name}, ${user.user.first_name}`;

    if (user.user.middle_name) {
      fullName += ` ${user.user.middle_name.charAt(0)}.`;
    }

    if (user.user.suffix_name) {
      fullName += ` ${user.user.suffix_name}`;
    }

    return fullName;
  };

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      await logout();
      if (isOpen) {
        toggleUserMenu();
      }
      navigate("/");
    } catch (error) {
      console.error(
        "Unexpected server error occured during logging user out: ",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40" onClick={toggleUserMenu} />}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 
                focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700
                 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z"
                  />
                </svg>
              </button>
              <a href="https://flowbite.com" className="flex ms-2 md:me-24">
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-6 me-3"
                  alt="FlowBite Logo"
                />
                <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">
                  Flowbite
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="relative flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    onClick={toggleUserMenu}
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded={isOpen}
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="user photo"
                    />
                  </button>
                </div>
                <div
                  id="dropdown-user"
                  className={`absolute right-8 top-9 min-w-[200px] z-50 ${isOpen ? "block" : "hidden"}
                  my-2 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm
                  dark:bg-gray-700 dark:divide-gray-600`}
                >
                  <div className="px-4 py-3" role="none">
                    <p className="text-sm text-gray-900 dark:text-white" role="none">
                      {handleUserFullNameFormat()}
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <button
                        type="submit"
                        onClick={handleLogout}
                        disabled={isLoading}
                        role="menuitem"
                        className="block w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100
                        dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer
                        disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Signing Out..." : "Sign Out"}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AppHeader;
