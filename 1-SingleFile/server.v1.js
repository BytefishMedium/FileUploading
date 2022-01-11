const path = require("path");
const Koa = require("koa");
const Router = require("@koa/router");

const app = new Koa();
const router = new Router();

const PORT = 3001;

router.get("/", async (ctx) => {
  ctx.body = "Hello friends!";
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`app starting at port ${PORT}`);
});
