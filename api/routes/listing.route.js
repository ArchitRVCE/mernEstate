import express from 'express'
import { createListing,getUserListing,deleteListing } from '../controllers/listing.controller.js';
import { verifyUsers } from '../utils/verifyUsers.js';

const router = express.Router();

router.post("/create",verifyUsers,createListing)
router.get('/listings/:id',verifyUsers,getUserListing)
router.delete('/delete/:id',verifyUsers,deleteListing)
export default router
