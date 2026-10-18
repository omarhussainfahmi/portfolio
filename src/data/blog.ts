export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  paragraphs: string[];
  image?: string;
}
export const articles: Article[] = [];
export const readingTime = (article: Article) =>
  Math.max(1, Math.ceil(article.paragraphs.join(' ').split(/\s+/).length / 200));
