import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema(
  {
    // ── ADD THIS at the top ──────────────────────────────
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",     // links to your User model
      required: true,  // every artwork must belong to an artist
    },
    // ---------- Basics ----------
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    orientation: {
    type: String,
    enum: ["Landscape", "Portrait", "Square"],
  },

    // ---------- Images ----------
    mainImageUrl: { type: String, required: true },
    supportingImageUrls: {
      type: [String],
      default: [],
    },

    // ---------- Original Art ----------
    originalArt: {
      surfaceMaterial: { type: String, trim: true, required: true },
      widthCm: { type: Number, min: 1, required: true },
      heightCm: { type: Number, min: 1, required: true },
      priceLkr: { type: Number, min: 0, required: true },
      isFramed: { type: Boolean, required: true },
      frameDetails: { type: String, trim: true }, // optional, but required if isFramed and no frameOptions
    },

    // ---------- Frame Options (for ORIGINAL art when framed) ----------
    frameOptions: {
      type: [
        {
          material: { type: String, required: true, trim: true }, // wood / metal
          color: { type: String, trim: true },
          widthCm: { type: Number, min: 0 },
          extraPriceLkr: { type: Number, min: 0 },
        },
      ],
      default: [],
    },

    // ---------- Prints (variants) ----------
    prints: [
  {
    surfaceMaterial: {
      type: String,
      required: true,
    },

    sizes: [
      {
        width: {
          type: Number,
          required: true,
        },

        height: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
],

    // ---------- Frames Available (for PRINTS) ----------
    // When the user clicks “Add more frames”, they can attach offerings:
    // surface -> sizes -> frame price. This whole thing is optional.
    framesAvailable: {
      type: [
        {
          frameMaterial: { type: String, trim: true, required: true },
          color: { type: String, trim: true },
          widthCm: { type: Number, min: 0 },

          // optional detailed offerings
          offerings: {
            type: [
              {
                surfaceMaterial: { type: String, trim: true, required: true }, // Canvas, Paper, etc.
                sizes: {
                  type: [
                    {
                      widthCm: { type: Number, min: 1, required: true },
                      heightCm: { type: Number, min: 1, required: true },
                      framePriceLkr: { type: Number, min: 0, required: true },
                    },
                  ],
                  default: [],
                },
              },
            ],
            default: [],
          },
        },
      ],
      default: [],
    },
  }, {
  timestamps: true,
});


export default mongoose.model("Artwork", artworkSchema);
