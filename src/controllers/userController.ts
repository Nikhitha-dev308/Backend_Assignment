import User from "../models/User";

export const getUserDetails = async (req: any, res: any) => {
    const { name, email, profession, status } = req.body;

    if (!name || !email || !profession || !status) {
        return res.status(400).send({
            status: 3,
            message: "All fields are required",
            error: "Validation Error",
            data: ""
        });
    }

    try {
        const newUser = new User({ name, email, profession, status });
        await newUser.save();
        // After saving, fetching all the users
        const users = await User.find();

        return res.status(201).send({
            status: 1,
            message: "User added successfully",
            error: null,
            data: users
        });

    } catch (error: any) {
        // Duplicate email error
        if (error.code === 11000) {
            return res.status(409).send({
                status: 0,
                message: "Email already exists",
                error: error.message,
                data: ""
            });
        }

        return res.status(500).send({
            status: 0,
            message: "Something went wrong",
            error: error.message,
            data: ""
        });
    }
};



export const getAllUsers = async (req: any, res: any) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({
            status: 0,
            message: 'Failed to fetch users',
            error
        });
    }
};


export const deleteUser = async (req: any, res: any) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};


export const getSingleUser = async (req: any, res: any) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user){ 
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Fetch failed", error: err });
    }
};

export const updateUser = async (req: any, res: any) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "User updated successfully", data: updated });
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err });
    }
};

