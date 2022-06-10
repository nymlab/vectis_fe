import clsx from "clsx";
import React, { PropsWithChildren } from "react";
import { toggleSidebar, useSidebarStore } from "stores/sidebar";
import { FaChevronLeft } from "react-icons/fa";

export const SidebarLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { isOpen } = useSidebarStore();

  return (
    <div className={clsx(isOpen ? "min-w-[250px] max-w-[250px]" : "min-w-[20px] max-w-[20px]", "relative z-10")}>
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
        className={clsx("absolute top-[32px] right-[-12px] p-1 w-[24px] h-[24px]", "text-black bg-white rounded-full", "hover:bg-plumbus")}
        onClick={toggleSidebar}
        type="button"
      >
        <FaChevronLeft className={clsx("mx-auto", { "rotate-180": !isOpen })} size={12} />
      </button>
    </div>
  );
};
