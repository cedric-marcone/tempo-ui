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
  const colHeaders = Arrays.range(0, 7).map(Dates.formatDay(first));
  const rowHeaders = Arrays.range(startHour, endHour).map(Dates.formatHour);

  const cellClicked = (row: number, col: number) => (e: React.MouseEvent) => {
    const res = physicalToLogical(row, col, e);
    console.log(res);
  };

  const slotClicked = (slot: Event) => (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(slot);
  };

  return (
    <div className={css.grid}>
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
        {colHeaders.map((header, c) => (
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
      {rowHeaders.map((header, r) => (
        <div key={r} className={css.row}>
          <div
            className={classNames(css.cell, css.rowHeader)}
            style={{ gridRow: r + 2, gridColumn: 1 }}
          >
            {header}
          </div>
          {colHeaders.map((_, c) => (
            <div
              key={c}
              className={css.cell}
              style={{ gridRow: r + 2, gridColumn: c + 2 }}
              onClick={cellClicked(r, c)}
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

function physicalToLogical(row: number, col: number, e: React.MouseEvent) {
  const target = e.target as HTMLElement;
  const bounds = target.getBoundingClientRect();
  const percentageY = (e.clientY - bounds.y) / bounds.height;
  const quarterly = Numbers.roundMinutesToQuarter(60 * percentageY);
  const r = quarterly === 60 ? row + 1 : row;
  const minutes = quarterly === 60 ? 0 : quarterly;
  return { row: r, col, minutes };
}
