const { User, Profile, Car, Transaction } = require("../models/index")
const { Op } = require('sequelize')
const bcrypt = require("bcryptjs")
const currency = require("../helpers/currency")

class User_Controller {
    static async renderLanding(req, res){
        try {
            res.render("home.ejs")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async renderLogin(req, res) {
        try {
            const { error } = req.query
            // console.log(error);
            res.render("login.ejs", { error })
        } catch (error) {
            console.log(error);
            res.send(error)
        }

    }

    static async handleLogin(req, res) {
        try {
            const { email, password } = req.body
            // console.log(email, password);
            const isEmailValid = await User.findOne({ where: { email } })
            if (isEmailValid && bcrypt.compareSync(password, isEmailValid.password)) {
                // console.log(req.session.userId = isEmailValid.id);
                req.session.userId = isEmailValid.id
                return res.redirect("/home")
            } else {
                const error = "Invalid Username/Password"
                return res.redirect(`/login?error=${error}`)
            }
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async handleLogout(req, res) {
        try {
            req.session.destroy();
            res.redirect('/login');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    static async renderRegister(req, res) {
        try {
            const gender = ["Male", "Female"]
            // const role = ["Seller", "Buyer"]
            res.render("register.ejs", { gender })
        } catch (error) {
            console.log(error);
            res.send(error)
        }

    }

    static async handleRegister(req, res) {
        try {
            // res.send("ini handle register")
            let { fullName, gender, address, phoneNumber, email, password } = req.body
            const newUser = await User.create({
                email,
                password,
                role: "Buyer",
                createdDate: new Date(),
                updatedDate: new Date()
            })
            const UserId = newUser.id
            const newProfile = await Profile.create({
                fullName,
                gender,
                UserId,
                address,
                phoneNumber,
            })
            req.session.userId = UserId;
            // console.log(newProfile)
            res.redirect("/login")
        } catch (error) {
            console.log(error);
            res.send(error)
        }

    }

    static async renderHome(req, res) {
        try {
            // res.send("ini home")

            let carList = await Car.findAll({
                where: {
                    status: false
                }
            })
            res.render("CarList.ejs", { carList, currency })
        } catch (error) {
            console.log(error);
            res.send(error)
        }

    }

    static async handleBuy(req, res) {
        try {
            const id = req.session.userId
            console.log(id);
            // const {carId} = req.body
            let Prof = await Profile.findOne({
                where: {
                    UserId: id
                }
            })
            // console.log(Prof);
            // res.send(Prof)
            let { carId } = req.body
            const newTransaction = await Transaction.create({
                UserId: id,
                recipient: `${Prof.fullName},${Prof.phoneNumber}`,
                address: Prof.address,
                CarId: carId,
                createdDate: new Date(),
                updatedDate: new Date()
            })

            const buyCar = await Car.update({
                status: true
            }, {
                where: {
                    id: carId
                }
            }
            )
            res.redirect("/home")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }


    static async showTransaction(req, res) {
        let data = await Transaction.findAll({})
        res.send(data)
    }
}


module.exports = User_Controller