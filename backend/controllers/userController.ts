import { Request, Response } from "express";

// Registrar usuário
export const userRegistration = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).send("missing params");
  }

  const obj = { response: "Registrou Certo" };

  // tratar o dados do usuário

  // armazenar os dados criptografados (hash da senha)

  return res.send(obj);
};

// Habilitar 2° fator
export const activate2FA = async (req: Request, res: Response) => {
  // Gerar a OTP
  // retornar a OTP no formato de img (QR code)
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
  // Receber o código do usuário
  // Gera o código no servidor
  // Compara
};

// Troca de msg
export const msg = async (req: Request, res: Response) => {
  // Receber a msg cifrada
  // Logar a msg decifrada para conferencia
  // Responder a msg cifrada
};
