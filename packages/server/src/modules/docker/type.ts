import { EventAction, EventType } from '@common/constants/enum';

export interface Event {
  status: string;
  id: string;
  from: string;
  Type: EventType;
  Action: EventAction;
  Actor: {
    ID: string;
    Attributes: Record<string, string>;
  };
  scope: string;
  time: number;
  timeNano: number;
}
