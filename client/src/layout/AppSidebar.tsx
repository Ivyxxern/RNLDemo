import { Link } from "react-router-dom";
import { useHeader } from "../contexts/HeaderContext";
import { useSidebar } from "../contexts/SidebarContext";

const AppSidebar = () => {
    const { isOpen, toggleSidebar } = useSidebar();
    const { toggleUserMenu } = useHeader();

    const sidebarItems = [
        {
            path: '/genders',
            text: 'Gender List',
        },
        {
            path: "#",
            text: "User List",
        },
    ];

    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    className="fixed inset-0 z-30 bg-gray-900/50 sm:hidden"
                    onClick={toggleSidebar}
                />
            )}
            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 h-screen w-64 transition-transform sm:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                aria-label="Sidebar"
            >
                <div className="flex h-full flex-col overflow-y-auto border-r border-gray-700 bg-gray-800">
                    <div className="flex items-center justify-between gap-2 border-b border-gray-700 px-3 py-3">
                        <button
                            type="button"
                            data-drawer-target="logo-sidebar"
                            data-drawer-toggle="logo-sidebar"
                            aria-controls="logo-sidebar"
                            onClick={toggleSidebar}
                            className="inline-flex rounded-lg p-2 text-sm text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 sm:hidden"
                        >
                            <span className="sr-only">Close sidebar</span>
                            <svg
                                className="h-6 w-6"
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
                        <a
                            href="https://flowbite.com/"
                            className="flex min-w-0 flex-1 items-center justify-center sm:justify-start ps-2.5"
                        >
                            <img
                                src="https://flowbite.com/docs/images/logo.svg"
                                className="h-6 shrink-0 me-2"
                                alt="Flowbite Logo"
                            />
                            <span className="truncate text-lg font-semibold whitespace-nowrap text-white">
                                Flowbite
                            </span>
                        </a>
                        <button
                            type="button"
                            onClick={toggleUserMenu}
                            className="shrink-0 rounded-full focus:ring-4 focus:ring-gray-600 focus:outline-none"
                            aria-label="Open user menu"
                        >
                            <img
                                className="h-8 w-8 rounded-full"
                                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                alt=""
                            />
                        </button>
                    </div>

                    <ul className="space-y-2 px-3 py-4 font-medium">
                        {sidebarItems.map((sidebarItem) => (
                            <li>
                                <Link
                                    to={sidebarItem.path}
                                    className="group flex items-center rounded-lg px-2 py-1.5 text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                    <span className="ms-3">{sidebarItem.text}</span>
                                </Link>
                            </li>
                        ))}

                    </ul>
                </div>
            </aside>
        </>
    );
};

export default AppSidebar;
