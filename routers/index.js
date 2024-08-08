const express = require("express")
const Controller = require("../controllers/User_Controllers")
const router = express.Router()
const adminRouter = require("./admins")

const session = require('express-session');
router.use(session({
    secret: 'Dylan_Bgst',
    resave: false,
    saveUninitialized: false,
    cookie: ({secure:false,
        sameSite: true
    })
}))
router.use('/admin', adminRouter)

router.get("/", Controller.renderLanding)
router.get("/login", Controller.renderLogin)   
router.post("/login", Controller.handleLogin)
router.get("/register", Controller.renderRegister)
router.post("/register", Controller.handleRegister)

router.use(function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
})

router.get("/home", Controller.renderHome)
router.post('/buy', Controller.handleBuy)
router.get("/transaction", Controller.showTransaction)
router.get("/destroy", Controller.handleLogout)

module.exports = router