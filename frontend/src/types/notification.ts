import { UserSummary } from './user';
import { NotificationType, NotificationReferenceType } from './enums';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  referenceType: NotificationReferenceType;
  referenceId: number | null;
  sender: UserSummary;
  createdAt: string;
}
