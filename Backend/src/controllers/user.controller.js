import asyncHandler from "../Helpers/AsyncHandler.js"


export const registerUser = asyncHandler(async (req, res) => {












    res.status(201).json({
        message: "User registered successfully",

    });
});
