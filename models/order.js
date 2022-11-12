// modelo que une Clientes, Productos y Usuarios
import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
  order: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client"
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  status: {
    type: String,
    default: "PENDING"
  },
  createdWhen: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model('Order', OrderSchema);