import express from 'exrpress'
import { createListing } from '../controllers/listing.controller.js';
import { verifyUsers } from '../utils/verifyUsers.js';

const router = express.Router();

router.post("/create",verifyUsers,createListing)

export default router
