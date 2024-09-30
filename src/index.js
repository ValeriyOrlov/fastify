import fastify from 'fastify';

const app = fastify({
  logger: true
});
const port = 3000;

app.get('/', (req, res) => {
  res.send('Root route');
})

try {
  await app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`);
  });
} catch(e) {
  app.log.error(e);
  process.exit(1);
}
