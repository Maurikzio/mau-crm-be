// User -> tendra todos loas metodos de mongoos para insertas datos.
import User from "../models/user.js";
import bcryptjs from "bcryptjs";

const resolvers = {
  Query: {
    getBooks: () => "Getting books"
  },
  // mutations sirven para crear registro, modificarlos o eliminarlos
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;

      //check if user is not registered
      const userAlreadyExists = await User.findOne({ email });

      if(userAlreadyExists) {
        throw new Error("User already exists");
      }

      //hash password
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      //save into db
      try {
        const user = new User(input);
        await user.save();
        return user; //retornamos el usario recien creado pero siguiento lo definido en el "Type User"
      } catch(err) {
        console.log(err);
      }
    }
  }
};

export default resolvers;