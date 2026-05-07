import { Request, Response, NextFunction } from "express";

/**
 * Simple validator for POST /api/artworks
 * - name: required, 2..120 chars
 * - description: optional, max 2000 chars
 */
export default function validateRequest(req: Request, res: Response, next: NextFunction) {
  let { name, description, orientation ,mainImageUrl, supportingImageUrls } = req.body || {};  //eg {name="kanal",description="nice work"} what tahts does it name = "kamal" and description="nocee work"

  if (typeof mainImageUrl != "string" || mainImageUrl.trim()===""){
    return res.status(400).json({error: "Main image is required" })
  }

  if (!Array.isArray(supportingImageUrls)) supportingImageUrls = [];
  if (supportingImageUrls.length > 4) {
    return res.status(400).json({ error: "You can upload up to 4 supporting images." });
  }
  for (const url of supportingImageUrls) {
    if (typeof url !== "string" || url.trim() === "") {
      return res.status(400).json({ error: "Invalid supporting image URL." });
    }
  }

  // ensure name exists and is a string
  if (typeof name !== "string") {
    return res.status(400).json({ error: "The 'name' field is required." }); //if name is not a string error 400 - "The 'name' field is required
  }

  // trim and reassign so the controller receives the cleaned value
  name = name.trim();

  if (name.length < 2) {  // condition to check the lenght if lenght invalid again 400 error
    return res.status(400).json({ error: "Name must be at least 2 characters." });
  }
  if (name.length > 120) {
    return res.status(400).json({ error: "Name must be 120 characters or fewer." });
  }

  // description is optional, but if present it must be a string and <= 2000
  if (description !== undefined) {  //of descpriton there then check 
    if (typeof description !== "string") {
      return res.status(400).json({ error: "Description must be text." });
    }
    if (description.length > 2000) {
      return res.status(400).json({ error: "Description must be 2000 characters or fewer." });
    }
  }
// orientation
const allowed = ["landscape", "portrait"]; // <-- lower-case
if (orientation == null || String(orientation).trim() === "") {
  orientation = "Landscape";
} else {
  const normalized = String(orientation).trim().toLowerCase();
  if (!allowed.includes(normalized)) {
    return res.status(400).json({ error: "Orientation must be 'Landscape' or 'Portrait'." });
  }
  // store in Title Case for consistency
  orientation = normalized === "landscape" ? "Landscape" : "Portrait";
}

// You are replacing the original user input with a cleaned + validated version before passing it to the controller.  
  req.body.name = name;
req.body.description = description;
req.body.orientation = orientation;
req.body.mainImageUrl = mainImageUrl;
req.body.supportingImageUrls = supportingImageUrls;
// leave other fields (originalArt, frameOptions, prints, framesAvailable) intact




  next(); // all good → move to the controller
}
