import { Router } from "express";
import {
  createArtwork,
  listArtworks,
  artworkDetail, // ✅ Add this!
  deleteArtwork
} from "../controllers/artwork.controller";
import validateRequest from "../middleware/validateRequest";

const router = Router();  

router.get("/", listArtworks);  //shows all the artworks created by each artsist
router.get('/:idOrSlug', artworkDetail); //api/artwork/atworkid


router.post("/", validateRequest, createArtwork); // after the artwork is ceated and sumbitted validation happens and if all good then artwork is cteated and saved in mongoDB
router.delete("/:id", deleteArtwork); 

export default router;
//// server.ts
//app.use("/api/artworks", artworkRouter);
