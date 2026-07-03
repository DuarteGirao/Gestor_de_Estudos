import prisma from "../config/prisma";
import { Prisma } from "../../generated/prisma/client";
import { Request, Response } from "express";
import { CourseScalarFieldEnum } from "../../generated/prisma/internal/prismaNamespace";

export const getAllGrade = async (req: Request, res: Response) => {
    try{
        const grades = await prisma.grade.findMany({
            where: {
                Course:{
                    userid: req.userId,
                }
            }
        });
        res.status(200).json(grades);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createGrade = async (req: Request, res: Response) => {
    try{
        const { courseId, tipo, nota, peso} = req.body;

        const course = await prisma.course.findUnique({where: {id: courseId}});

        if (!course || course.userid !== req.userId){
            res.status(403).json({message: "Não é possível criar a nota, pois o curso especificado não pertence ao usuário autenticado."});
            return;
        }

        const newGrade = await prisma.grade.create({
            data:{
                courseId: courseId as number,
                tipo: tipo as string,
                nota: nota as number,
                peso: peso as number,
            }
        });
        res.status(201).json(newGrade);
    } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'){
                res.status(409).json({message: "Não é possível criar a nota, pois o curso especificado não existe."});
                return;
            }
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
    }
}

export const updateGrade = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;         // vem da URL, ex: /users/1
        const { tipo, nota, peso } = req.body;   // os novos valores

        const gradeId = parseInt(id, 10);

        const updateData: Prisma.GradeUpdateInput = {};
        if (tipo !== undefined) {
            updateData.tipo = tipo;
        }
        if (nota !== undefined) {
            updateData.nota = nota;
        }
        if (peso !== undefined) {
            updateData.peso = peso;
        }

        const updatedGrades = await prisma.grade.update({
            where: { id: gradeId, Course: { userid: req.userId } },
            data: updateData,
        });

        res.status(200).json(updatedGrades);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            res.status(404).json({ message: "Nota não encontrada" });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteGrade = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const gradeId = parseInt(id, 10);
        await prisma.grade.delete({
            where: { id: gradeId, Course: { userid: req.userId } }
        });
        res.status(204).send();
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            res.status(404).json({ message: "Nota não encontrada" });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}