import { prisma } from "../config/db.js"; 
import bcrypt from "bcryptjs";

const register = async (req, res) => {
    const {name, email, password} = req.body;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({ where: { email } });

    if(userExists){
        return res.status(400).json({message: "User already exists with this email"});
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new User
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        },
    });
}

// Login User

    const login = async (req, res) => {
        const { email, password } = req.body;

        //check if your exists
        const user = await prisma.user.findUnique({ where: { email } });

        if(!user){
            return res.status(401).json({message: "Invalid email or password"});
        }

        //check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid email or password"});
        }

        res.status(200).json({
            status: "success",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                }
            },
        });
    }

export {register, login};