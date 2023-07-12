const multer = require("multer");
const path = require("path");
const {s3} = require('../config/AWS')
const multerS3 = require('multer-s3');

//Destino onde a imagem vai ser salva 
const imageStorage = multerS3({
    s3: s3,
    bucket: 'reactgram-lucas',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const folder = req.baseUrl.includes("users") ? 'users' : 'photos';
      cb(null, folder + '/' + Date.now().toString() + path.extname(file.originalname));
    }
  });


//validar imagem 
const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        // aceitar somente formatos png e jpg
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Por favor, envie apenas png ou jpg!"))
        }
        cb(undefined, true);
    }
})

module.exports = { imageUpload };