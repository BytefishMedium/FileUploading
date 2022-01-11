const path = require("path");
const Koa = require("koa");
const serve = require("koa-static");
const Router = require("@koa/router");
const multer = require("@koa/multer");
const cors = require("@koa/cors");
const fse = require("fs-extra");

const app = new Koa();
const router = new Router();

const PORT = 3003;

const UPLOAD_DIR = path.join(__dirname, "/uploadFiles");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    // images@image-1.jpeg => images/image-1.jpeg
    let relativePath = file.originalname.replace(/@/g, path.sep);
    let index = relativePath.lastIndexOf(path.sep);
    let fileDir = path.join(UPLOAD_DIR, relativePath.substr(0, index));
    
    // ensure there is a folder
    await fse.ensureDir(fileDir); 

    cb(null, fileDir);
  },
  filename: function (req, file, cb) {
    let parts = file.originalname.split("@");
    cb(null, `${parts[parts.length - 1]}`);
  },
});
const upload = multer({ storage: storage });

router.get("/", async (ctx) => {
  ctx.body = "Hello friends!";
});

router.post("/upload-directory", upload.fields([{ name: "file" }]), (ctx) => {
  let urls = ctx.files.file.map(
    (file) =>
      `http://localhost:${PORT}/${file.originalname.replace(/@/g, path.sep)}`
  );
  ctx.body = {
    message: `directory have saved on the server`,
    urls
  };
});

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(UPLOAD_DIR));

app.listen(PORT, () => {
  console.log(`app starting at port ${PORT}`);
});
