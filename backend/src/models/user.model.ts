import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  firstName:     string;
  lastName:      string;
  email:         string;
  password:      string;
  contactNumber: string;
  role:          "user" | "artist";
  receiveEmails: boolean;
  comparePassword(plain: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName:     { type: String, required: true, trim: true, maxlength: 50 },
    lastName:      { type: String, required: true, trim: true, maxlength: 50 },
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:      { type: String, required: true, minlength: 6, select: false },
    contactNumber: { type: String, trim: true },
    role:          { type: String, enum: ["user", "artist"], default: "user" },
    receiveEmails: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (plain: string) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model<IUser>("User", userSchema);