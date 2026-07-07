import type { Course } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCourses(token: string) {
  const response = await fetch(`${API_URL}/courses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data;
}

export async function createCourse(token: string, courseData: Omit<Course, 'id' | 'userid'>) {
  const response = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(courseData)
  });
  const data = await response.json();
  return data;
}
