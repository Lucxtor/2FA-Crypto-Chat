import * as fs from "fs";
import path from "path";

const dbPath = "./app/db/users.json";

export const saveUsers = (users: any) => {
  const data = JSON.stringify(users);
  fs.writeFileSync(dbPath, data);
};

export const getUsers = () => {
  const data = fs.readFileSync(path.resolve(dbPath));
  return JSON.parse(data.toString());
};

export const getUserById = (id: number) => {
  const data = getUsers();

  const user = data[id];

  return user;
};
