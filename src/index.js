import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import fastifyFormbody from '@fastify/formbody';
import rootRoute from './routes/root.js';
import usersRoutes from './routes/users.js';
import coursesRoutes from './routes/courses.js';

const app = fastify({
  logger: true
});
const port = 3000;

await app.register(fastifyFormbody);
await app.register(view, { engine: { pug }});
await app.register(rootRoute);
await app.register(usersRoutes);
await app.register(coursesRoutes);

export const state = {
  users: [],
  courses: [],
};

state.users.push({ id: 0, name: 'Pupa', email: 'pupa@mail.com '});

try {
  await app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`);
  });
} catch(e) {
  app.log.error(e);
  process.exit(1);
};
