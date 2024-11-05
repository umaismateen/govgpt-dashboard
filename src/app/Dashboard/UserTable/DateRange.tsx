import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { useMediaQuery } from "@/app/hooks/use-media-query";

export const DateRange = ({ table }: { table: any }) => {
  const dateRange = table.getColumn("created_at")?.getFilterValue() ?? {};
  const isDesktop = useMediaQuery("(min-width: 768px)", true);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] h-8 justify-start text-left font-normal",
            !dateRange.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} -{" "}
                {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={dateRange.from}
          selected={dateRange}
          onSelect={(range) => {
            table.getColumn("created_at")?.setFilterValue(range);
          }}
          numberOfMonths={isDesktop ? 2 : 1}
        />
      </PopoverContent>
    </Popover>
  );
};
