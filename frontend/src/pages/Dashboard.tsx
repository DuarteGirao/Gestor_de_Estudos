import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createCourse, deleteCourse, updateCourse, getCourses } from '../services/courseService';
import { createGrade, deleteGrade, getGrades, updateGrade } from '../services/gradeService';
import type { Course, Grade } from '../types';

function Dashboard() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    if (token) {
      Promise.all([getCourses(token), getGrades(token)])
        .then(([coursesData, gradesData]) => {
          setCourses(coursesData);
          setGrades(gradesData);
        })
        .catch((error) => {
          console.error('Error fetching dashboard data:', error);
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

  function handleGradeCreated(newGrade: Grade) {
    setGrades((currentGrades) => [...currentGrades, newGrade]);
  }

  function handleGradeUpdated(updatedGrade: Grade) {
    setGrades((currentGrades) =>
      currentGrades.map((grade) => (grade.id === updatedGrade.id ? updatedGrade : grade))
    );
  }

  function handleGradeDeleted(deletedGradeId: number) {
    setGrades((currentGrades) => currentGrades.filter((grade) => grade.id !== deletedGradeId));
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <LogoutButton />
      <p>Grades carregadas: {grades.length}</p>
      <CreateCourse token={token} onCourseCreated={handleCourseCreated} />
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              token={token}
              grades={grades.filter((grade) => grade.courseId === course.id)}
              onCourseUpdated={handleCourseUpdated}
              onGradeCreated={handleGradeCreated}
              onGradeUpdated={handleGradeUpdated}
              onGradeDeleted={handleGradeDeleted}
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

function CourseItem({ course, token, grades, onCourseUpdated, onGradeCreated, onGradeUpdated, onGradeDeleted, onCourseDeleted }: {
  course: Course;
  token?: string | null;
  grades: Grade[];
  onCourseUpdated: (updatedCourse: Course) => void;
  onGradeCreated: (newGrade: Grade) => void;
  onGradeUpdated: (updatedGrade: Grade) => void;
  onGradeDeleted: (deletedGradeId: number) => void;
  onCourseDeleted: (deletedCourseId: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState(course.nome);
  const [cor, setCor] = useState(course.cor);
  const [semestre, setSemestre] = useState(course.semestre);
  const [tipo, setTipo] = useState('');
  const [nota, setNota] = useState(0);
  const [peso, setPeso] = useState(0);

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

  async function handleCreateGrade(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;

    try {
      const newGrade = await createGrade(token, { courseId: course.id, tipo, nota, peso });
      if (newGrade) onGradeCreated(newGrade);
      setTipo('');
      setNota(0);
      setPeso(0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar nota';
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
      {grades.length > 0 ? (
        <ul>
          {grades.map((grade) => (
            <GradeItem
              key={grade.id}
              grade={grade}
              token={token}
              onGradeUpdated={onGradeUpdated}
              onGradeDeleted={onGradeDeleted}
            />
          ))}
        </ul>
      ) : (
        <p>Sem notas para esta cadeira.</p>
      )}
      <form onSubmit={handleCreateGrade}>
        <input value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Tipo" />
        <input type="number" value={nota} onChange={(e) => setNota(Number(e.target.value))} placeholder="Nota" />
        <input type="number" value={peso} onChange={(e) => setPeso(Number(e.target.value))} placeholder="Peso" />
        <button type="submit">Nova nota</button>
      </form>
      <button onClick={() => setIsEditing(true)}>Editar</button>
      <button onClick={handleDelete}>Apagar</button>
    </li>
  );
}

function GradeItem({ grade, token, onGradeUpdated, onGradeDeleted }: {
  grade: Grade;
  token?: string | null;
  onGradeUpdated: (updatedGrade: Grade) => void;
  onGradeDeleted: (deletedGradeId: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tipo, setTipo] = useState(grade.tipo);
  const [nota, setNota] = useState(grade.nota);
  const [peso, setPeso] = useState(grade.peso);

  async function handleUpdateGrade(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;

    try {
      const updatedGrade = await updateGrade(token, grade.id, {
        courseId: grade.courseId,
        tipo,
        nota,
        peso
      });
      onGradeUpdated(updatedGrade);
      setIsEditing(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar nota';
      alert(message);
    }
  }

  async function handleDeleteGrade() {
    if (!token) return;

    try {
      await deleteGrade(token, grade.id);
      onGradeDeleted(grade.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao apagar nota';
      alert(message);
    }
  }

  if (isEditing) {
    return (
      <li>
        <form onSubmit={handleUpdateGrade}>
          <input value={tipo} onChange={(e) => setTipo(e.target.value)} />
          <input type="number" value={nota} onChange={(e) => setNota(Number(e.target.value))} />
          <input type="number" value={peso} onChange={(e) => setPeso(Number(e.target.value))} />
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
        </form>
      </li>
    );
  }

  return (
    <li>
      {grade.tipo}: {grade.nota} ({grade.peso})
      <button onClick={() => setIsEditing(true)}>Editar</button>
      <button onClick={handleDeleteGrade}>Apagar</button>
    </li>
  );
}

export default Dashboard;