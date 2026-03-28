import { UserSummary } from './user';
import { ConnectionStatus } from './enums';

export interface Connection {
  id: number;
  status: ConnectionStatus;
  sender: UserSummary;
  receiver: UserSummary;
}
