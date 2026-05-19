process.loadEnvFile("./.env")

export const config={
    PORT: process.env.PORT || 3000 ,
    SECRET: process.env.SECRET,
    MONGO_URL: process.env.MONGO_URL, 
    DBNAME: process.env.DBNAME,
}