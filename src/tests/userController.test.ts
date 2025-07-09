import { Request, Response } from "express";
import User from "../models/User";
import { deleteUser, getAllUsers, getSingleUser, getUserDetails, updateUser } from "../controllers/userController";

jest.mock("../models/User");

const MockedUser = User as jest.Mocked<typeof User>; // 👈 Important

describe("User Controller Tests", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        req = { body: {} };
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({
            json: jsonMock,
            send: jsonMock, // 👈 Add this to fix `.send()` call
        });

        res = {
            status: statusMock,
        };
    });


    // ----------- getAllUsers --------------
    describe("getAllUsers", () => {
        it("should return users with status 200", async () => {
            const mockUsers = [
                { _id: "1", name: "Alice", email: "alice@example.com" },
                { _id: "2", name: "Bob", email: "bob@example.com" },
            ];

            MockedUser.find.mockResolvedValue(mockUsers); // ✅ Casted mock

            await getAllUsers(req as Request, res as Response);

            expect(MockedUser.find).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockUsers);
        });

        it("should return 500 on DB error", async () => {
            const mockError = new Error("DB failure");
            MockedUser.find.mockRejectedValue(mockError);

            await getAllUsers(req as Request, res as Response);

            expect(MockedUser.find).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                status: 0,
                message: "Failed to fetch users",
                error: mockError,
            });
        });
    });
});





// -----------------get user details---------------------
jest.mock("../models/User");

describe("getUserDetails Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let sendMock: jest.Mock;

    beforeEach(() => {
        sendMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ send: sendMock });

        req = {
            body: {},
        };

        res = {
            status: statusMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if fields are missing", async () => {
        req.body = { email: "test@example.com" }; // name, profession, status missing

        await getUserDetails(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(sendMock).toHaveBeenCalledWith({
            status: 3,
            message: "All fields are required",
            error: "Validation Error",
            data: "",
        });
    });

    it("should create user and return all users", async () => {
        const mockUserData = {
            name: "Alice",
            email: "alice@example.com",
            profession: "Engineer",
            status: "Active",
        };

        const mockUserInstance = {
            save: jest.fn().mockResolvedValue(mockUserData),
        };

        req.body = mockUserData;

        (User as any).mockImplementation(() => mockUserInstance);
        (User.find as jest.Mock).mockResolvedValue([mockUserData]);

        await getUserDetails(req as Request, res as Response);

        expect(User).toHaveBeenCalledWith(mockUserData);
        expect(mockUserInstance.save).toHaveBeenCalled();
        expect(User.find).toHaveBeenCalled();
        expect(statusMock).toHaveBeenCalledWith(201);
        expect(sendMock).toHaveBeenCalledWith({
            status: 1,
            message: "User added successfully",
            error: null,
            data: [mockUserData],
        });
    });

    it("should return 409 for duplicate email", async () => {
        const mockUserData = {
            name: "Bob",
            email: "bob@example.com",
            profession: "Developer",
            status: "Active",
        };

        req.body = mockUserData;

        const mockUserInstance = {
            save: jest.fn().mockRejectedValue({ code: 11000, message: "Duplicate email" }),
        };

        (User as any).mockImplementation(() => mockUserInstance);

        await getUserDetails(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(409);
        expect(sendMock).toHaveBeenCalledWith({
            status: 0,
            message: "Email already exists",
            error: "Duplicate email",
            data: "",
        });
    });

    it("should return 500 for general errors", async () => {
        const mockUserData = {
            name: "Eve",
            email: "eve@example.com",
            profession: "Analyst",
            status: "Pending",
        };

        req.body = mockUserData;

        const mockUserInstance = {
            save: jest.fn().mockRejectedValue({ message: "Database down" }),
        };

        (User as any).mockImplementation(() => mockUserInstance);

        await getUserDetails(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(sendMock).toHaveBeenCalledWith({
            status: 0,
            message: "Something went wrong",
            error: "Database down",
            data: "",
        });
    });
});






// ------------------delete users---------------
describe("deleteUser Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        req = {
            params: { id: "123" },
        };

        res = {
            status: statusMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should delete user and return 200", async () => {
        (User.findByIdAndDelete as jest.Mock).mockResolvedValue({
            _id: "123",
            name: "John",
        });

        await deleteUser(req as Request, res as Response);

        expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "User deleted successfully",
        });
    });

    it("should return 404 if user not found", async () => {
        (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        await deleteUser(req as Request, res as Response);

        expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "User not found",
        });
    });

    it("should return 500 on DB error", async () => {
        const mockError = new Error("Database error");
        (User.findByIdAndDelete as jest.Mock).mockRejectedValue(mockError);

        await deleteUser(req as Request, res as Response);

        expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "Error deleting user",
            error: mockError,
        });
    });
});





//--------------------getSingleUser----------------
describe("getSingleUser Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = { params: { id: "123" } };
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        res = {
            status: statusMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return user and 200 if found", async () => {
        const mockUser = { _id: "123", name: "Test User" };
        (User.findById as jest.Mock).mockResolvedValue(mockUser);

        await getSingleUser(req as Request, res as Response);

        expect(User.findById).toHaveBeenCalledWith("123");
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user not found", async () => {
        (User.findById as jest.Mock).mockResolvedValue(null);

        await getSingleUser(req as Request, res as Response);

        expect(User.findById).toHaveBeenCalledWith("123");
        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 500 on error", async () => {
        const mockError = new Error("DB error");
        (User.findById as jest.Mock).mockRejectedValue(mockError);

        await getSingleUser(req as Request, res as Response);

        expect(User.findById).toHaveBeenCalledWith("123");
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "Fetch failed",
            error: mockError,
        });
    });
});






//------------------updated user---------------------
describe("updateUser Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        req = {
            params: { id: "123" },
            body: {
                name: "Updated Name",
                email: "updated@example.com"
            }
        };

        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        res = {
            status: statusMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should update user and return 200", async () => {
        const updatedUser = {
            _id: "123",
            name: "Updated Name",
            email: "updated@example.com"
        };

        (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

        await updateUser(req as Request, res as Response);

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith("123", req.body, { new: true });
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "User updated successfully",
            data: updatedUser,
        });
    });

    it("should return 500 on DB error", async () => {
        const error = new Error("DB error");
        (User.findByIdAndUpdate as jest.Mock).mockRejectedValue(error);

        await updateUser(req as Request, res as Response);

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith("123", req.body, { new: true });
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            message: "Update failed",
            error,
        });
    });
});

