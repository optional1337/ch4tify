import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        samesite: "none",
        maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return token;
}