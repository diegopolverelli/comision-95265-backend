import mongoose from "mongoose";

export const connDB=async(mongoURL, dbName)=>{
    try {
        await mongoose.connect(
            mongoURL, 
            {
                dbName
            }
        )
        console.log(`DB ${dbName} online...!!!`)
    } catch (error) {
        console.log(error)
        throw new error(`Error de conexión a DB...`)
    }
}