import Input from "@/components/inputs/Input";
import { capitalizeString } from "@/helpers/strings";
import React, { FC } from "react";

interface ReviewCardProps {
  header: string;
  data: object;
  children?: React.ReactNode;
}

const ReviewCard: FC<ReviewCardProps> = ({ header, data, children }) => {
  return (
    <section className="flex flex-col w-full gap-3 p-4 border-[.3px] border-primary rounded-md shadow-sm">
      <menu className="flex items-center justify-between w-full gap-3">
        <h2 className="text-lg font-semibold uppercase text-primary">
          {header}
        </h2>
      </menu>
      <section className="flex flex-col w-full gap-3 my-2">
        {Object?.entries(data)
          ?.filter(([key]) => key !== "step")
          ?.map(([key, value], index: number) => {
            return (
              <p key={index} className="flex items-center gap-6">
                <span className="w-1/2 font-bold">
                  {capitalizeString(key)}:
                </span>{" "}
                <Input
                  value={String(value) && capitalizeString(String(value))}
                  readOnly
                />
              </p>
            );
          })}
        {children}
      </section>
    </section>
  );
};

export default ReviewCard;
