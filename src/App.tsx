import * as React from "react";
import * as Dates from "./lib/dates";
import Planning from "./planning";
import { Drawer } from "vaul";
import css from "./app.module.css";

const date = Dates.parseUTCDate("2024-06-02");

const eventsPromise = fetch("/mock/events.json").then(
  (response) => response.json() as Promise<PlanEvent[]>
);

export default function App() {
  const events = React.use(eventsPromise);
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
            <Drawer.Title>Événement</Drawer.Title>
            <Drawer.Description>Détail de l'événement</Drawer.Description>
            {dialog}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </main>
  );
}
