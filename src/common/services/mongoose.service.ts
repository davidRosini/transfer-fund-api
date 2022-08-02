import mongoose from "mongoose";
import debug from "debug";

const log: debug.IDebugger = debug("app:mongoose-service");

class MongooseService {
  private mongooseOptions;

  constructor() {
    this.mongooseOptions = this.getMongooseOptions();
  }

  private getMongooseOptions() {
    return {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    };
  }

  getMongoose() {
    return mongoose;
  }

  public conectToDataBase(host: string, port: number) {
    log("Attempting MongoDB connection...");
    mongoose
      .connect(`mongodb://${host}:${port}/api-db`, this.mongooseOptions)
      .then(() => {
        log("MongoDB is connected");
      })
      .catch((err) => {
        log(`MongoDB connection unsuccessful:`, err);
        process.exit(1);
      });
  }
}

export default new MongooseService();
