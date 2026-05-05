import express from 'express';
import cookieParser from "cookie-parser"
const PORT=3000;

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(express.static('./src/public'))

app.get('/',(req,res)=>{


    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

app.get("/getcookies", (req, res)=>{
    console.log(req.headers.cookie)

    let cookies=req.cookies

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({cookies});

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

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Cookies generadas...!!!"});
})


const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
