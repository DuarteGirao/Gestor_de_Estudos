import prisma from "../config/prisma";
import { Prisma } from "../../generated/prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                nome: true,
                email: true
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    } 
}

export const createUser = async (req: Request, res: Response) => {
    try{
        const { nome, email, password } = req.body;

        const newUser = await prisma.user.create({
            data:{
                nome: nome as string,
                email: email as string,
                password_hash: await bcrypt.hash(password as string, 10)
            },
            select: {id: true, nome: true, email: true}
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateUser = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;         // vem da URL, ex: /users/1
        const { nome, email, password } = req.body;   // os novos valores

        const userId = parseInt(id, 10);

        const updateData: Prisma.UserUpdateInput = {};
        if (nome !== undefined) {
            updateData.nome = nome;
        }
        if (email !== undefined) {
            updateData.email = email;
        }
        if (password !== undefined) {
            updateData.password_hash = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {id: true, nome: true, email: true}
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id, 10);

        await prisma.user.delete({
            where: { id: userId }
        });

        res.status(204).send();
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'){
            res.status(409).json({message: "Não é possível deletar o usuário, pois ele possui dependências em outras tabelas."});
            return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}