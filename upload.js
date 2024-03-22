const multer=require('multer')
const path=require('path')

const Storage=multer.diskStorage({
    destination: 'uploads',
    filename:(req,file,cb)=>{
        let ext=path.extname(file.originalname)
        cb(null, Date.now()+ext);
    },
});

const upload=multer({
    storage:Storage
})

module.exports=upload;