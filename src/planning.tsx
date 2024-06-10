import * as React from "react";
import * as Dates from "./lib/dates";
import * as Arrays from "./lib/arrays";
import * as Numbers from "./lib/numbers";
import classNames from "classnames";
import css from "./planning.module.css";

type Day = keyof typeof Dates.DAYS;

type Event = {
  type: string;
  title: string;
  from: string;
  to: string;
};

type Props = {
  date: Date;
  startDay: Day;
  startHour: number;
  endHour: number;
  events: Event[];
};

export default function WeekPlanning({
  date,
  events,
  startDay,
  startHour,
  endHour,
}: Props) {
  const first = Dates.previousWeekday(date, startDay);
  const cols = Arrays.range(0, 7).map(Dates.formatDay(first));
  const rows = Arrays.range(startHour, endHour).map(Dates.formatHour);

  const gridMouseMove = (e: MouseEvent) => {
    const ts = toTimestamp(e, first, startHour);
    if (!ts) return;
    console.log("move", ts);
  };

  const gridMouseUp = (e: MouseEvent) => {
    document.removeEventListener("mousemove", gridMouseMove);

    // if (targetsSlot(e)) return;
    // const ts = toTimestamp(e, first, startHour);
    // if (!ts) return;
    // toggleSlotsInertia(e, false);
    // console.log("up  ", ts);
  };

  const gridMouseDown = (e: React.MouseEvent) => {
    // if (targetsSlot(e)) return;
    const ts = toTimestamp(e, first, startHour);
    if (!ts) return;
    // toggleSlotsInertia(e, true);
    console.log("down", ts);

    document.addEventListener("mouseup", gridMouseUp, { once: true });
    document.addEventListener("mousemove", gridMouseMove);
  };

  const slotClicked = (slot: Event) => (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(slot);
  };

  return (
    <div className={css.grid} tabIndex={-1} onMouseDown={gridMouseDown}>
      {mapEvents(events, startDay, startHour).map((slot, i) => {
        const { row, rowspan, col, colspan, title, type } = slot;
        const style = {
          gridArea: `${row} / ${col} / span ${rowspan} / span ${colspan}`,
          blockSize: `calc(${slot.size}% - 6.5px)`,
          translate: `0 ${slot.start}%`,
        };
        return (
          <button
            key={i}
            className={classNames(css.slot, css[type])}
            style={style}
            onClick={slotClicked(slot)}
          >
            {title}
          </button>
        );
      })}
      <div className={css.gridHeader}>
        <div style={{ gridRow: 1, gridColumn: 1 }} />
        {cols.map((header, c) => (
          <div
            key={c}
            className={css.cell}
            style={{ gridRow: 1, gridColumn: c + 2 }}
          >
            {header.weekday}
            <br />
            {header.date}
          </div>
        ))}
      </div>
      {rows.map((header, r) => (
        <div key={r} className={css.row}>
          <div
            className={classNames(css.cell, css.rowHeader)}
            style={{ gridRow: r + 2, gridColumn: 1 }}
          >
            {header}
          </div>
          {cols.map((_, c) => (
            <div
              key={c}
              className={css.cell}
              style={{ gridRow: r + 2, gridColumn: c + 2 }}
              data-row={r}
              data-col={c}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function mapEvents(events: Event[], startDay: Day, startHour: number) {
  return events
    .map((e) => mapEvent(e, startDay, startHour))
    .sort((a, b) => (a.col === b.col ? a.row - b.row : a.col - b.col));
}

function mapEvent(event: Event, startDay: Day, startHour: number) {
  const from = Dates.parseUTCTimestamp(event.from);
  const to = Dates.parseUTCTimestamp(event.to);
  const first = Dates.previousWeekday(from, startDay);

  const row = from.getUTCHours() + 2 - startHour;
  const col = Dates.differenceInDays(from, first) + 2;

  const rowspan = to.getUTCHours() - from.getUTCHours();
  const colspan = to.getUTCDate() - from.getUTCDate() + 1;

  const hourInMinutes = rowspan * 60;
  const startMinutes = from.getUTCMinutes();
  const endMinutes = to.getUTCMinutes();
  const minutes = hourInMinutes - startMinutes + endMinutes;
  const size = Numbers.roundToDecimal((minutes / hourInMinutes) * 100, 2);
  const start = Numbers.roundToDecimal((startMinutes / minutes) * 100, 2);

  return { ...event, row, col, rowspan, colspan, size, start };
}

function toTimestamp(
  e: React.MouseEvent | MouseEvent,
  first: Date,
  startHour: number
) {
  const target = e.target as HTMLElement;
  const ds = target.dataset;
  if (!ds.row || !ds.col) return;

  const row = Number(ds.row);
  const col = Number(ds.col);
  const bounds = target.getBoundingClientRect();

  const percentage = (e.clientY - bounds.y) / bounds.height;
  const quarterly = Numbers.roundMinutesToQuarter(60 * percentage);
  const quarterlyRow = quarterly === 60 ? row + 1 : row;
  const quaterlyMinutes = quarterly === 60 ? 0 : quarterly;

  const date = new Date(first);
  date.setUTCDate(first.getUTCDate() + col);
  date.setUTCHours(startHour + quarterlyRow, quaterlyMinutes, 0, 0);

  return Dates.formatUTCTimestamp(date);
}

// function targetsSlot(e: React.MouseEvent | MouseEvent) {
//   const target = e.target as HTMLElement;
//   return target.classList.contains(css.slot);
// }

// function toggleSlotsInertia(e: React.MouseEvent | MouseEvent, inert: boolean) {
//   const grid = e.currentTarget as Element;
//   grid.querySelectorAll(".slot").forEach((slot) => {
//     inert ? slot.setAttribute("inert", "inert") : slot.removeAttribute("inert");
//   });
// }
