const express =require("express")
const cors=require("cors")
const mongoose=require("mongoose")

const userRoute=require("./controllers/userRouter")
const categoryRoute=require("./controllers/categoryRouter")

const app=express()

app.use(express.json())
app.use(cors())

//connecting to monngodb
mongoose.connect("mongodb+srv://suhaila:suhaila273@cluster0.azy349s.mongodb.net/vendorDb?retryWrites=true&w=majority",
{useNewUrlParser:true}
)

app.use("/api/vendor",userRoute)
app.use('/uploads',express.static('uploads'))
app.use("/api/category",categoryRoute)

app.listen(3001,()=>{
    console.log("server running")
})
