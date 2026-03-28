import { UserSummary } from './user';

export interface Message {
  id: number;
  content: string;
  sender: UserSummary;
  receiver: UserSummary;
  createdAt: string;
}
