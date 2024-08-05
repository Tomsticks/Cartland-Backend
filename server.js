require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
process.on("uncaughtException", (err) => {
  console.log("uncaughtException! .. Shutting Down.....💥💣💥🧨");
  console.log(err.name, err.message);
  process.exit(1);
});
const PORT = process.env.PORT || 5000;
// CONNECT DATABASE
mongoose
  .connect(
    "mongodb+srv://tscript:@tomzor.axomd8j.mongodb.net/clbackend"
  )
  .then(() => {
    console.log("database Connected");
  })
  .catch((err) => {
    console.log("check Internet connection", err);
  });

// START SERVER
const server = app.listen(PORT, () => {
  console.log(`server is currently running on PORT ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message, err.stack);
  console.log("UhandleRejection! .. Shutting Down.....💥💣💥🧨");
  server.close(() => {
    process.exit(1);
  });
});
