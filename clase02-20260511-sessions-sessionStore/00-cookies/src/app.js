import express from 'express';
import cookieParser from "cookie-parser"
import { config } from './config/config.js';
const PORT=config.PORT;
// dotenv
// process.loadEnvFile("./.env")
// console.log(process.env.PORT)

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(config.SECRET))
app.use(express.static('./src/public'))

app.get('/',(req,res)=>{


    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

app.get("/getcookies", (req, res)=>{
    console.log(req.headers.cookie)

    let cookies=req.cookies
    let signedCookies=req.signedCookies

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({cookies, signedCookies});

})

app.get('/setcookies',(req,res)=>{

    let data={
        theme: "dark", 
        font: "Arial", 
        fontSize: 18,
    }


    res.cookie("coderCookie01", data, {})
    res.cookie("coderCookie02maxAge", data, {maxAge: 1000 * 5})
    res.cookie("coderCookie03expires", data, {expires: new Date(2026, 11, 18)})
    res.cookie("coderCookie04expiresSigned", data, {expires: new Date(2026, 11, 18), signed: true})
    res.cookie("coderCookie05maxAgeHttpOnly", data, {maxAge: 1000 * 60 * 5, httpOnly: true})

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Cookies generadas...!!!"});
})

app.get("/delcookies", (req, res)=>{

    // res.clearCookie("coderCookie01")
    let cookiesNames=Object.keys(req.cookies) 
    cookiesNames.forEach(cn=>res.clearCookie(cn))

    cookiesNames=Object.keys(req.signedCookies) 
    cookiesNames.forEach(cn=>res.clearCookie(cn))
    

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Cookies eliminadas"});
})


const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
