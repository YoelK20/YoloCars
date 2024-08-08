const { User, Profile, Car, Transaction } = require("../models/index")
const { Op } = require('sequelize')
const bcrypt = require("bcryptjs")
const currency = require("../helpers/currency")

class Admin_Controller {
    static async renderAdminLogin(req, res) {
        try {
            const {error} = req.query
            // console.log(error);
            res.render("admin_Login.ejs", {error})
        } catch (error) {
            console.log(error);
            res.send(error)
        }

    }

    static async handleAdminLogin(req, res) {
        try {
            const { email, password } = req.body
            // console.log(email, password);
            const isEmailValid = await User.findOne({ where: { email } })
            if (isEmailValid && bcrypt.compareSync(password, isEmailValid.password)) {
                // console.log(req.session.userId = isEmailValid.id);
                if(isEmailValid.role === "Seller"){
                    req.session.userId = isEmailValid.id
                    return res.redirect("/admin/add")
                }else {
                    const error = "Please Login as Admin"
                return res.redirect(`/admin?error=${error}`)
                }
            } else {
                const error = "Invalid Username/Password"
                return res.redirect(`/admin?error=${error}`)
            }
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async handleLogout(req, res) {
        try {
            req.session.destroy();
            res.redirect('/admin');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    // static async renderAdminRegister(req, res) {
    //     try {
    //         const gender = ["Male", "Female"]
    //         const role = ["Seller", "Buyer"]
    //         res.render("register.ejs", { gender, role })
    //     } catch (error) {
    //         console.log(error);
    //         res.send(error)
    //     }

    // }

    // static async handleAdminRegister(req, res) {
    //     try {
    //         // res.send("ini handle register")
    //         let { fullName, gender, address, phoneNumber, email, password } = req.body
    //         const newUser = await User.create({
    //             email,
    //             password,
    //             role: "Seller",
    //             createdDate: new Date(),
    //             updatedDate: new Date()
    //         })
    //         const UserId = newUser.id
    //         const newProfile = await Profile.create({
    //             fullName,
    //             gender,
    //             UserId,
    //             address,
    //             phoneNumber,
    //         })
    //         // console.log(newProfile)
    //         res.redirect("/login")
    //     } catch (error) {
    //         console.log(error);
    //         res.send(error)
    //     }

    // }
    static async renderListCar(req,res){
        try {
            const carList = await Car.findAll()
            // console.log(carList);
            res.render("adminCarList.ejs", {carList, currency})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async renderAddCars(req, res) {
        try {
            // console.log("Cars") 
            // res.send("cars")
            res.render("addCars.ejs")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async handleAddCars(req, res) {
        try {
            const {brand, model, released_date, imageUrl, color, price} = req.body
            const addCars = await Car.create({
                brand,
                model,
                released_date,
                imageUrl,
                color,
                createdAt: new Date(),
                updatedAat: new Date(),
                price,
            })
            res.redirect("/admin/list")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async renderUpdateCars(req, res) {
        try {
            const id = req.params.carId
            const data = await Car.findByPk(id)
            res.render("editCars.ejs", {data} )
            // res.send(data)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async handleUpdateCars(req, res) {
        try {
        const id = req.params.carId
        const {brand, model, released_date, imageUrl, color, price, status} = req.body
        await Car.update({
                brand,
                model,
                released_date,
                imageUrl,
                color,
                price,
                status
            }, {
                where: {
                    id
                }
            }
        ) 
        res.redirect("/admin/list")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async handleDeleteCars(req, res) {
        try {
            const id = req.params.carId
            await Car.destroy({
                where: {
                    id
                }
            })
        res.redirect("/admin/list")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

}


module.exports = Admin_Controller