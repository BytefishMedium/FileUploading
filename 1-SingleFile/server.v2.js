const path = require("path");
const Koa = require("koa");
const Router = require("@koa/router");
const multer = require("@koa/multer");
const cors = require("@koa/cors");

const app = new Koa();
const router = new Router();

const PORT = 3001;

const upload = multer();

router.get("/", async (ctx) => {
  ctx.body = "Hello friends!";
});

// add a route for uploading single files
router.post("/upload-single-file", upload.single("file"), (ctx) => {
  console.log("ctx.request.file", ctx.request.file);
  ctx.body = `file ${ctx.request.file.filename} has saved on the server`;
});

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`app starting at port ${PORT}`);
});
