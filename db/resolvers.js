// User -> tendra todos loas metodos de mongoos para insertas datos.
import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (user, secretWord, expiresIn) => {
  /*1-information to store in token,  2.-Secret word, 3.-Expire time*/
  const { _id: id, email, name, lastname } = user;
  return jwt.sign({ id, email, name, lastname }, secretWord, { expiresIn } );
}

const resolvers = {
  Query: {
    getUserInfo: async (_, { token }) => {
      const userId = await jwt.verify(token, process.env.SECRET_W);
      return userId;
    }
  },
  // mutations sirven para crear registro, modificarlos o eliminarlos
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;

      //check if user is not registered
      const userAlreadyExists = await User.findOne({ email }); // we use email for findOne because it is unique

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
    },
    authenticateUser: async (_, { input }) => {
      const { email, password} = input;

      // check if user exists
      const userInDB =  await User.findOne({ email });
      if(!userInDB) {
        throw new Error("User does not exist!");
      }

      //check if pwd is correct;
      const isPwdCorrect = await bcryptjs.compare(password, userInDB.password);
      if(!isPwdCorrect) {
        throw new Error("Incorrect password");
      }

      //create token
      return {
        token: createToken(userInDB, process.env.SECRET_W, '24h')
      }
    }
  }
};

export default resolvers;