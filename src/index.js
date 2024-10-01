import fastify from 'fastify';

const app = fastify({
  logger: true
});
const port = 3000;

const state = {
  users: [
    {
      id: 1,
      name: 'user1',
    },
  ],
  courses: [
    {
      id: 1,
      name: 'course1',
    },
  ],
};

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

app.get('/courses/:id', (req, res) => {
  const { id } = req.params;
  const course = state.courses.find((course) => course.id === parseInt(id));
  if (!course) {
    res.code(404).send({ message: 'Course not found' });
  } else {
    res.send(course);
  }
});

app.get('/courses/:courseId/lessons/:id', (req, res) => {
  res.send(`Course ID: ${req.params.courseId}; Lesson ID: ${req.params.id}`);
});


app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = state.users.find((user) => user.id === parseInt(id));
  if (!user) {
    res.code(404).send({ message: 'User not found' });
  } else {
    res.send(user);
  }
});

app.get('/users/:id/posts/:postId', (req, res) => {
  res.send(`User ID: ${req.params.id}; Post ID: ${req.params.postId}`);
});

try {
  await app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`);
  });
} catch(e) {
  app.log.error(e);
  process.exit(1);
};
