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