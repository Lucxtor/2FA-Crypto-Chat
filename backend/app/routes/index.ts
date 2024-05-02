import express, { Request, Response } from "express";
import {
  activate2FA,
  authCode,
  userRegistration,
} from "../controllers/userController";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello from route!");
});

// Registrar usuário
router.post("/register", userRegistration);

// Ativar 2° fator Google Auth
router.post("/activate2FA", activate2FA);

// Login do usuário

// Envio do 2° fator para o servidor
router.post("/authCode", authCode);

// Troca de msg cifrada

export default router;
