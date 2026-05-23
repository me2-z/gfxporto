export interface PortfolioItem {
  _id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  createdAt?: string;
  order?: number;
}

export interface TransformationItem {
  _id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  createdAt?: string;
  order?: number;
}

export interface SiteSettings {
  [key: string]: unknown;
}

export interface JsonDbShape {
  portfolios: PortfolioItem[];
  transformations: TransformationItem[];
  settings: SiteSettings;
}
