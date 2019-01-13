import Application from './Application';

const rootEl = global.document.querySelector('body');
const app = new Application(rootEl);

app.start();