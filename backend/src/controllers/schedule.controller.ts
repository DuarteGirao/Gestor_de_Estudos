import { Prisma } from "../../generated/prisma/client";
import prisma from "../config/prisma";
import { Request, Response } from "express";

export const getAllSchedule = async (req: Request, res: Response) => {
    try {
        const schedules = await prisma.schedule.findMany({
            where: { Course: { userid: req.userId } }
        });
        res.status(200).json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createSchedule = async (req: Request, res: Response) => {
    try {
        const { courseId, dia_semana, hora_inicio, hora_fim, sala } = req.body;

        const course = await prisma.course.findUnique({where: {id: courseId}});

        if (!course || course.userid !== req.userId) {
            res.status(403).json({message: "Não é possível criar o horário, pois o curso especificado não pertence ao usuário autenticado."});
            return;
        }

        const newSchedule = await prisma.schedule.create({
            data: {
                courseId: courseId as number,
                dia_semana: dia_semana as number,
                hora_inicio: new Date(hora_inicio),
                hora_fim: new Date(hora_fim),
                sala: sala as string,
            }
        });
        res.status(201).json(newSchedule);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
            res.status(409).json({ message: "Não é possível criar o horário, pois o curso especificado não existe." });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateSchedule = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const { dia_semana, hora_inicio, hora_fim, sala } = req.body;
        const scheduleId = parseInt(id, 10);
        
        const updateData: Prisma.ScheduleUpdateInput = {};
        if (dia_semana !== undefined) {
            updateData.dia_semana = dia_semana;
        }

        if (hora_inicio !== undefined) {
            updateData.hora_inicio = new Date(hora_inicio);
        }

        if (hora_fim !== undefined) {
            updateData.hora_fim = new Date(hora_fim);
        }
        if (sala !== undefined) {
            updateData.sala = sala;
        }

        const updatedSchedule = await prisma.schedule.update({
            where: { id: scheduleId, Course: { userid: req.userId } },
            data: updateData
        });

        res.status(200).json(updatedSchedule);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            res.status(404).json({ message: "Horário não encontrado" });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteSchedule = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const scheduleId = parseInt(id, 10);

        await prisma.schedule.delete({
            where: { id: scheduleId, Course: { userid: req.userId } }
        });
        res.status(204).send();
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            res.status(404).json({ message: "Horário não encontrado" });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
