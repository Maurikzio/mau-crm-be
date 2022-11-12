import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  createdWhen: {
    type: Date,
    default: Date.now() 
  }
});

ProductSchema.index({ name: 'text' }); // index to search Product by name

export default mongoose.model("Product", ProductSchema);