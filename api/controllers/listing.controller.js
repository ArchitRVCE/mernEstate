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

export const deleteListing = async(req,res,next)=>{
    const myListing = await Listing.findById(req.params.id);
    if(!myListing)
        return next(errorHandler(404,'No listing found'));
    if(req.user.id !== myListing.userRef)
        return next(errorHandler(401,'You can delete only your listing'))
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted!');
    } catch (error) {
        next(error);
    }
}

export const updateListing = async(req,res,next)=>{
    try {
        const myListing = await Listing.findById(req.params.id);
        if(!myListing) return next(errorHandler(404,'Listing not found'));
        if(req.user.id !== myListing.userRef) return next(errorHandler(401,'You can delete only your listing'));
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(updatedListing);

    } catch (error) {
        next(error);
    }
}

//called in Listing page
export const getListing = async(req,res,next) =>{
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing) return next(errorHandler(404,'Listing not found'))
        res.status(200).json(listing);
    } catch (error) {
        next(error)
    }
}

//called to return searched listing
export const getListings = async (req,res,next)=>{
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
        if(offer === undefined || offer === 'false'){
            offer = {$in: [false,true]};
        }
        let furnished = req.query.furnished
        if(furnished === undefined || furnished === 'false'){
            furnished = {$in: [true,false]};
        }
        let parking = req.query.parking
        if(parking === undefined || parking === 'false'){
            parking = {$in: [true,false]};
        }
        let type = req.query.type;
        if(type === undefined || type==='all'){
            type = {$in:['sale','rent']};
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';
        const listings = await Listing.find({
            name: {$regex:searchTerm, $options:'i'},offer,furnished,parking,type
        }).sort({
            [sort]: order
        }).limit(limit).skip(startIndex);

        res.status(200).json(listings)
    } catch (error) {
        next(error);
    }
}