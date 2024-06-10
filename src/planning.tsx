import classNames from "classnames";
import * as Dates from "./lib/dates";
import * as Arrays from "./lib/arrays";
import * as Numbers from "./lib/numbers";
import css from "./planning.module.css";

type Event = {
  type: string;
  title: string;
  from: string;
  to: string;
};

type Props = {
  date: Date;
  startDay: keyof typeof Dates.DAYS;
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
  let drag = false;

  const gridMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains(css.slot)) return;

    drag = true;
    const grid = e.currentTarget;
    grid.querySelectorAll(".slot").forEach((slot) => {
      slot.setAttribute("inert", "true");
    });
    const ts = toTimestamp(e, first, startHour);
    if (!ts) return;
    console.log("down", ts);
  };

  const gridMouseUp = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains(css.slot)) return;

    drag = false;
    const grid = e.currentTarget;
    grid.querySelectorAll(".slot").forEach((slot) => {
      slot.removeAttribute("inert");
    });
    const ts = toTimestamp(e, first, startHour);
    if (!ts) return;
    console.log("up  ", ts);
  };

  const gridMouseMove = (e: React.MouseEvent) => {
    if (!drag) return;
    const ts = toTimestamp(e, first, startHour);
    if (!ts) return;
    console.log("move", ts);
  };

  const slotClicked = (slot: Event) => (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(slot);
  };

  return (
    <div
      className={css.grid}
      tabIndex={-1}
      onMouseDown={gridMouseDown}
      onMouseMove={gridMouseMove}
      onMouseUp={gridMouseUp}
    >
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

function mapEvents(
  events: Event[],
  startDay: keyof typeof Dates.DAYS,
  startHour: number
) {
  return events
    .map((e) => {
      const from = Dates.parseUTCTimestamp(e.from);
      const to = Dates.parseUTCTimestamp(e.to);
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

      return { ...e, row, col, rowspan, colspan, size, start };
    })
    .sort((a, b) => (a.col === b.col ? a.row - b.row : a.col - b.col));
}

function toTimestamp(e: React.MouseEvent, first: Date, startHour: number) {
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
