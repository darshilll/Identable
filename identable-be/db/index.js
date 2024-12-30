import mongoose from "mongoose";

/* development connection string */
const databaseUrl = process.env.ATLAS_URL;

console.error("DB URL:", databaseUrl);

// Mongoose setup with server
mongoose.connect(
  databaseUrl,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
    } else {
      console.error("database connected", new Date());
    }
  }
);

export default mongoose;
