import User from "../models/userModel.js";
import jwt from "jsonwebtoken";


const checkAdminModels = async (req, res, next) =>
{
    try
    {
        const token = req.headers.authorization.split(" ")[1];
        if (!token)
        {
            return res.status(401).json({ message: "Please Login" });
        }
        const decoded = jwt.verify(token, process.env.JWT);

        const user = await User.findById(decoded.id);

        if (!user)
        {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role == "admin")
        {
            next();
        } else
        {
            res.status(401).json({ message: "You are not Admin" });
        }
    } catch (e)
    {
        res.status(400).json({ message: e.message });
    }
};

export { checkAdminModels };