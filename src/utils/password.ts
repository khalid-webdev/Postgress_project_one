// hash the password
//compare the password for login
import bcrypt from "bcrypt";

const hashPassword = async (password:string):Promise<string> => {
  return bcrypt.hash(password, 10);
}

const comparePassword = async (inputPassword: string, storedHashPassword: string): Promise<boolean> => {
  return bcrypt.compare(inputPassword, storedHashPassword);
}

export {
  hashPassword,
  comparePassword
}
