const express = require("express")
const app = express()
const port = 3000
const router = require("./routers/index")

const Controller = require("./controllers/User_Controllers")
const AdmCont = require("./controllers/Admin_Controller")

app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.static('images'))
app.use(router)



app.listen(port, () => {
    console.log("Running on", port);
})