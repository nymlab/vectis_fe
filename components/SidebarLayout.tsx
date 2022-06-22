import clsx from "clsx";
import React, { PropsWithChildren } from "react";
import { toggleSidebar, useSidebarStore } from "stores/sidebar";
import { FaChevronLeft } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

export const SidebarLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { isOpen } = useSidebarStore();

  return (
    <aside className={clsx(isOpen ? "min-w-[250px] max-w-[250px]" : "min-w-[20px] max-w-[20px]", "relative z-10")}>
      {/* fixed component */}
      <div
        className={clsx(
          "overflow-auto fixed top-0 left-0 min-w-[250px] max-w-[250px] no-scrollbar",
          "bg-black border-r-[1px] border-r-plumbus-light",
          { "translate-x-[-230px]": !isOpen }
        )}
      >
        {/* inner component */}
        <div
          className={clsx("flex flex-col gap-y-4 p-8 min-h-screen", {
            invisible: !isOpen,
          })}
        >
          {children}
        </div>
      </div>

      {/* sidebar toggle */}
      <button
        className={clsx("fixed top-[32px] left-[238px] p-1 w-[24px] h-[24px]", "text-black bg-white rounded-full", "hover:bg-plumbus", {
          "translate-x-[-230px]": !isOpen,
        })}
        onClick={toggleSidebar}
        type="button"
      >
        <FaChevronLeft className={clsx("mx-auto", { "rotate-180": !isOpen })} size={12} />
      </button>
      <div
        className={clsx(
          "fixed top-[70px] left-[238px] flex justify-center align-center w-[24px] h-[24px]",
          "text-black bg-white rounded-full",
          "hover:bg-plumbus",
          { "translate-x-[-230px]": !isOpen }
        )}
      >
        <ThemeToggle size={15} />
      </div>
    </aside>
  );
};
