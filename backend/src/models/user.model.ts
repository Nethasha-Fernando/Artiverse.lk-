import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import { slugify } from "../utils/slugify";

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  tiktok?: string;
  youtube?: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactNumber: string;
  role: "user" | "artist" | "admin";
  receiveEmails: boolean;
  username?: string;
  slug?: string;
  profileImage: string;
  backgroundImage: string;
  country: string;
  district: string;
  address: string;
  postalCode: string;
  artCategories: string[];
  aboutArtist: string;
  socialLinks: ISocialLinks;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  comparePassword(plain: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const socialLinksSchema = new mongoose.Schema<ISocialLinks>(
  {
    facebook:  { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin:  { type: String, default: "" },
    twitter:   { type: String, default: "" },
    website:   { type: String, default: "" },
    tiktok:    { type: String, default: "" },
    youtube:   { type: String, default: "" },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName:     { type: String, required: true, trim: true, maxlength: 50 },
    lastName:      { type: String, required: true, trim: true, maxlength: 50 },
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:      { type: String, required: true, minlength: 6, select: false },
    contactNumber: { type: String, trim: true, default: "" },
    role:          { type: String, enum: ["user", "artist", "admin"], default: "user" },
    receiveEmails: { type: Boolean, default: false },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      unique: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      unique: true,
    },
    profileImage:    { type: String, default: "" },
    backgroundImage: { type: String, default: "" },
    country:         { type: String, trim: true, default: "" },
    district:        { type: String, trim: true, default: "" },
    address:         { type: String, trim: true, default: "" },
    postalCode:      { type: String, trim: true, default: "" },
    artCategories: {
      type: [String],
      default: [],
    },
    aboutArtist: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    followersCount: { type: Number, default: 0, min: 0 },
    followingCount: { type: Number, default: 0, min: 0 },
    isVerified:     { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.role === "artist" && !this.slug) {
    let base = slugify(this.firstName, this.lastName);
    let candidate = base;
    let n = 1;
    const UserModel = this.constructor as mongoose.Model<IUser>;
    while (await UserModel.findOne({ slug: candidate, _id: { $ne: this._id } })) {
      candidate = `${base}-${n++}`;
    }
    this.slug = candidate;
  }

  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (plain: string) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
