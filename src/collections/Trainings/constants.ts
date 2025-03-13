export const TRAINING_STATUS = {
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  NOT_STARTED: 'not-started',
  ON_HOLD: 'on-hold',
} as const;

export type TrainingStatus = (typeof TRAINING_STATUS)[keyof typeof TRAINING_STATUS];

export const trainingStatusOptions = [
  {
    label: 'Ongoing',
    value: TRAINING_STATUS.ONGOING,
  },
  {
    label: 'Not Started',
    value: TRAINING_STATUS.NOT_STARTED,
  },
  {
    label: 'Completed',
    value: TRAINING_STATUS.COMPLETED,
  },
  {
    label: 'On Hold',
    value: TRAINING_STATUS.ON_HOLD,
  },
];

// list of value training status
export const TrainingStatusValues = [
  TRAINING_STATUS.ONGOING,
  TRAINING_STATUS.NOT_STARTED,
  TRAINING_STATUS.COMPLETED,
  TRAINING_STATUS.ON_HOLD,
] as const;
