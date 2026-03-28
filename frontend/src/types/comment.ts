import { UserSummary } from './user';

export interface Comment {
  id: number;
  content: string;
  author: UserSummary;
  createdAt: string;
  replies?: Comment[];
  candidateStatus?: string | null;
}
