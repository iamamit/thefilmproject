import { PortfolioCategory } from './enums';

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  category: PortfolioCategory;
  videoUrl: string | null;
  imageUrl: string | null;
}
