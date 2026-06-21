const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Multimedia = require("../models/Multimedia");

// ==============================
// CONFIGURACIÓN MULTER
// ==============================

const storage = multer.diskStorage({

    destination: function(req,file,cb){

        if(file.fieldname==="imagen"){

            cb(null,"uploads/imagenes");

        }else{

            cb(null,"uploads/audios");

        }

    },

    filename:function(req,file,cb){

        const nombre=Date.now()+"-"+Math.round(Math.random()*100000);

        cb(null,nombre+path.extname(file.originalname));

    }

});

const upload=multer({

storage

});

// ==============================
// CREATE
// ==============================

router.post("/",

upload.fields([

{name:"imagen",maxCount:1},

{name:"audio",maxCount:1}

]),

async(req,res)=>{

try{

const nuevo=new Multimedia({

titulo:req.body.titulo,

descripcion:req.body.descripcion,

tags:req.body.tags
?req.body.tags.split(",").map(tag=>tag.trim())
:[],

imagenUrl:"/uploads/imagenes/"+req.files.imagen[0].filename,

audioUrl:"/uploads/audios/"+req.files.audio[0].filename

});

await nuevo.save();

res.json({

mensaje:"Guardado correctamente"

});

}catch(error){

console.log(error);

res.status(500).json(error);

}

});

// ==============================
// READ
// ==============================

router.get("/",async(req,res)=>{

try{

const datos=await Multimedia.find().sort({

fechaCreacion:-1

});

res.json(datos);

}catch(error){

res.status(500).json(error);

}

});

// ==============================
// DELETE
// ==============================

router.delete("/:id",async(req,res)=>{

try{

const multimedia=await Multimedia.findById(req.params.id);

if(!multimedia){

return res.status(404).json({

mensaje:"No encontrado"

});

}

// eliminar imagen

const rutaImagen="."+multimedia.imagenUrl;

if(fs.existsSync(rutaImagen)){

fs.unlinkSync(rutaImagen);

}

// eliminar audio

const rutaAudio="."+multimedia.audioUrl;

if(fs.existsSync(rutaAudio)){

fs.unlinkSync(rutaAudio);

}

await Multimedia.findByIdAndDelete(req.params.id);

res.json({

mensaje:"Eliminado"

});

}catch(error){

res.status(500).json(error);

}

});

module.exports=router;