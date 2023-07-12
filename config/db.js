const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Definir a opção strictQuery como false
mongoose.set('strictQuery', false);

// Conexão
const conn = async () => {
    try {
        const dbConn = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.dumxt0n.mongodb.net/?retryWrites=true&w=majority`
        );

        console.log("Conectou ao banco");
        return dbConn;
    } catch (error) {
        console.log(error);
    }
}

conn();
module.exports = conn;