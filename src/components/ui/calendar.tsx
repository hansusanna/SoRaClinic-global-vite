import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "./utils";
import { buttonVariants } from "./button";

type RDProps = React.ComponentProps<typeof DayPicker>;

const BASE_CLASSNAMES: NonNullable<RDProps["classNames"]> = {
  // 전체 컨테이너 (기준점)
  months: "relative flex flex-col sm:flex-row gap-2",
  month: "flex flex-col gap-4",

  // 캡션/내비
  caption: "flex items-center justify-center w-full pt-1",
  caption_label: "text-sm font-medium",
  // 기본 Nav를 절대 배치로 오른쪽 위에
  nav: "absolute right-2 top-1 flex items-center gap-1 z-10",
  nav_button: "inline-flex items-center justify-center rounded-md size-10 p-0 " +
    "text-gray-600 hover:text-pink-500 opacity-90 hover:opacity-100",

  // 테이블 (flex 금지)
  table: "w-full border-collapse",
  head_row: "",
  head_cell: "text-muted-foreground rounded-md w-9 text-center font-normal text-[0.8rem] p-0",
  row: "",

  // td(셀) 최소화
  cell: "p-0 text-center align-middle relative h-9 w-9",
  day: "p-0",

  // 버튼 스타일은 day_button에만
  day_button: cn(
    buttonVariants({ variant: "ghost" }),
    "h-9 w-9 p-0 font-normal rounded-md hover:bg-accent hover:text-accent-foreground " +
      "focus-visible:ring-2 focus-visible:ring-ring/50 aria-selected:opacity-100"
  ),

  // 상태 클래스
  day_selected:
    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
  day_today: "rdp-today",
  day_outside: "rdp-outside text-muted-foreground opacity-50",
  day_disabled: "text-muted-foreground opacity-50",
  day_range_start:
    "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
  day_range_end:
    "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
  day_range_middle:
    "aria-selected:bg-accent aria-selected:text-accent-foreground",
  day_hidden: "invisible",
};

type CalendarProps = {
  className?: string;
  classNames?: Partial<NonNullable<RDProps["classNames"]>>;
  showOutsideDays?: boolean;
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  disabled?: RDProps["disabled"];
  required?: never;
  modifiersClassNames?: never;
  modifiersStyles?: never;
  style?: never;
};

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  disabled,
}: CalendarProps) {
  const mergedClassNames = React.useMemo(
    () =>
      ({
        ...BASE_CLASSNAMES,
        ...(classNames ?? {}),
      }) as NonNullable<RDProps["classNames"]>,
    [classNames]
  );
  const modifiers = React.useMemo(
    () => ({ weekend: { dayOfWeek: [0, 6] } }),
    []
  );
  const modifiersClassNames = React.useMemo(
    () => ({ weekend: "text-rose-500 dark:text-rose-400" }),
    []
  );


  return (
    <DayPicker
      mode="single"
      showOutsideDays={showOutsideDays}
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      className={cn("p-3", className)}
      classNames={mergedClassNames}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}     
    />
  );
}
