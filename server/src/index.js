const express = require("express");
const morgan = require("morgan");
const { database } = require("./db");
const router = require("./routes/index");
const { routerRegistration } = require("./routes/authorization");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

app.use("/registration", routerRegistration);
app.use("/", router);

try {
  database.sync({ force: false }).then(() => {
    app.listen(port, async () => {
      console.log(`Server listening on port: ${port}`);
    });
  });
} catch (error) {
  console.log(error);
}
