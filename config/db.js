import mongoose  from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'variables.env'})

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
    });
    console.log("Database connected");
  } catch (err) {
    console.log("🤯 Error connecting to Database");
    console.log(err);
    process.exit(1);
  }
};

export default connectDB;