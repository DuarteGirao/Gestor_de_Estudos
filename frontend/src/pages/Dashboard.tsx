import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createCourse, getCourses } from '../services/courseService';
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

  function handleCourseCreated(newCourse: Course) {
  setCourses([...courses, newCourse]);
}

  return (
    <div>
      <h1>Dashboard</h1>
      <LogoutButton />
      <CreateCourse token={token} onCourseCreated={handleCourseCreated} />
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

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return <button onClick={handleLogout}>Logout</button>;
}

function CreateCourse({ token, onCourseCreated }: { token?: string | null; onCourseCreated: (newCourse: Course) => void }) {
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('');
  const [semestre, setSemestre] = useState(1);

  async function handleCreateCourse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;

    try {
      const newCourse = await createCourse(token, { nome, cor, semestre });
      if (newCourse) onCourseCreated(newCourse);
      setNome('');
      setCor('');
      setSemestre(1);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleCreateCourse}>
      <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" />
      <input value={cor} onChange={(e) => setCor(e.target.value)} placeholder="Cor" />
      <input type="number" value={semestre} onChange={(e) => setSemestre(Number(e.target.value))} min={1} />
      <button type="submit">Create</button>
    </form>
  );
}

export default Dashboard;