type Participant = {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
};

type Instructor = {
  id: number;
  firstname: string;
  lastname: string;
};

type Schedule = {
  date: string;
  start_time: string;
  end_time: string;
};

type Lesson = {
  name: string;
  type: string;
  max_participants: number;
  level: string;
  participants: Participant[];
  instructor: Instructor;
  schedules: Schedule[];
};
