import { userModel } from "../models/user.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import bcrypt from 'bcrypt';
import authService from '../services/authService.js';
import { emailRegexp } from '../config/constants.js';
import nodemailer from 'nodemailer';
import { config } from "dotenv";

export default function userController() {
    const login = asyncHandler(async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password || email === "" || password === "") {
            const error = new Error("email and password are required");
            error.statusCode = 400;
            return next(error);
        }

        if (!emailRegexp.test(email)) {
            const error = new Error("invalid email format");
            error.statusCode = 400;
            return next(error);
        }

        const user = await userModel.findOne({ email: email }).exec();
        if (!user) {
            const error = new Error("user not found");
            error.statusCode = 404;
            return next(error);
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            const error = new Error("password not correct");
            error.statusCode = 400;
            return next(error);
        }

        const token = authService().createToken(user);

        res.status(200).json({
            idToken: token,
        });
    });

    const createUser = asyncHandler(async (req, res, next) => {
        const { name, email, password, contactNumber } = req.body;
        if (!name || !email || !password || name === "" || email === "" || password === "") {
            const error = new Error("name, email, and password are required");
            error.statusCode = 400;
            return next(error);
        }

        if (!emailRegexp.test(email)) {
            const error = new Error("invalid email format");
            error.statusCode = 400;
            return next(error);
        }

        const user = await userModel.findOne({ email: email }).exec();
        if (user) {
            const error = new Error("email already exists");
            error.statusCode = 400;
            return next(error);
        }

        bcrypt.hash(password, 10, function (err, hash) {
            let user = {
                email: email,
                name: name,
            };
            user = new userModel({ ...user, password: hash });

            userModel.create(user).then(() => {
                res.status(200).json({
                    data: "user created",
                });
            }).catch((err) => {
                res.status(500).json({
                    data: err,
                });
            })
        });
    });

    const updateUser = asyncHandler(async (req, res, next) => {
        if (req.context.userId != req.params.id) {
            const error = new Error('you are forbidden');
            error.statusCode = 403;
            return next(error);
        }

        const { name } = new userModel(req.body);

        const user = await userModel.findById(req.context.userId).exec();

        if (name && name !== "")
            user.name = name;

        const userUpdated = await userModel.replaceOne({ _id: user._id }, user);
        if (!userUpdated) {
            const error = new Error('error updating user');
            error.statusCode = 500;
            return next(error);
        };

        res.status(200).json({
            success: true,
            data: "name updated",
        });
    });

    const getUser = asyncHandler(async (req, res, next) => {
        const user = await userModel.findById(req.context.userId).exec();
        if (!user) {
            const error = new Error('user not found');
            error.statusCode = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                contactNumber: user.contactNumber
            },
        });
    });

    const deleteUser = asyncHandler(async (req, res, next) => {
        const user = await userModel.deleteOne({ _id: req.params.id }).exec();
        if (!user) {
            const error = new Error('error while deactivating');
            error.statusCode = 500;
            return next(error);
        }

        res.status(200).json({
            success: true,
            data: "deactivated",
        });
    });

    const sendEmail = asyncHandler(async (req, res, next) => {
        const { subject, text } = req.body;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.senderEmail,
                pass: config.sender
            }
        });

        var mailOptions = {
            from: 'kritika.sharma_cs19@gla.ac.n',
            to: 'shresthasantosh799@gmail.com',
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log("error>>>", err)
                const error = new Error('error while sending email');
                error.statusCode = 500;
                return next(error);
            }

            res.status(200).json({
                success: true,
                data: "email sent",
            });
        });
    });

    return {
        login,
        createUser,
        updateUser,
        getUser,
        deleteUser,
        sendEmail
    };
}
