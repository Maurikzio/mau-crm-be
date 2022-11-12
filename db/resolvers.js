// User -> tendra todos loas metodos de mongoos para insertas datos.
import User from "../models/user.js";
import Product from "../models/product.js";
import Client from "../models/client.js";
import Order from "../models/order.js"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';

dotenv.config({ path: 'variables.env'});

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
    },
    // los vendedores van a poder ver solo a sus clientes
    getAllClients: async () => {
      try {
        const clients = await Client.find({});
        return clients;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    getClientsBySeller: async (_, {}, ctx) => {
      try {
        const clientsOfSeller = await Client.find({ seller: ctx.user.id.toString() });
        return clientsOfSeller;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    getClient: async (_, { id }, ctx) => {
      //check if client exists
      const client = await Client.findById(id);
      if(!client) {
        throw new Error('Client not found');
      }
      //check id User/Seller can access the client
      if(client.seller.toString() !== ctx.user.id) {
        throw new Error("You cannot access this client");
      }

      return client;
    },
    getAllOrders: async () => {
      try {
        const orders = await Order.find({});
        return orders;
      } catch (err) {
        console.log(err)
      }
    },
    getOrdersBySeller: async (_, {}, ctx) => {
      try {
        const orders = await Order.find({ seller: ctx.user.id });
        return orders;
      } catch (err) {
        console.log(err)
      }
    },
    getOrder: async (_, { id }, ctx) => {
      const order = await Order.findById(id);

      // check if orders exists
      if(!order) {
        throw new Error("Order was not found");
      }

      // just the one who created must see the order
      if(order.seller.toString() !==  ctx.user.id)  { // if true someone is trying to cheat :(
        throw new Error(" Not allowed  action!")
      }

      return order;
    },
    getOrdersByStatus: async (_, { status }, ctx) => {
      const orders = await Order.find({ seller: ctx.user.id, status });

      return orders;
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
    },
    newClient: async (_, { input }, ctx) => {
      const { email } = input;
      //Check if client is registered using the email since it is unique
      const clientExists = await Client.findOne({ email });
      if(clientExists) {
        throw new Error('Client is already registered');
      }

      const newClient = new Client(input);

      //Assign a user/seller the client
      newClient.seller = ctx.user.id;

      //save in db
      try {
        const res = await newClient.save();
        return res;
      } catch (err) {
        throw new Error(err);
      }
    },
    updateClient: async (_, { id, input}, ctx) => {

      //Check if client is registered using the email since it is unique
      let client = await Client.findById(id);

      if(!client) {
        throw new Error('Client not found');
      }

      //check if User/seller of the client is the one that is updating.
      if(client.seller.toString() !== ctx.user.id) {
        throw new Error("You cannot access this client");
      }

      //save in DB
      client = await Client.findOneAndUpdate({ _id: id}, input, { new: true });
      return client;
    },
    deleteClient: async (_, { id }, ctx) => {
      let client = await Client.findById(id);

      if(!client) {
        throw new Error('Client not found');
      }

      if(client.seller.toString() !== ctx.user.id) {
        throw new Error("You cannot access this client");
      }

      //delete client
      await Client.findOneAndDelete({ _id: id });
      return "Client was deleted";
    },
    newOrder: async (_, { input }, ctx) => {
      const { client } = input;

      //check if client exists or not
      let clientExists = await Client.findById(client);

      if(!clientExists) {
        throw new Error('Client not found');
      }

      //check if client is associated to the seller(User)
      if(clientExists.seller.toString() !== ctx.user.id) {
        throw new Error("You cannot access this client");
      }

      //check the stock is available, we stop the execution and we dont save it into the DB.
      for await (let item of input.order) {
        const { id } = item;

        // production en la base de datos
        const product = await Product.findById(id);

        // check stock
        if(item.quantity > product.stock) {
          throw new Error(`We dont have that much in stock`);
        } else {
          // restar de la cantidad disponible
          // productio es una instancia de Product entonces podemos usar los metodos de Monoose
          product.stock = product.stock - item.quantity;
          await product.save();
        }
      }

      //create a new order
      const orderToSave =  new Order(input);

      // assign a seller(User) to the order
      orderToSave.seller = ctx.user.id;

      //save into de DB
      const result = await orderToSave.save();

      return result;
    },
    updateOrder: async (_, { id, input }, ctx) => {

      const { client } = input;
      // check if orders exists
      const orderExists = await Order.findById(id);
      if(!orderExists) {
        throw new Error("The order does not exist");
      }

      //check if client exists
      let clientExists = await Client.findById(client);

      if(!clientExists) {
        throw new Error('Client not found');
      }

      //check if client and order belongs to seller (user)
      if(clientExists.seller.toString() !== ctx.user.id) {
        throw new Error("You cannot access this client");
      }

      //check stock
      if(input.order) {
        for await (let item of input.order) {
          const { id } = item;

          // production en la base de datos
          const product = await Product.findById(id);

          // check stock
          if(item.quantity > product.stock) {
            throw new Error(`We dont have that much in stock`);
          } else {
            // restar de la cantidad disponible
            // productio es una instancia de Product entonces podemos usar los metodos de Monoose
            product.stock = product.stock - item.quantity;
            await product.save();
          }
        }
      }

      //save into db
      const result = await Order.findOneAndUpdate({ _id: id}, input, { new: true });

      return result;
    },
    deleteOrder: async (_, { id }, ctx) => {
      //check if orders exists
      const order = await Order.findById(id);
      if(!order) {
        throw new Error("Order not found")
      }

      //check if its seller is the one who wants to delete
      if(order.seller.toString() !== ctx.user.id) {
        throw new Error("You cannot delete this item")
      }

      //delete from db
      await Order.findOneAndDelete({ _id: id });

      return "Order was deleted"
    }
  }
};

export default resolvers;