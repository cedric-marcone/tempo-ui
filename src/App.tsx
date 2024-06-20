import * as React from "react";
import * as Dates from "./lib/dates";
import Planning from "./planning";
import { Drawer as Vaul } from "vaul";
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

      <Vaul.Root
        open={open}
        onOpenChange={onOpenChange}
        shouldScaleBackground
        // handleOnly
      >
        <Vaul.Portal>
          <Vaul.Overlay className={css.drawerOverlay} />
          <Vaul.Content className={css.drawerContent}>
            <Vaul.Handle className={css.drawerHandle} />
            <Vaul.Title>Événement</Vaul.Title>
            <Vaul.Description>Détail de l'événement</Vaul.Description>
            {dialog}
          </Vaul.Content>
        </Vaul.Portal>
      </Vaul.Root>
    </main>
  );
}
