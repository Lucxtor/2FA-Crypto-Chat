import express, { Request, Response } from "express";
import {
  activate2FA,
  authCode,
  login,
  userRegistration,
} from "../controllers/userController";
import { receiveMessage } from "../controllers/messageController";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("API com 2FA");
});

// Registrar usuário
router.post("/register", userRegistration);

// Ativar 2° fator Google Auth
router.post("/activate2FA", activate2FA);

// Login do usuário
router.post("/login", login);

// Envio do 2° fator para o servidor
router.post("/authCode", authCode);

// Troca de msg cifrada
router.post("/message", receiveMessage);

export default router;
