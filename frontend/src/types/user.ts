import { UserRole } from './enums';

export interface UserSummary {
  id: number;
  username: string;
  fullName: string;
  profilePhotoUrl: string | null;
  roles: UserRole[];
  city: string | null;
}

export interface User extends UserSummary {
  bio: string | null;
  country: string | null;
  availableForWork: boolean;
  createdAt: string;
  languages: string[];
  email?: string;
  emailVerified?: boolean;
  profileCompletionPercent?: number;
}
