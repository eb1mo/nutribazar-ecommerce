import User from "./../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserToken from "./../models/usertokenModel.js";

dotenv.config();

//registering a new user
const createUser = async (req, res) =>
{
    try
    {
        const { username, email, password, confirmPassword } = req.body;
        if (!username || !email || !password)
        {
            return res.status(400).json({ message: "All Fields are required" });
        }
        const userExist = await User.findOne({ email });
        if (userExist)
        {
            return res.status(400).json({ message: "User already Exists" });
        }
        if (password !== confirmPassword)
        {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        });

    } catch (error)
    {
        res.status(500).json({ message: error.message });
    }
}
//controller when a user logs in
const loginUser = async (req, res) =>
{
    try
    {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
        {
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

            if (!isPasswordCorrect)
            {
                res.status(200).json({ message: "Invalid Credentials" });
            }
        }
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT, { expiresIn: "1d" });

        const userToken = await UserToken.findOne({ userId: existingUser._id });

        if (userToken)
        {
            userToken.jwt = token;
            await userToken.save();
        } else
        {
            const newUserToken = new UserToken({ userId: existingUser._id, jwt: token });
            await newUserToken.save();
        }
        res.status(200).json({
            token,
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role
        })
    } catch (error)
    {
        res.status(400).json({ message: error.message });
    }
}
const changePassword = async (req, res) =>
{
    try
    {
        const token = req.headers.authorization.split(" ")[1];
        const isTokenExists = await UserToken.findOne({ jwt: token });
        if (!isTokenExists)
        {
            return res.status(401).json({ message: "Access Denied Please Login" });
        }
        const decoded = jwt.verify(token, process.env.JWT);
        const user = await User.findById(decoded.id);
        if (!user)
        {
            return res.status(404).json({ message: "User not found" });
        }
        const { old_password, new_password, confirm_password } = req.body;
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch)
        {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        if (new_password == old_password)
        {
            return res
                .status(400)
                .json({ message: "New password cannot be same as old password" });
        }
        if (new_password !== confirm_password)
        {
            return res.status(400).json({ message: "Password does not match" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (e)
    {
        res.status(400).json({ message: e.message });
    }
};

const getAllUser = async (req, res) =>
{
    try
    {
        const user = await User.find();
        res.json(user);
    } catch (error)
    {
        res.status(400).json({ message: error.message });
    }
}
const updateUser = async (req, res) =>
{
    try
    {
        const token = req.headers.authorization.split(" ")[1];
        const isTokenExists = await UserToken.findOne({ jwt: token });
        if (!isTokenExists)
        {
            return res.status(401).json({ message: "Access Denied please login" });
        }
        const decoded = jwt.verify(token, process.env.JWT);
        const user = await User.findById(decoded.id);
        if (!user)
        {
            return res.status(404).json({ message: "User not found" });
        }
        const { username, email } = req.body;
        user.username = username;
        user.email = email;
        await user.save();
        res.status(200).json({ message: "User updated successfully" });
    } catch (e)
    {
        req.status(400).json({ message: e.message });
    }
}
const logOut = async (req, res) =>
{
    try
    {
        const token = req.headers.authorization.split(" ")[1];
        const isTokenExists = await UserToken.findOne({ jwt: token });
        if (!isTokenExists)
        {
            return res.status(401).json({ message: "Access Denied please login" });
        }
        const decoded = jwt.verify(token, process.env.JWT);
        const user = await UserToken.findOne({ user: decoded.id });
        if (!user)
        {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(user);
        await UserToken.deleteOne({ user: decoded.id });
        res.status(200).json({ message: "Logout successfully" });
    } catch (e)
    {
        res.status(400).json({ message: e.message });
    }
}
export { createUser, loginUser, updateUser, logOut, changePassword, getAllUser };