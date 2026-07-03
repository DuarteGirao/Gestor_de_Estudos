interface Course {
    id: number;
    nome: string;
    userid: number;
    cor: string;
    semestre: number;
}

interface Deadline {
    id: number;
    courseId: number;
    titulo: string;
    data: string;
    concluido: boolean;
}

interface Grade{
    id: number;
    courseId: number;
    tipo: string;
    nota: number;
    peso: number;
}

interface Schedule {
    id: number;
    courseId: number;
    dia_semana: number;
    hora_inicio: string;
    hora_fim: string;
    sala: string;
}

interface User {
    id: number;
    nome: string;
    email: string;
}

export type { Course, Deadline, Grade, Schedule, User };