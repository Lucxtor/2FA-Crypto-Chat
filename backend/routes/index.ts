import express, { Request, Response } from "express";
import { userRegistration } from "../controllers/userController";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello from route!");
});

// Registrar usuário
router.post("/register", userRegistration);

// Ativar 2° fator Google Auth

// Login do usuário

// Envio do 2° fator para o servidor

// Troca de msg cifrada

export default router;
