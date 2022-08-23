const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

// Gerar token
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d"
    });
};

// Registrar e logar usuario
const register = async (req, res) => {
    const { name, email, password } = req.body
    // checa se o usuario existe
    const user = await User.findOne({ email })

    if (user) {
        res.status(422).json({ errors: ["Email ja cadastrado. Por favor utilize outro e-mail"] })
        return
    }

    // gerar a hash da senha
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    //cria usuario
    const newUser = await User.create({
        name, email, password: passwordHash
    })

    //checa se o usuario foi criado com sucesso, retorna o token
    if (!newUser) {
        res.status(422).json({ errors: ["Houve um erro, por favor tente novamente mais tarde!"] })
    }
    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    });
};

// login 
const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    // checa se o usuario existe
    if (!user) {
        res.status(404).json({ errors: ["Usuario não encontrado."] })
        return;
    }

    // checa se a senha que o usuario mandou é a mesma cadastrada no banco 
    if (!(await bcrypt.compare(password, user.password))) {
        res.status(422).json({ errors: ["Senha incorreta!"] })
        return;
    }

    // retorna o usuario com o token
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
    });
}

// pega o usuario logado
const getCurrentUser = async (req, res) => {
    const user = req.user;
    res.status(200).json(user);
}

// atualiza um usuario
const update = async (req, res) => {
    const { name, password, bio } = req.body;
    let profileImage = null;

    if (req.file) {
        profileImage = req.file.filename;
    }
    const reqUser = req.user;
    const user = await User.findById(mongoose.Types.ObjectId(reqUser._id)).select("-password");

    if (name) {
        user.name = name;
    }

    if (password) {
        // gerar a hash da senha
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        user.password = passwordHash;
    }

    if (profileImage) {
        user.profileImage = profileImage;
    }

    if (bio) {
        user.bio = bio;
    }

    await user.save();
    res.status(200).json(user);
}

//pega o usuario por id 
const getUserById = async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.findById(mongoose.Types.ObjectId(id)).select("-password")
        //checa se usuario existe
        if (!user) {
            res.status(404).json({ errors: ["Usuario não encontrado"] })
            return
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ errors: ["Usuario não encontrado"] })
        return
    }


}

module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
};