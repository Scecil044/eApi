import mongoose from "mongoose"

const LoggerSchema = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId, ref:"user"},
    message: {type:String}
},{timestamps:true})

const Logger = mongoose.model("Logger", LoggerSchema)
export default Logger