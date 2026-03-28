import { CompanyType } from './enums';

export interface Company {
  id: number;
  name: string;
  slug: string;
  type: CompanyType | null;
  city: string | null;
  logoUrl: string | null;
  coverUrl?: string | null;
  description?: string | null;
  website?: string | null;
  isVerified: boolean;
  isOfficial: boolean;
  followerCount: number;
  followerIds?: number[];
}
