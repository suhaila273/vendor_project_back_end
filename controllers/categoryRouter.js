const express=require("express")
const path=require('path')
const router=express.Router()
const categoryModel=require("../Models/categoryModel")

const multer=require('multer')

const Storage=multer.diskStorage({
    destination: 'uploads',
    filename:(req,file,cb)=>{
        let ext=path.extname(file.originalname)
        cb(null, Date.now()+ext);
    },
});

const upload=multer({
    storage:Storage
}).single("categoryIcon")

router.post('/add_category',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            console.log(err)
        }
        else{
            const newcategory=new categoryModel({
                categoryName:req.body.categoryName,
                categoryIcon:req.file.path
            })
            newcategory.save()
      .then(() => res.send("Successfully added"))
      .catch(err => console.log(err));
        }
    })
});
router.get("/view_category",async(req,res)=>{
    let result=await categoryModel.find()
    res.json(result)
})


module.exports=router