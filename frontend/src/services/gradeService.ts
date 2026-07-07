import type { Grade } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export async function getGrades(token: string) {
	const response = await fetch(`${API_URL}/grades`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		}
	});
	const data = await response.json();
	return data;
}

export async function createGrade(token: string, gradeData: Omit<Grade, 'id'>) {
	const response = await fetch(`${API_URL}/grades`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify(gradeData)
	});
	const data = await response.json();
	return data;
}

export async function deleteGrade(token: string, gradeId: number) {
	const response = await fetch(`${API_URL}/grades/${gradeId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		}
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Erro ao apagar nota');
	}

	return true;
}

export async function updateGrade(token: string, gradeId: number, gradeData: Partial<Omit<Grade, 'id'>>) {
	const response = await fetch(`${API_URL}/grades/${gradeId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify(gradeData)
	});
	const data = await response.json();
	return data;
}
