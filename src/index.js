import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import fastifyFormbody from '@fastify/formbody';
import _ from 'lodash';

const app = fastify({
  logger: true
});
const port = 3000;

await app.register(fastifyFormbody);
await app.register(view, { engine: { pug }});

const state = {
  users: [],
  courses: [],
};

app.get('/', (req, res) => res.view('src/views/index'));

app.get('/hello', (req, res) => {
  const { name } = req.query;

  if (name) {
    res.send(`Hello, ${name}!`);
  } else {
    res.send('Yo!')
  }
});

app.get('/courses', (req, res) => {
  const { searchBy, term }= req.query;
  
  let currentCourses = state.courses;
  if (term && searchBy === 'title') {
    currentCourses = state.courses.filter((course) => course.title
    .toLowerCase()
    .includes(term.toLowerCase())
    )
  }

  if (term && searchBy === 'description') {
    currentCourses = state.courses.filter((course) => course.description
    .toLowerCase()
    .includes(term.toLowerCase())
    )
  }

  const data = {
    courses: currentCourses,
    term,
    header: 'Programming courses'
  }

  res.view('src/views/courses/index', data);
});

app.post('/courses', (req, res) => {
  const course = {
    id: parseInt(_.uniqueId()),
    title: req.body.title,
    description: req.body.description,
  };

  state.courses.push(course);

  res.redirect('/courses');
})

app.get('/courses/new', (req, res) => {
  res.view('src/views/courses/new');
});

app.get('/courses/:id', (req, res) => {
  const { id } = req.params;
  const course = state.courses.find((course) => course.id === parseInt(id));
  if (!course) {
    res.code(404).send({ message: 'Course not found' });
    return;
  }
  const data = {
    course,
  }
  res.view('src/views/courses/show', data);
});

app.get('/courses/:courseId/lessons/:id', (req, res) => {
  res.send(`Course ID: ${req.params.courseId}; Lesson ID: ${req.params.id}`);
});

app.get('/users', (req, res) => {
  const data = {
    users: state.users,
    header: 'Users list'
  }

  res.view('src/views/users/index', data);
});

app.post('/users', (req, res) => {
  const user = {
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    password: req.body.password,
  };

  state.users.push(user);

  res.redirect('/users');
})

app.get('/users/new', (req, res) => {
  res.view('src/views/users/new');
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = state.users.find((user) => user.name === id);
  if (!user) {
    res.code(404).send({ message: 'User not found' });
    return;
  }

  const data = {
    user,
  }
  
  res.view('src/views/users/show', data);
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
