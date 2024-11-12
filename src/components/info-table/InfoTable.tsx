import { FC, ReactNode } from "react";

interface InfoTableRow {
  title: string;
  content: ReactNode;
}

interface InfoTableProps {
  rows: InfoTableRow[];
}

export const InfoTable: FC<InfoTableProps> = ({ rows }) => {
  return (
    <div className="bg-[#F7F7F7] dark:bg-[#2C2C2E] rounded-[12px] overflow-hidden">
      <div className="grid grid-cols-[auto,1fr]">
        {rows.map((row, index) => (
          <div key={`row-${index}`} className="contents">
            <div
              className={`h-[42px] flex items-center border-r-[0.5px] border-[#E3E3E7] dark:border-white/20 ${
                index > 0
                  ? "border-t-[0.5px] border-[#E3E3E7] dark:border-white/20"
                  : ""
              }`}
            >
              <span className="text-[17px] text-label-secondary p-4">
                {row.title}
              </span>
            </div>
            <div
              className={`h-[42px] flex items-center ${
                index > 0
                  ? "border-t-[0.5px] border-[#E3E3E7] dark:border-white/20"
                  : ""
              }`}
            >
              <div className="text-[17px] p-4 text-black dark:text-white">
                {row.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
