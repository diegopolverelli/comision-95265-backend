import mongoose from "mongoose"

export const conectar=async(url, dbName)=>{
    try {
        await mongoose.connect(
            url, 
            {
                dbName
            },
        )
        console.log(`Conexión a DB establecida`)
    } catch (err) {
        console.log(`Error al conectarse con el servidor de BD: ${err.message}`)
    }
}