const express = require("express");
const router = express();

//rota de registro e login 
router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotoRoutes"));

//rota de teste
router.get("/", (req, res) => {
    res.send("API funcionando!");
})

module.exports = router