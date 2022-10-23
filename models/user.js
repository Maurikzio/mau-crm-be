import mongoose from "mongoose";

/*
definimos el schema, que es la forma que tendran los datos en la base de datos.
por ejemplo para los usuarios requermiso el nombre, apellido, email, pwd, fecha en la que ue dada de alta.
y tiene que seguir la forma que tenga tabb el schema en el typeDefs
El usuario requiere de un ID, pero no lo anadimos al modelo porque Mongo se lo va a asignar
*/
const UserSchema = mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  createdWhen: {
    type: Date,
    default: Date.now(),
  }
});

export default mongoose.model("User", UserSchema);