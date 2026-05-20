// src/services/artworkDetail.ts
import Artwork from "../models/artwork.model";
import mongoose from "mongoose";

export async function artworkDetailsService(idOrSlug: string) {
  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);   //You’re searching for a document using a unique identifier (ID) or a readable identifier (slug)

  const query = isObjectId
    ? { _id: idOrSlug }
    : { slug: idOrSlug }; // Depending on the input (by URL):  
                // If it's an ID → search by _id
                // If not → search by slug

  return await Artwork.findOne(query)  //Looks for one matching document in your Artwork collection
    .select({
      _id: 1,
      name: 1,
      description: 1,
      category: 1,
      orientation: 1,
      mainImageUrl: 1,
      supportingImageUrls: 1,
      originalArt: 1,
      frameOptions: 1,
      prints: 1,
      framesAvailable: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .lean()
    .exec();
}
//the function retrun JSON file with all details of the artwork like name, description, orientation, mainImageUrl, supportingImageUrls, originalArt, frameOptions, prints, framesAvailable, createdAt and updatedAt


