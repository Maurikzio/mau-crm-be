// User -> tendra todos loas metodos de mongoos para insertas datos.
import User from "../models/user.js";
import Product from "../models/product.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (user, secretWord, expiresIn) => {
  /*1-information to store in token,  2.-Secret word, 3.-Expire time*/
  const { id, email, name, lastname } = user;
  return jwt.sign({ id, email, name, lastname }, secretWord, { expiresIn } );
}

const resolvers = {
  Query: {
    getUserInfo: async (_, { token }) => {
      const userInfo = await jwt.verify(token, process.env.SECRET_W);
      return userInfo;
    },
    getAllProducts: async () => {
      try {
        const allProducts = await Product.find({});
        return allProducts;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    getProductById: async (_, { id }) => {
      const productInDB = await Product.findById(id);
      if(!productInDB) {
        throw new Error('Product does not exist');
      }

      return productInDB;
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
    },
    createNewProduct: async (_, { input }) => {
      try {
        const newProduct = new Product(input);

        //store in db
        const res = await newProduct.save();
        return res;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    updateProduct: async (_, { id, input }) => {
      // check if product already exists
      let productInDB = await Product.findById(id);
      if(!productInDB) {
        throw new Error('Product does not exist');
      }

      //store in db
      productInDB = await Product.findOneAndUpdate({ _id: id }, input, { new: true }); // new to return the new object with the new info

      return productInDB;
    },
    deleteProduct: async (_, { id }) => {
      const productInDB = await Product.findById(id);
      if(!productInDB) {
        throw new Error('Product does not exist');
      }

      //delete
      await Product.findOneAndDelete({ _id: id });

      return "Product was removed"
    }
  }
};

export default resolvers;