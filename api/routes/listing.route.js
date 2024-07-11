import express from 'express'
import { createListing,getUserListing } from '../controllers/listing.controller.js';
import { verifyUsers } from '../utils/verifyUsers.js';

const router = express.Router();

router.post("/create",verifyUsers,createListing)
router.get('/listings/:id',verifyUsers,getUserListing)
export default router
