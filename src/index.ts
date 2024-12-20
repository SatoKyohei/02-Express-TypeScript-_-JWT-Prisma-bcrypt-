import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
    AuthenticatedRequest,
    authenticateToken,
} from "./middleware/authenticate";

// .envを読み込む
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// 空のセットを定義（重複を許さない配列のようなもの）
export const tokenBlacklist: Set<string> = new Set();

// リクエストボディに含まれるJSONデータを解析
app.use(express.json());

app.post("/register", async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    } catch (error) {
        res.status(400).json({ message: "User registration failed" });
    }
});

app.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // 真偽値
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid password" });
            return;
        }
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
            expiresIn: "1h",
        });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

// 2つ目の引数にミドルウェアを指定することで、リクエストが/profileに届く前にそのリクエストにミドルウェアを実行できる。また、カンマ区切りで複数ミドルウェアを指定できる。
app.get(
    "/profile",
    authenticateToken,
    async (req: AuthenticatedRequest, res: Response) => {
        if (!req.user) {
            res.status(403).json({ error: "Invalid token" });
            return;
        }
        // このuserはauthenticateToken.tsで追加したもの
        const userId = req.user.userId;

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: "User not found" });
                return;
            }
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve user profile" });
        }
    }
);

app.post("/logout", authenticateToken, (req: Request, res: Response) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (token) {
        tokenBlacklist.add(token);
        res.status(200).json({ message: "Logged out successfully" });
        return;
    }
    res.status(400).json({ error: "Token is required for logout" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
