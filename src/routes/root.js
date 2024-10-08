const rootRoute = async (app) => app.get('/', (req, res) => res.view('src/views/index'));

export default rootRoute;