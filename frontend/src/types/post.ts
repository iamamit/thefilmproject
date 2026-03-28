import { UserSummary } from './user';
import { ProjectType } from './enums';

export interface Post {
  id: number;
  content: string;
  imageUrl: string | null;
  isProject: boolean;
  project: boolean;
  projectType: ProjectType | null;
  likedByUserIds: number[];
  author: UserSummary;
  createdAt: string;
}

export interface CreatePostPayload {
  content: string;
  isProject: boolean;
  projectType: ProjectType | null;
  imageUrl: string | null;
}
