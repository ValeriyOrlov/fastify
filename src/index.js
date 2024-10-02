import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import fastifyFormbody from '@fastify/formbody';
import _ from 'lodash';
import yup from 'yup';

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

export class Routes {
  static coursePath = (id) => `/courses/${id}`;
  static coursesPath = () => '/courses';
  static newCoursesPath = () => '/courses/new';
  static userPath = (id) => `/users/${id}`;
  static usersPath = () => '/users';
  static newUsersPath = () => '/users/new';
}

app.get('/', (req, res) => res.view('src/views/index'));

app.get('/hello', (req, res) => {
  const { name } = req.query;

  if (name) {
    res.send(`Hello, ${name}!`);
  } else {
    res.send('Yo!')
  }
});

app.get(Routes.coursesPath(), (req, res) => {
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
    header: 'Programming courses',
    Routes,
  }

  res.view('src/views/courses/index', data);
});

app.post(Routes.coursesPath(), {
  attachValidation: true,
  schema: {
    body: yup.object({
      title: yup.string().min(2, 'The name must be at least two characters long'),
      description: yup.string().min(10, 'The description must be at least ten characters long')
    }),
  },
  validatorCompiler: ({ schema }) => (data) => {
    try {
      const result = schema.validateSync(data);
      return { value: result };
    } catch (e) {
      return { error: e };
    }
  },
}, (req, res) => {
  const { title, description } = req.body;

  if (req.validationError) {
    const data = {
      title, description,
      error: req.validationError,
      Routes,
    };

    res.view('src/views/courses/new', data);
    return;
  }

  const course = {
    id: parseInt(_.uniqueId()),
    title: req.body.title,
    description: req.body.description,
  };

  state.courses.push(course);

  res.redirect('/courses');
})

app.get(Routes.newCoursesPath(), (req, res) => {
  res.view('src/views/courses/new', { Routes });
});

app.get(Routes.coursePath(':id'), (req, res) => {
  const { id } = req.params;
  const course = state.courses.find((course) => course.id === parseInt(id));
  if (!course) {
    res.code(404).send({ message: 'Course not found' });
    return;
  }
  const data = {
    course,
    Routes,
  }
  res.view('src/views/courses/show', data);
});

app.get(Routes.usersPath(), (req, res) => {
  const data = {
    users: state.users,
    header: 'Users list',
    Routes,
  }

  res.view('src/views/users/index', data);
});

app.post(Routes.usersPath(), {
  attachValidation: true,
  schema: {
    body: yup.object({
      name: yup.string().min(2, 'The name must be at least two characters long'),
      email: yup.string().email(),
      password: yup.string().min(5, 'The password must be at least five characters long'),
      passwordConfirmation: yup.string().min(5),
    }),
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
    if (data.password !== data.passwordConfirmation) {
      return {
        error: Error('Password confirmation is not equal the password'),
      };
    }
    try {
      const result = schema.validateSync(data);
      return { value: result };
    } catch (e) {
      return { error: e };
    }
  },
}, (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body;

  if (req.validationError) {
    const data = {
      name, email, password, passwordConfirmation,
      error: req.validationError,
      Routes,
    }

    res.view('src/views/users/new', data);
    return;
  }

  const user = {
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    password: req.body.password,
  };

  state.users.push(user);

  res.redirect('/users');
})

app.get(Routes.newUsersPath(), (req, res) => {
  res.view('src/views/users/new', { Routes });
});

app.get(Routes.userPath(':id'), (req, res) => {
  const { id } = req.params;
  const user = state.users.find((user) => user.name === id);
  if (!user) {
    res.code(404).send({ message: 'User not found' });
    return;
  }

  const data = {
    user,
    Routes,
  }
  
  res.view('src/views/users/show', data);
});


try {
  await app.listen({ port }, () => {
    console.log(`Example app listening on port ${port}`);
  });
} catch(e) {
  app.log.error(e);
  process.exit(1);
};
