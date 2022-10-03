const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const PORT = process.env.PORT || 9876;
const adminRoutes = require("./Routes/Admin");

/**------------------------------------ CONFIGURATION--------------------------------------------------------**/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**------------------------------------DATABASE CONFIGURATION--------------------------------------------------------**/
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`An error ocurred ${error}`);
  });

/**------------------------------------ ROUTERS CONFIGURATION--------------------------------------------------------**/

app.use("/admin", adminRoutes);

/**------------------------------------ ROUTERS--------------------------------------------------------**/
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Ola ",
  });
});
