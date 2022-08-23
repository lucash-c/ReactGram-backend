const multer = require("multer");
const path = require("path");

//Destino onde a imagem vai ser salva 
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = ""

        if (req.baseUrl.includes("users")) {
            folder = "users"
        } else if (req.baseUrl.includes("photos")) {
            folder = "photos"
        } else {
            folder = "others"
        }

        cb(null, `uploads/${folder}/`)
    },
    filename: (req, file, cb) => {
        //Ex: 89d5449y984y9f654.jpg  => para sistemas maiores utilizar a biblioteca uuid
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

//validar imagem e definir onde a imagem vai ser salva
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