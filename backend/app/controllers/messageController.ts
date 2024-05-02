import { Request, Response } from "express";
import * as crypto from "crypto";

export const receiveMessage = async (req: Request, res: Response) => {
  const { message, sessionToken } = req.body;

  if (!message || !sessionToken) {
    return res.status(400).send("missing params");
  }
};
