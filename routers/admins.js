const express = require("express")
const AdmCont = require("../controllers/Admin_Controller")
const router = express.Router()

router.get('/', AdmCont.renderAdminLogin)
router.post("/", AdmCont.handleAdminLogin)
router.use(function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/admin');
    }
    next();
})
router.get("/add", AdmCont.renderAddCars)
router.post("/add", AdmCont.handleAddCars)
router.get('/list', AdmCont.renderListCar)
router.get("/:carId/edit", AdmCont.renderUpdateCars)
router.post("/:carId/edit", AdmCont.handleUpdateCars)
router.get('/:carId/delete', AdmCont.handleDeleteCars)
router.get("/logout", AdmCont.handleLogout)


module.exports = router