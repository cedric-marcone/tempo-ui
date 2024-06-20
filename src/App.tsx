import * as React from "react";
// import Calendar from "./calendar";
import * as Dates from "./lib/dates";
import Planning from "./planning";
import { Drawer } from "vaul";

import css from "./app.module.css";

const events = [
  {
    type: "CC",
    title: "CC ENF",
    from: "2024-06-06T14:00",
    to: "2024-06-07T17:30",
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
  const [open, setOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<JSX.Element>();

  const onOpenChange = React.useCallback((opened: boolean) => {
    setOpen(opened);
  }, []);

  const openDialog = React.useCallback((dialog: JSX.Element) => {
    setDialog(dialog);
    setOpen(true);
  }, []);

  return (
    <main>
      <Planning
        date={date}
        events={events}
        startDay="SAT"
        startHour={6}
        endHour={21}
        openDialog={openDialog}
      />

      <Drawer.Root
        open={open}
        onOpenChange={onOpenChange}
        shouldScaleBackground
        handleOnly
      >
        <Drawer.Portal>
          <Drawer.Overlay className={css.drawerOverlay} />
          <Drawer.Content className={css.drawerContent}>
            <Drawer.Handle className={css.drawerHandle} />
            {dialog}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </main>
  );
  // return <Calendar events={data} />;
}
