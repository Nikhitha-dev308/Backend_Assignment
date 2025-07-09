import express, { Router } from 'express';

import { getUserDetails, getAllUsers, deleteUser, getSingleUser, updateUser } from '../controllers/userController'
const router: any = express.Router();

router.post('/details', getUserDetails);
router.get('/details', getAllUsers);
router.delete("/delete/:id", deleteUser);
router.post("/details/:id", getSingleUser); // to fetch details
router.put("/update/:id", updateUser);       // to update details

export default router;
