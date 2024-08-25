export interface Dates {
  _id: string;
  date: string;
  timeslots: Timeslot[];
}

export interface Timeslot {
  _id: string;
  time: string;
  available: boolean;
  schedule: string;
}