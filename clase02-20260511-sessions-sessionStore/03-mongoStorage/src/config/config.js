process.loadEnvFile("./.env")

export const config={
    SECRET: process.env.SECRET, 
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL, 
    DB_NAME: process.env.DB_NAME
}