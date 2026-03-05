export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  youtube_url: string;
  order_index: number;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  created_at: string;
  modules?: Module[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  courses?: Course[];
}
