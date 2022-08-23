const Photo = require("../models/Photo");
const User = require("../models/User")

const mongoose = require("mongoose");

//inserir uma foto com um usuario relacionado a ela
const insertPhoto = async (req, res) => {

    const { title } = req.body
    const image = req.file.filename

    const reqUser = req.user

    const user = await User.findById(reqUser._id);

    //criando a foto
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    })

    //verifica se a foto foi criada com sucesso e retorna os dados
    if (!newPhoto) {
        res.status(422).json({
            errors: ["Houve um problema, por favor tente novamente mais tarde"]
        });
        return;
    }

    res.status(201).json(newPhoto)
};

//remove a foto do banco de dados
const deletePhoto = async (req, res) => {
    const { id } = req.params
    const reqUser = req.user
    try {

        const photo = await Photo.findById(mongoose.Types.ObjectId(id))

        //checa se a foto existe
        if (!photo) {
            res.status(404).json({ errors: ["Foto não encontrada!"] });
            return;
        }

        // checa se a foto pertence ao usuario
        if (!photo.userId.equals(reqUser._id)) {
            res.status(422).json({ errors: ["Ocorreu um erro ao tentar excluir a foto. Por favor tente novamente mais tarde!"] })
            return;
        }
        await Photo.findByIdAndDelete(photo._id)
        res.status(200).json({
            id: photo._id,
            message: "Foto excluída com sucesso."
        })

    } catch (error) {
        res.status(404).json({ errors: ["Foto não encontrada!"] });
        return;
    }
};

// pegar todas as fotos

const getAllPhotos = async (req, res) => {
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec()
    res.status(200).json(photos);
}

// pegar fotos de usuario
const getUserPhotos = async (req, res) => {
    const { id } = req.params
    const photos = await Photo.find({ userId: id }).sort([["createdAt", -1]]).exec()
    res.status(200).json(photos);
}

//pegar foto pelo seu id 
const getPhotoById = async (req, res) => {
    const { id } = req.params;
    try {
        const photo = await Photo.findById(mongoose.Types.ObjectId(id));

        //checa se a foto existe
        if (!photo) {
            res.status(404).json({ errors: ["A foto não foi encontrada!"] });
            return;
        }
        res.status(200).json(photo);
    } catch (error) {
        res.status(404).json({ errors: ["A foto não foi encontrada!"] });
        return;
    }
}

// atualizar foto
const updatePhoto = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const reqUser = req.user;
    const photo = await Photo.findById(id);

    //checar se a foto existe
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada"] });
        return;
    }

    //checar se a foto pertence a esse usuario
    if (!photo.userId.equals(reqUser._id)) {
        res.status(422).json({ errors: ["Ocorreu um erro, por favor tente novamente mais tarde."] });
        return;
    }

    if (title) {
        photo.title = title;
    }

    await photo.save()
    res.status(200).json({
        photo,
        message: "Foto atualizada com sucesso!"
    });
}

//Funcionalidade do like
const likePhoto = async (req, res) => {
    const { id } = req.params;
    const reqUser = req.user;
    const photo = await Photo.findById(id);

    //checar se a foto existe
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada"] });
        return;
    }

    // checa se o usuario ja deu like na foto
    if (photo.likes.includes(reqUser._id)) {
        res.status(422).json({ errors: ["Você já curtiu a foto!"] });
        return;
    }

    //coloca o id do usuario no array de likes
    photo.likes.push(reqUser._id);
    photo.save();

    res.status(200).json({
        photoId: id,
        userId: reqUser._id,
        message: "A foto foi curtida!"
    });
}

//Funcionalidade de comentarios
const commentPhoto = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const reqUser = req.user;
    const user = await User.findById(reqUser._id);
    const photo = await Photo.findById(id);

    //checar se a foto existe
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada"] });
        return;
    };

    // adiciona o comentario no array de comentarios da foto
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id
    };
    photo.comments.push(userComment);
    await photo.save();

    res.status(200).json({
        comment: userComment,
        message: "O comentario foi adicionado com sucesso!"
    });
};

// busca de imagens por titulo
const searchPhotos = async (req, res) => {
    const {q} = req.query;
    const photos = await Photo.find({ title: new RegExp(q,"i") }).exec();
    res.status(200).json(photos);

}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
}