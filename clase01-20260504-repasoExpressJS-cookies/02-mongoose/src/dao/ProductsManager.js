import { productModel } from "./models/productsModel.js";

export class ProductManager{
    constructor(){

    }

    static async getProducts(){
        return await productModel.find().lean()
    }

    static async createProduct(product={}){

        let newProduct=await productModel.create(product)
        return newProduct.toJSON()

    }

    // getProductos(){

    // }
}

// ProductManager.getProducts()

// const productsManager=new ProductManager()
// productsManager.getProductos()

