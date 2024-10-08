export default class Routes {
  static coursePath = (id) => `/courses/${id}`;
  static coursesPath = () => '/courses';
  static newCoursesPath = () => '/courses/new';
  static userPath = (id) => `/users/${id}`;
  static usersPath = () => '/users';
  static editUsersPath = (id) => `/users/${id}/edit`;
  static newUsersPath = () => '/users/new';
};