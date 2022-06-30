import React from "react";
import { IconInfo } from "./Icon";

interface Props {
  title: string;
  textTip: string;
}

const TitleWithToolTip: React.FC<Props> = ({ title, textTip }) => {
  return (
    <div className="flex items-center my-5 gap-2">
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="tooltip" data-tip={textTip}>
        <IconInfo />
      </div>
    </div>
  );
};

export default TitleWithToolTip;
