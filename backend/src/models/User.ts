import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

// FIXED HOOK — works in Mongoose 7+
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
