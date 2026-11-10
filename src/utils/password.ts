// hash the password
//compare the password for login
import bcrypt from "bcrypt";

const hashPassword = async (password:string):Promise<string> => {
  return await bcrypt.hash(password, 10);
}
export {
  hashPassword
}
