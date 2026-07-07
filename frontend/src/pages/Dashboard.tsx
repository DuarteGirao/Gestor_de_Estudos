import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCourses } from '../services/courseService';
import type { Course } from '../types';

function Dashboard() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (token) {
      getCourses(token)
        .then((data) => {
          setCourses(data);
        })
        .catch((error) => {
          console.error('Error fetching courses:', error);
        });
    }
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>{course.nome}</li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
}

export default Dashboard;