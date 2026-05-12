process.loadEnvFile("./.env")

export const config={
    SECRET: process.env.SECRET, 
    PORT: process.env.PORT || 3000,
}