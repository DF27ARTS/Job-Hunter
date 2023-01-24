const express = require("express");
const morgan = require("morgan");
// const { database } = require("./src/db");
const router = require("./src/routes/index");
const { routerRegistration } = require("./src/routes/authorization");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  return res.json({message: "Hello, world from jub hunter api"});
})

// app.use("/registration", routerRegistration);
// app.use("/", router);

try {
  // database.sync({ force: false }).then(() => {
    app.listen(port, async () => {
      console.log(`Server listening on port: ${port}`);
    });
  // });
} catch (error) {
  console.log(error);
}
