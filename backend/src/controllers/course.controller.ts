import { Prisma } from "../../generated/prisma/client";
import prisma from "../config/prisma";
import { Request, Response } from "express";

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const courses = await prisma.course.findMany({
            where: {
                userid: req.userId,
            },
        });
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    try {
        const { nome, cor, semestre } = req.body;
        const userid = req.userId;

        const newCourse = await prisma.course.create({
            data: {
                nome: nome as string,
                cor: cor as string,
                semestre: semestre as number,
                userid: userid as number,
            }
        });

        res.status(201).json(newCourse);
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'){
            res.status(409).json({message: "Não é possível criar o curso, pois o usuário especificado não existe."});
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateCourse = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;         // vem da URL, ex: /courses/1
        const { nome, cor, semestre } = req.body;   // os novos valores

        const courseId = parseInt(id, 10);

        const updateData: Prisma.CourseUpdateInput = {};
        if (nome !== undefined) {
            updateData.nome = nome;
        }
        if (cor !== undefined) {
            updateData.cor = cor;
        }
        if (semestre !== undefined) {
            updateData.semestre = semestre;
        }

        const updatedCourse = await prisma.course.update({
            where: { id: courseId, userid: req.userId },
            data: updateData
        });

        res.status(200).json(updatedCourse);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            res.status(404).json({ message: "Curso não encontrado" });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteCourse = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const courseId = parseInt(id, 10);

        await prisma.course.delete({
            where: { id: courseId, userid: req.userId },
        });

        res.status(204).send();
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            res.status(404).json({ message: "Curso não encontrado" });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

}