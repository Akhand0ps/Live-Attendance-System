import bcrypt from "bcrypt"


export const hashPass = async(password:string):Promise<String>=>{

    const saltrounds = 10;
    return await bcrypt.hash(password,saltrounds);
}