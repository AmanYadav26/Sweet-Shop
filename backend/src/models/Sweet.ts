import mongoose from "mongoose";

export interface ISweet extends mongoose.Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const SweetSchema = new mongoose.Schema<ISweet>({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 }
});

export default mongoose.model<ISweet>("Sweet", SweetSchema);
