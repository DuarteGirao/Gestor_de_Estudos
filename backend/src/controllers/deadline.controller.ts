import { Prisma } from "../../generated/prisma/client";
import prisma from "../config/prisma";
import { Request, Response } from "express";

export const getAllDeadline = async (req: Request, res: Response) => {
    try {
        const deadlines = await prisma.deadline.findMany({
            where: {
                Course: {
                    userid: req.userId,
                },
            },
        });
        res.status(200).json(deadlines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createDeadline = async (req: Request, res: Response) => {
    try {
        const { courseId, titulo, data, concluido } = req.body;

        const course = await prisma.course.findUnique({where: {id: courseId}});

        if (!course || course.userid !== req.userId) {
            res.status(403).json({message: "Não é possível criar o prazo, pois o curso especificado não pertence ao usuário autenticado."});
            return;
        }

        const newDeadline = await prisma.deadline.create({
            data: {
                courseId: courseId as number,
                titulo: titulo as string,
                data: new Date(data),
                concluido: concluido as boolean
            }
        });
        res.status(201).json(newDeadline);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
            res.status(409).json({ message: "Não é possível criar o prazo, pois o curso especificado não existe." });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateDeadline = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, data, concluido } = req.body;
        const deadlineId = parseInt(id, 10);

        const updateData: Prisma.DeadlineUpdateInput = {};
        if (titulo !== undefined) {
            updateData.titulo = titulo;
        }

        if (data !== undefined) {
            updateData.data = new Date(data);
        }

        if (concluido !== undefined) {
            updateData.concluido = concluido;
        }

        const updatedDeadline = await prisma.deadline.update({
            where: { id: deadlineId, Course: { userid: req.userId } },
            data: updateData
        });

        res.status(200).json(updatedDeadline);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            res.status(404).json({ message: "Prazo não encontrado" });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteDeadline = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const deadlineId = parseInt(id, 10);
        await prisma.deadline.delete({
            where: { id: deadlineId, Course: { userid: req.userId } }
        });
        res.status(204).send();
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            res.status(404).json({ message: "Prazo não encontrado" });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}