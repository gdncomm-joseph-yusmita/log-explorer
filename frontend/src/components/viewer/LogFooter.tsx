import { Icon } from "@iconify/react";
import Button from "../ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { useLogsFilterStore } from "@/stores/useLogsFilterStore";
import { cn } from "@/lib/utils";
import Skeleton from "react-loading-skeleton";
import { useState } from "react";

export const rowsAmount = [20, 50, 100, 150];

type Props = {
  filteredLogCount: number;
  allLogCount: number;
  isLoading?: boolean;
};

export default function LogFooter({
  filteredLogCount,
  allLogCount,
  isLoading,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { amount, setAmount } = useLogsFilterStore();

  return (
    <div className="text-xs bg-foreground border-t border-border py-1.5 px-4 text-secondary">
      <div className="flex justify-between items-center">
        {!isLoading ? (
          <div className="flex items-center gap-2">
            <Icon
              icon={"material-symbols:info-outline"}
              className="text-base text-secondary/50"
            />
            Showing<span className="text-primary">{filteredLogCount}</span>out
            of
            <span className="text-primary">{allLogCount}</span>queried logs.
          </div>
        ) : (
          <Skeleton containerClassName="w-72 h-4 flex" className="flex" />
        )}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button className="text-xs px-4 py-1 rounded-md text-primary">
              {amount} Rows
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-55 gap-0" align="end">
            <ul className="p-1">
              {rowsAmount.map((row, i) => {
                const isActive = row === amount;
                return (
                  <li
                    key={i}
                    className={cn(
                      "text-xs py-2 px-4 text-start text-secondary hover:text-primary/80 rounded-sm hover:bg-selection cursor-pointer transition duration-75",
                      isActive && "bg-selection text-primary",
                    )}
                    onClick={() => {
                      setAmount(row);
                      setIsOpen(false);
                    }}
                  >
                    {row} Rows
                  </li>
                );
              })}
            </ul>
            <div className="p-4 py-2 border-t flex gap-1.5 border-border">
              <div>
                <Icon
                  icon={"material-symbols:info-outline"}
                  className="text-sm text-secondary"
                />
              </div>
              <p className="text-xs text-secondary font-light">
                For historical data, please use Elasticsearch instead.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
