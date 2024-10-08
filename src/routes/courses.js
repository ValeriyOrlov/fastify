import yup from 'yup';
import Routes from './routes.js';
import _ from 'lodash';
import { state } from '../index.js';

const coursesRoutes = async (app) => {
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
};

export default coursesRoutes;