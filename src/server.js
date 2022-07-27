const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.port = process.env.PORT || 3000;
    this.app = express();
    this.paths = {
      auth: "/api/auth",
      user: "/api/user",
      product: "/api/product",
      upload: "/api/upload",
    };
    this.middlewares();
    this.routes();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());

    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.user, require("./routes/user"));
    this.app.use(this.paths.product, require("./routes/product"));
    this.app.use(this.paths.auth, require("./routes/auth"));
    this.app.use(this.paths.upload, require("./routes/upload"));
  }
}

module.exports = Server;
