import { Request, Response } from "express";
import * as crypto from "crypto";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { getUsers, saveUsers, getUserIdByUsername } from "../repositories/user";

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

  const newUser = {
    id,
    username,
    email,
    hash,
    salt,
    twoFactor: false,
    msgCount: 0,
  };

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
    res.status(400).send("Error generating otp");
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  // Receber usuário, token e horario
  // Fazer o scrypt
  // comparar o token scrypt com o token armazenado
  // Inválido -> Erro
  // Valido -> gerar o código de 2FA e retorna para o cliente

  const { username, token, time } = req.body;

  if (!username || !token || !time) {
    return res.status(400).send("missing params");
  }

  const pass = username + token;

  const users = getUsers();

  const id = getUserIdByUsername(username);

  if (id == undefined) {
    return res.status(400).send("user not found");
  }

  const salt = users[id]["salt"];

  const hash = crypto
    .scryptSync(pass, salt, 64, {
      cost: 2048,
      blockSize: 8,
      parallelization: 1,
    })
    .toString("hex");

  if (hash == users[id]["hash"]) {
    res.send("Envie o código do seu autenticador");
  } else {
    res.status(401).send("wrong auth code");
  }
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
    window: 2,
  });

  if (!verified) {
    res.status(401).send("wrong auth code");
  }

  const hashSalt = crypto.createHash("sha256");

  hashSalt.update(users[id]["username"]);

  const salt = hashSalt.digest("base64");

  const sessionToken = crypto
    .pbkdf2Sync(code, salt, 1000, 16, "sha512")
    .toString("hex");

  const hashIv = crypto.createHash("sha256");

  hashIv.update(
    users[id]["username"] + users[id]["msgCount"] + users[id]["email"]
  );

  let iv = hashIv.digest("base64");

  users[id]["msgCount"] += 0;
  users[id]["session"] = sessionToken;

  saveUsers(users);

  const cipher = crypto.createCipheriv("aes-256-gcm", sessionToken, iv);

  const msg = cipher.update(
    "Logado com sucesso, envie a sua primeira msg",
    "utf8",
    "hex"
  );

  res.status(200).send({ sessionToken, salt, iv, msg });
};
