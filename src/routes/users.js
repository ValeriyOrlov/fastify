import yup from 'yup';
import Routes from './routes.js';
import { state } from '../index.js';
import _ from 'lodash';

const usersRoutes = async (app) => {
  app.get(Routes.usersPath(), (req, res) => {
    const data = {
      users: state.users,
      header: 'Users list',
      Routes,
    }
  
    res.view('src/views/users/index', data);
  });

  app.get(Routes.newUsersPath(), (req, res) => {
    res.view('src/views/users/new', { Routes });
  });

  app.get(Routes.userPath(':id'), (req, res) => {
    const { id } = req.params;
    const user = state.users.find((user) => parseInt(user.id) === parseInt(id));
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
      id: _.uniqueId(),
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password,
    };
  
    state.users.push(user);
  
    res.redirect('/users');
  });

  app.get(Routes.editUsersPath(':id'), (req, res) => {
    const { id } = req.params;
    const user = state.users.find((user) => parseInt(user.id) === parseInt(id));
  
    if (!user) {
      res.code(404).send({ message: 'User not found' });
    } else {
      res.view('/src/views/users/edit.pug', { user, Routes });
    }
  });

  app.patch(Routes.userPath(':id'), (req, res) => {
    const { id } = req.params;
    const { name, email, password, passwordConfirmation } = req.body;
    const userIndex = state.users.findIndex((item) => parseInt(item.id) === parseInt(id));
    if (userIndex === -1) {
      res.code(404).send({ message: 'User not found' });
    } else {
      state.users[userIndex] = { ...state.users[userIndex], name, email };
      res.send(users[userIndex]);
      res.redirect('/users');
    }
  });

  app.delete(Routes.userPath(':id'), (req, res) => {
    const { id } = req.params;
    const user = state.users.find((user) => user.name === id);

    console.log(user);
  })
};

export default usersRoutes;