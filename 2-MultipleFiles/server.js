const path = require("path");
const Koa = require("koa");
const serve = require("koa-static");
const Router = require("@koa/router");
const multer = require("@koa/multer");
const cors = require("@koa/cors");

const app = new Koa();
const router = new Router();

const PORT = 3002;

const UPLOAD_DIR = path.join(__dirname, "/uploadFiles");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

router.get("/", async (ctx) => {
  ctx.body = "Hello friends!";
});

router.post("/upload-multiple-files", upload.fields([{ name: "file" }]), (ctx) => {
  let urls = ctx.files.file.map(
    (file) => `http://localhost:${PORT}/${file.originalname}`
  );
  ctx.body = {
    message: `files have saved on the server`,
    urls
  };
});

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(UPLOAD_DIR));

app.listen(PORT, () => {
  console.log(`app starting at port ${PORT}`);
});
