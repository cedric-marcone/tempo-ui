import * as React from "react";
// import Calendar from "./calendar";
import * as Dates from "./lib/dates";
import Planning from "./planning";

const events = [
  {
    type: "CC",
    title: "CC ENF",
    from: "2024-06-05T14:15",
    to: "2024-06-09T17:30",
  },
  {
    type: "CC",
    title: "CC ADU",
    from: "2024-06-02T08:00",
    to: "2024-06-04T10:00",
  },
  {
    type: "LP",
    title: "CP ENF",
    from: "2024-06-03T10:00",
    to: "2024-06-06T13:00",
  },
  {
    type: "LP",
    title: "CP ENF",
    from: "2024-06-03T13:00",
    to: "2024-06-03T14:00",
  },
  {
    type: "LP",
    title: "CP ENF",
    from: "2024-06-04T13:00",
    to: "2024-06-04T14:00",
  },
  {
    type: "LP",
    title: "CP ENF",
    from: "2024-06-05T13:00",
    to: "2024-06-05T14:00",
  },
  {
    type: "LP",
    title: "CP ENF",
    from: "2024-06-03T14:00",
    to: "2024-06-04T16:00",
  },
  {
    type: "Off",
    title: "Indisponible",
    from: "2024-06-02T16:00",
    to: "2024-06-04T18:00",
  },
  {
    type: "Off",
    title: "Indisponible",
    from: "2024-06-01T08:00",
    to: "2024-06-01T19:00",
  },
];

const date = Dates.parseUTCDate("2024-06-02");

// const dataPromise = fetch("/mock/data.json").then(
//   (response) => response.json() as Promise<Lesson[]>
// );

export default function App() {
  // const data = React.use(dataPromise);
  return (
    <>
      {/* <svg className="logo" viewBox="0 0 145 38">
        <path
          d="M30 14.4c0 .5-.2.7-.5.7h-7c-.3 0-.6-.2-.6-.7v-.2c1-1.7 2.8-3 5.1-3 2.4 0 3.5 1.6 3.2 3.4l-.2-.2zm-10.2 7h25a1.4 1.4 0 001.4-.9C50.4 9.6 42.2 3 29.2 3 17.2 3 5.4 9.3 1.8 19.4-1.9 30 7.2 34.7 19 34.7c8.3 0 18.8-3 24.2-9.6l.1-.4c0-.3-.3-.7-.7-.7H27a1.4 1.4 0 00-1.1.5 5.5 5.5 0 01-4.1 2c-3.6 0-3.5-2.4-2.8-4.7.3-.5.5-.6.8-.6v.3zm24.3 10.8c-.2 0-.5-.2-.5-.5l.3-.6 7.7-7c.3-.3.7-.4 1-.4l.5.1h.2c3.4 1.7 7.7 2.8 12.8 2.8 0 0 5.7-.3 6.1-1.7.6-1.3-2.3-1.3-4.1-1.6l-4.5-.4c-8.3-.7-14.8-3.3-13.2-8 2.2-7 16.5-11 29.5-11 6.4 0 12 .6 17.2 2.1.3.2.4.4.4.7v.6l-7 6.3s-.5.4-.9.4h-.5c-3.2-1-6.8-2-11-2-2 0-5 .4-5.3 1.6-.3 1.1 2.3 1.4 4 1.5l4.7.6c9 1 14.9 3.4 13.2 8.5C92.4 31.4 78.1 35 65.2 35c-7.1 0-15-1-21-2.5v-.3zm75.5-8.8c-.3 0-.5.2-.5.4l-2.8 8.7a1.4 1.4 0 01-1.4 1H96c-.3 0-.6-.4-.6-.7v-.3l8.4-26.9a1.4 1.4 0 011.4-1h36.2c.4 0 .7.5.7.7v.3l-2 6.4a1.4 1.4 0 01-1.3 1h-16c-.2 0-.5 0-.5.3l-.5 1.7v.3c0 .4.3.7.7.7h13.4c.3 0 .5.2.5.7v.2l-1.8 5.8a1.4 1.4 0 01-1.3.9h-13.7v-.2"
          fill="#CC0900"
        />
      </svg> */}
      <Planning
        date={date}
        events={events}
        startDay="SAT"
        startHour={0}
        endHour={24}
      />
    </>
  );
  // return <Calendar events={data} />;
}
