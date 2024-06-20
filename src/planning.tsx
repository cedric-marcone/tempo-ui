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

type Slot = Event & {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
  size: number;
  start: number;
};

type Props = {
  date: Date;
  startDay: Day;
  startHour: number;
  endHour: number;
  events: Event[];
  openDialog: (data: string) => void;
};

let newSlot: Slot | undefined;
let newSlotDiv: HTMLDivElement | undefined;

export default function WeekPlanning(props: Props) {
  const { date, events, startDay, startHour, endHour } = props;

  const first = Dates.previousWeekday(date, startDay);
  const cols = Arrays.range(0, 7).map(Dates.formatDay(first));
  const rows = Arrays.range(startHour, endHour).map(Dates.formatHour);

  const convert = convertToTimestamp(first, startHour);

  const gridMouseUp = (e: MouseEvent) => {
    document.removeEventListener("mousemove", gridMouseMove);

    if (!newSlotDiv) return;

    changeSlotInertia(e, false);
    newSlotDiv.remove();
    props.openDialog(JSON.stringify(newSlot, null, 2));
    newSlotDiv = undefined;
    newSlot = undefined;
  };

  const gridMouseMove = (e: MouseEvent) => {
    const ts = convert(e);
    if (!ts || !newSlot || !newSlotDiv) return;

    const to = Dates.formatUTCTimestamp(ts);
    const toTime = Dates.formatUTCTime(ts);
    const from = Dates.parseUTCTimestamp(newSlot.from);
    const fromTime = Dates.formatUTCTime(from);
    if (to <= newSlot.from || toTime <= fromTime) return;

    const event = { ...newSlot, to: Dates.formatUTCTimestamp(ts) };

    if (intersects(event, events)) return;

    newSlot = mapEventToSlot(event, startDay, startHour);

    applyStyles(newSlotDiv, stylesFromSlot(newSlot));
  };

  const gridMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON") return;

    changeSlotInertia(e, true);

    const ts = convert(e);
    if (!ts) return;

    const ns = new Date(ts);
    ns.setUTCMinutes(ns.getUTCMinutes() + 15);

    const from = Dates.formatUTCTimestamp(ts);
    const to = Dates.formatUTCTimestamp(ns);
    const event = { type: "NEW", title: "", from, to };

    newSlot = mapEventToSlot(event, startDay, startHour);
    newSlotDiv = document.createElement("div");
    newSlotDiv.inert = true;
    newSlotDiv.className = classNames(css.slot, css.NEW);
    applyStyles(newSlotDiv, stylesFromSlot(newSlot));
    document.querySelector(".slots")!.appendChild(newSlotDiv);

    document.addEventListener("mouseup", gridMouseUp, { once: true });
    document.addEventListener("mousemove", gridMouseMove);
  };

  const slotClicked = (slot: Event) => (e: React.MouseEvent) => {
    e.stopPropagation();
    props.openDialog(JSON.stringify(slot, null, 2));
  };

  return (
    <div className={css.grid} onMouseDown={gridMouseDown}>
      <div className={css.slots}>
        {mapEventsToSlots(events, startDay, startHour).map((slot, i) => {
          const { title, type } = slot;
          const style = stylesFromSlot(slot);
          return (
            <div key={i} style={style} className={css.slotOuter}>
              <button
                onClick={slotClicked(slot)}
                className={classNames(css.slot, css[type])}
              >
                {title}
              </button>
            </div>
          );
        })}
      </div>
      <div className={css.header}>
        <div style={{ gridRow: 1, gridColumn: 1 }} />
        {cols.map((header, c) => (
          <div
            key={c}
            className={classNames(css.cell, css.colHeader)}
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

function stylesFromSlot(slot: Slot) {
  const { row, rowspan, col, colspan, size, start } = slot;
  return {
    gridArea: `${row} / ${col} / span ${rowspan} / span ${colspan}`,
    blockSize: `${size}%`,
    translate: `0 ${start}%`,
  };
}

function applyStyles(element: HTMLElement, style: Record<string, unknown>) {
  for (const key in style) {
    // Casting : https://github.com/microsoft/TypeScript/issues/17827
    (element.style as any)[key] = style[key];
  }
}

function mapEventsToSlots(events: Event[], startDay: Day, startHour: number) {
  return events
    .map((e) => mapEventToSlot(e, startDay, startHour))
    .sort((a, b) => (a.col === b.col ? a.row - b.row : a.col - b.col));
}

function mapEventToSlot(event: Event, startDay: Day, startHour: number) {
  let _from = Dates.parseUTCTimestamp(event.from);
  let _to = Dates.parseUTCTimestamp(event.to);

  const first = Dates.previousWeekday(_from, startDay);

  const row = _from.getUTCHours() + 2 - startHour;
  const col = Dates.differenceInDays(_from, first) + 2;

  const hours = _to.getUTCHours() - _from.getUTCHours();
  const days = _to.getUTCDate() - _from.getUTCDate();
  const startMinutes = _from.getUTCMinutes();
  const endMinutes = _to.getUTCMinutes();
  const hourInMinutes = hours * 60;
  const minutes = hourInMinutes - startMinutes + endMinutes;

  const colspan = days + 1;
  const rowspan = hours || 1;

  const divider = hourInMinutes || 60;
  const start = Numbers.roundToDecimal((startMinutes / minutes) * 100, 2);
  const size = Numbers.roundToDecimal((minutes / divider) * 100, 2);

  return { ...event, row, col, rowspan, colspan, size, start };
}

function convertToTimestamp(first: Date, startHour: number) {
  return (e: React.MouseEvent | MouseEvent) => {
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
    return date;
  };
}

function changeSlotInertia(e: React.MouseEvent | MouseEvent, inert: boolean) {
  const grid = e.currentTarget as Element;
  grid.querySelectorAll(".slotOuter").forEach((slot) => {
    inert ? slot.setAttribute("inert", "inert") : slot.removeAttribute("inert");
  });
}

function intersects(event: Event, events: Event[]) {
  const aFfrom = Dates.parseUTCTimestamp(event.from);
  const aTo = Dates.parseUTCTimestamp(event.to);
  const aFromTime = Dates.formatUTCTime(aFfrom);
  const aToTime = Dates.formatUTCTime(aTo);
  for (const e of events) {
    const bFrom = Dates.parseUTCTimestamp(e.from);
    const bTo = Dates.parseUTCTimestamp(e.to);
    if (aFfrom <= bTo && bFrom <= aTo) {
      const bFromTime = Dates.formatUTCTime(bFrom);
      const bToTime = Dates.formatUTCTime(bTo);
      if (aFromTime < bToTime && bFromTime < aToTime) return true;
    }
  }
  return false;
}
