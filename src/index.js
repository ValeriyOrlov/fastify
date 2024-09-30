import fastify from 'fastify';

const app = fastify({
  logger: true
});
const port = 3000;

app.get('/', (req, res) => {
  res.send('Root route');
});

app.get('/hello', (req, res) => {
  const { name } = req.query;

  if (name) {
    res.send(`Hello, ${name}!`);
  } else {
    res.send('Yo!')
  }
});

try {
  await app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`);
  });
} catch(e) {
  app.log.error(e);
  process.exit(1);
};
