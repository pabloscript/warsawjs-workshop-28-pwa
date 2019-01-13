const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const serveStatic = require('koa-static');
const cors = require('@koa/cors');
const compress = require('koa-compress');
const Datastore = require('./Datastore');
const HTTP_PORT = process.env.PORT || 3000;

const app = new Koa();
const router = new Router();

const db = new Datastore({ filename: path.join(__dirname, '..', 'datastore.json') });

app.use(cors());
app.use(compress({
  threshold: 4096,
}));
app.use(bodyParser());

router.get('/projects', async (ctx) => {
  ctx.response.body = await db.getProjects();
});

router.post('/projects', async (ctx) => {
  const attrs = ctx.request.body;
  ctx.response.body = await db.createProject(attrs);
});

const swSource = fs.readFileSync(path.join(__dirname, '..', 'dist', 'assets', 'sw.js'));
router.get('/sw.js', async (ctx) => {
  ctx.response.type = 'application/javascript';
  ctx.response.body = swSource;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(serveStatic(path.join(__dirname, '..', 'dist')));

app.listen(HTTP_PORT);