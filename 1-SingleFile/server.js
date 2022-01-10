const path = require("path");
const Koa = require("koa");
const serve = require("koa-static");
const Router = require("@koa/router");
const multer = require("@koa/multer");
const cors = require("@koa/cors");

const app = new Koa();
const router = new Router();

const PORT = 3000;

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

// add a route for uploading single files
router.post("/upload-single-file", upload.single("file"), (ctx) => {
  ctx.body = {
    message: `file ${ctx.request.file.filename} has saved on the server`,
    url: `http://localhost:${PORT}/${ctx.request.file.originalname}`,
  };
});

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(UPLOAD_DIR));

app.listen(PORT, () => {
  console.log(`app starting at port ${PORT}`);
});
