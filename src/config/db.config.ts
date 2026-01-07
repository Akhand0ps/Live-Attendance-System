import mongoose from "mongoose";


export const connectDb = async(uri:string):Promise<void>=>{

    // console.log("uri: ",uri);

    try{
        const conn = await mongoose.connect(uri);
        console.log(`Mongodb connected ${conn.connection.host}`)
    }catch(err:unknown){
        if(err instanceof Error){
            console.error('err connecting db: ',err.message);
        }
        else {
            console.log('err came in connecting db');
        }
    }
}
