import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

const app = express();
dotenv.config();

const PORT = process.env.PORT || 1919;
const  MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(()=>{
    console.log("Its working");
    app.listen(PORT, () => {
        console.log("server " +PORT)
    });
})
.catch((error)=> console.log(error));

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
});

const UserModel = mongoose.model("user", userSchema)

app.get("/getUser", async (req, res) => {
    const userData = await UserModel.find();
    res.json(userData);
});