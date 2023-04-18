export interface Issue {
  id: number;
  title: string;
  number: number;
  created_at: string;
  comments: number;
  author: string;
}

export type Board = {
  id: number;
  title: string;
  items: Issue[];
};
