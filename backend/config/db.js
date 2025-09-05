import mongoose from "mongoose";

export function DatabaseConnection(){
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("Database Connected")
    })
    .catch(()=>{
        console.log("Error Occured")
    })
}