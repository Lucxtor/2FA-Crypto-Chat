import { Request, Response } from "express";
import * as crypto from "crypto";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { getUserById, getUsers, saveUsers } from "../repositories/user";

// Registrar usuário
export const userRegistration = async (req: Request, res: Response) => {
  const { username, token, email } = req.body;

  if (!username || !token || !email) {
    return res.status(400).send("missing params");
  }

  const pass = username + token;

  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .scryptSync(pass, salt, 64, {
      cost: 2048,
      blockSize: 8,
      parallelization: 1,
    })
    .toString("hex");

  const users = getUsers();

  const id = Object.keys(users).length + 1;

  const newUser = { id, username, email, hash, salt, twoFactor: false };

  users[id] = newUser;
  saveUsers(users);

  return res.send(newUser);
};

// Habilitar 2° fator
export const activate2FA = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send("missing params");
  }

  const users = getUsers();

  if (users[id] == undefined) {
    res.status(400).send("user not found");
  }

  // Gerar a OTP
  const secret = speakeasy.generateSecret();

  users[id]["secret"] = secret;
  users[id]["twoFactor"] = true;

  saveUsers(users);

  const otp = secret.otpauth_url;
  if (otp != undefined) {
    await qrcode.toDataURL(otp, (err, qrcode) => {
      res.send({ qrcode: qrcode });
    });
  } else {
    res.status(400).send("Erro ao gerar otp");
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  // Receber usuário, token e horario
  // Fazer o scrypt
  // comparar o token scrypt com o token armazenado
  // Inválido -> Erro
  // Valido -> gerar o código de 2FA e retorna para o cliente
};

// Verificação do 2° fator
export const authCode = async (req: Request, res: Response) => {
  const { id, code } = req.body;

  if (!id || !code) {
    return res.status(400).send("missing params");
  }

  const users = getUsers();

  if (users[id] == undefined) {
    res.status(400).send("user not found");
  }

  const secret = users[id]["secret"];

  const verified = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: "base32",
    token: code,
  });

  if (verified) {
    res.send("Ok");
  } else {
    res.status(401).send("wrong auth code");
  }

  // Gera o código no servidor
  // Compara
};

// Troca de msg
export const msg = async (req: Request, res: Response) => {
  // Receber a msg cifrada
  // Logar a msg decifrada para conferencia
  // Responder a msg cifrada
};
