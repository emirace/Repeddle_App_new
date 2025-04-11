export interface Article {
  _id: string;
  topic: string;
  category: string;
  content: string;
  createdAt: string;
}

export interface ArticleData {
  topic: string;
  category: string;
  content: string;
}
