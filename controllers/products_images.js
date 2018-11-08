"use strict"

const mime = require('mime');
const multer = require('multer');
const path = require ('path'); 

//"Estrategia de salvado de nuevas imágenes entrantes"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now() + '.' + mime.getExtension(file.mimetype));
    }
});

const fileFilter = function (req, res, cb){
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());

    if (mimetype && extname){
        return cb (null, true);
    }
    req.invalid_files.push(file.originalname);
    console.log('Archivo inválido: ' + file.originalname + '' + file.mimetype);
    cb(null, false);
}

const maxCount = 5;

const upload = multer ({ 
    fileFilter: fileFilter,
    storage: storage
}).array('images[]', maxCount);

module.exports = upload;