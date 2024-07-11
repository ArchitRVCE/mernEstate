import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createListing = async(req,res,next) =>{
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const getUserListing = async(req,res,next) =>{
    try {
        if(req.user.id !== req.params.id) return next(errorHandler(403,'You can access your listings only'));
        const data = await Listing.find({userRef:req.params.id});
        res.status(200).json(data);
    } catch (error) {
        next(error)
    }
}