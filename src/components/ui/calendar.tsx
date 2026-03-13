"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-6 bg-white", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-8 sm:space-y-0",
        month: "space-y-6",
        caption: "flex justify-between pt-1 relative items-center mb-4",
        caption_label: "text-base font-black text-slate-900 tracking-tight",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 hover:bg-slate-100/80 rounded-xl transition-all active:scale-90"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse",
        head_row: "flex mb-2",
        head_cell: "text-slate-400 rounded-md w-11 font-black text-[10px] uppercase tracking-[0.1em]",
        row: "flex w-full mt-1.5",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#2286BE]/5 first:[&:has([aria-selected])]:rounded-l-2xl last:[&:has([aria-selected])]:rounded-r-2xl",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-2xl [&:has(>.day-range-start)]:rounded-l-2xl"
            : "[&:has([aria-selected])]:rounded-2xl"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-11 w-11 p-0 font-bold aria-selected:opacity-100 rounded-2xl hover:bg-slate-100 transition-all"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#2286BE] text-white hover:bg-[#1b6da0] hover:text-white focus:bg-[#2286BE] focus:text-white shadow-lg shadow-[#2286BE]/20",
        day_today: "bg-slate-100 text-[#2286BE] font-black",
        day_outside:
          "day-outside text-slate-300 opacity-50 aria-selected:bg-[#2286BE]/5 aria-selected:text-slate-300 aria-selected:opacity-30",
        day_disabled: "text-slate-200 opacity-50",
        day_range_middle:
          "aria-selected:bg-[#2286BE]/10 aria-selected:text-[#2286BE] font-black",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
