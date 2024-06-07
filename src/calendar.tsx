import * as React from "react";
import "./calendar.css";

type Props = {
  events: Lesson[];
};

type State = {
  name: string;
  count: number;
};

const initialState = { name: "", count: 0 };

export default function Calendar({ events }: Props) {
  const [state, formAction, isPending] = React.useActionState(
    async (previousState: State, formData: FormData) => {
      await sleep(250);
      const name = formData.get("name") as string;
      return { name, count: previousState.count + 1 };
    },
    initialState
  );

  return (
    <div>
      <h1>Calendar</h1>
      <p>There are {events.length} events</p>
      <div>
        {events.map((event, i) => (
          <pre key={i}>{JSON.stringify(event, null, 2)}</pre>
        ))}
      </div>
      <form action={formAction}>
        <input type="text" name="name" defaultValue={state.name} />
        <button>count is {state.count}</button>
      </form>
      {isPending && <div>...</div>}

      <h1>December 2020</h1>
      <ol className="calendar">
        <li>Sun</li>
        <li>Mon</li>
        <li>Tue</li>
        <li>Wed</li>
        <li>Thu</li>
        <li>Fri</li>
        <li>Sat</li>

        <li style={{ gridColumn: 3 }}>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
        <li>8</li>
        <li>9</li>
        <li>10</li>
        <li>11</li>
        <li>12</li>
        <li>13</li>
        <li>14</li>
        <li>15</li>
        <li>16</li>
        <li>17</li>
        <li>18</li>
        <li>19</li>
        <li>20</li>
        <li>21</li>
        <li>22</li>
        <li>23</li>
        <li>24</li>
        <li>25</li>
        <li>26</li>
        <li>27</li>
        <li>28</li>
        <li>29</li>
        <li>30</li>
        <li>31</li>
      </ol>
    </div>
  );
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
