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

export async function deleteCourse(token: string, courseId: number) {
  const response = await fetch(`${API_URL}/courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao apagar curso');
  }

  return true;
}

export async function updateCourse(token: string, courseId: number, courseData: Partial<Omit<Course, 'id' | 'userid'>>) {
  const response = await fetch(`${API_URL}/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(courseData)
  });
  const data = await response.json();
  return data;
}
