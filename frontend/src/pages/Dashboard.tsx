import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createCourse, deleteCourse, updateCourse, getCourses } from '../services/courseService';
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

  function handleCourseUpdated(updatedCourse: Course) {
    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <LogoutButton />
      <CreateCourse token={token} onCourseCreated={handleCourseCreated} />
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              token={token}
              onCourseUpdated={handleCourseUpdated}
              onCourseDeleted={(deletedCourseId) => {
                setCourses((currentCourses) =>
                  currentCourses.filter((c) => c.id !== deletedCourseId)
                );
              }}
            />
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

function CourseItem({ course, token, onCourseUpdated, onCourseDeleted }: {
  course: Course;
  token?: string | null;
  onCourseUpdated: (updatedCourse: Course) => void;
  onCourseDeleted: (deletedCourseId: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState(course.nome);
  const [cor, setCor] = useState(course.cor);
  const [semestre, setSemestre] = useState(course.semestre);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    try {
      const updated = await updateCourse(token, course.id, { nome, cor, semestre });
      onCourseUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete() {
    if (!token) return;
    try {
      await deleteCourse(token, course.id);
      onCourseDeleted(course.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao apagar curso';
      alert(message);
    }
  }

  if (isEditing) {
    return (
      <li>
        <form onSubmit={handleUpdate}>
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
          <input value={cor} onChange={(e) => setCor(e.target.value)} />
          <input type="number" value={semestre} onChange={(e) => setSemestre(Number(e.target.value))} />
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
        </form>
      </li>
    );
  }

  return (
    <li>
      {course.nome}
      <button onClick={() => setIsEditing(true)}>Editar</button>
      <button onClick={handleDelete}>Apagar</button>
    </li>
  );
}

export default Dashboard;