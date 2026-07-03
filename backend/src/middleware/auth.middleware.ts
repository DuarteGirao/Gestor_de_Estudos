import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Ir buscar o cabeçalho "Authorization" do pedido
    const authHeader = req.headers.authorization;

    // 2. Se não existir, bloquear com 401
    if (!authHeader) {
      res.status(401).json({ message: "Token não fornecido" });
      return;
    }

    // 3. O header normalmente vem no formato "Bearer <token>"
    //    Precisas de separar essas duas partes
    const token = authHeader.split(' ')[1];

    // 4. Verificar o token (isto lança um erro automaticamente se for inválido/expirado)
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    // 5. Guardar o userId no req, para os controllers seguintes o poderem usar
    req.userId = decoded.userId;

    // 6. Deixar o pedido continuar para o próximo passo (o controller)
    next();

  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
};