import { Router } from 'express';
import { ProductManager } from '../dao/ProductsManager.js';
export const router=Router()

router.use((req, res, next)=>{
    console.log(`Middleware nivel router`)

    next()
})

router.get('/',async(req,res)=>{

    try {
        // let productos=[]
        let productos=await ProductManager.getProducts()
        
    
        res.setHeader('Content-Type','application/json')
        res.status(200).json({productos })
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Internal Server Error`, message: error.message})
    }
})

router.post("/", async(req, res)=>{

    let {code, title, price, stock}=req.body
    if(!code || !title || !price){

        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`code | title | price son requeridos`})
    }

    // validaciones pertinentes

    try {
        let nuevoProducto=await ProductManager.createProduct({code, title, price, stock})

        res.setHeader('Content-Type','application/json');
        return res.status(201).json({message: "Producto creado...!!!", nuevoProducto});
    } catch (error) {
        console.log(error)

        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`internal server error`})
    }


})