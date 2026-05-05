import mongoose from "mongoose"

export const productModel=mongoose.model(
    "products", 
    new mongoose.Schema(
        {
            title: String, 
            code: {
                type: String, 
                unique: true
            }, 
            stock: {
                type: Number, 
                default: 0
            }, 
            price: Number, 
        }, 
        {
            timestamps: true, 
            // collection: "productos2023",
            // strict: false, 
        }
    )
)

// productModel.create()

// await mongoose.connection.collection("users").insertMany([{name: "Juan"}, {name:"Maria"}])