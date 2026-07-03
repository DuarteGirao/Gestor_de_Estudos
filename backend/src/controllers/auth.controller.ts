import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Ir buscar o user pelo email
    const user = await prisma.user.findUnique({ where: { email } });

    // 2. Se não existir, responder com erro genérico (pensa no status code certo)
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // 3. Comparar a password enviada com o hash guardado
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    // 4. Se não coincidir, mesmo erro genérico de antes
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // 5. Gerar o token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // 6. Devolver o token
    res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};