import React, { PropsWithChildren } from "react";

interface Props {
  title: string;
  Icon?: React.ReactNode;
}

const ValidatorCard: React.FC<PropsWithChildren<Props>> = ({ children, title, Icon }) => {
  return (
    <div className="block p-6 mx-auto w-full h-32 bg-base-200 rounded-lg border border-gray-200 shadow-md dark:bg-base-200 dark:border-gray-700">
      <h5 className="flex items-center gap-2 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {Icon}
        {title}
      </h5>
      <p className="text-lg text-right text-gray-700 dark:text-gray-400">{children}</p>
    </div>
  );
};

export default ValidatorCard;
