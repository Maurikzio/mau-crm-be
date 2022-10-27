import mongoose from "mongoose";

const ClientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true,
  },
  createdWhen: {
    type: Date,
    default: Date.now(),
  },
  seller: { //es el User, el vendedor de la empresa, doy de alta al un cliente y solamente yo le puedo agregar pedidos
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // referencia de dont estara el objectId del vendedor,
    required: true,
  }
});

export default mongoose.model("Client", ClientSchema);