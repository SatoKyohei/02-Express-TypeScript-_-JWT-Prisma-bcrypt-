import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { tokenBlacklist } from "../index";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Request型を継承してさらにuserオブジェクトを追加
export interface AuthenticatedRequest extends Request {
    // userは?、つまりオプショナル。undefinedの可能性もありうる
    // 例：user = { userId:123 }
    user?: { userId: number };
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    // 例）"Authorization": "Bearer abc123xyz"を区切って["Bearer","abc123xyz"]
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Access token required" });
        return;
    }

    if (tokenBlacklist.has(token)) {
        res.status(403).json({ error: "Token is no longer valid" });
        return;
    }

    // 署名の検証に成功：errにnullが格納され、userにペイロードが格納される
    // 署名の検証に失敗：errにエラー情報が格納され、userはundefined。
    // jwt.verify：1.このトークンを解読。2. トークンからペイロード部分（{ userId: 123 }）を取り出す。3. このデータを user パラメータ（3つ目の引数）としてコールバック関数に渡す
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            res.status(403).json({ error: "Invalid token" });
            return;
        }
        req.user = user as { userId: number };
        next();
    });
};
