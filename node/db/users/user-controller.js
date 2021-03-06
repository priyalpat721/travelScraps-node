const userDao = require('./user-dao');
const calendarDao = require(`../calendar/dao`)
const countdownDao = require(`../countdown/dao`)

module.exports = (app) => {
    const findAllUsers = (req, res) =>
        userDao.findAllUsers()
            .then(users => {
                return res.json(users)
            });

    const findUserById = (req, res) =>
        userDao.findUserById(req.params.user)
            .then(user => {
                return res.json(user)
            });

    const deleteUser = (req, res) =>
        userDao.deleteUser(req.params.user)
            .then(status => res.send(status));

    const updateUser = (req, res) =>
        userDao.updateUser(req.body)
            .then(status => res.send(status));

    const setSession = (req, res) => {
        let name = req.params['profile'];
        req.session[name] = req.params['value'];
        res.send(req.session);
    }

    const login = (req, res) => {
        userDao.findByUsernameAndPassword(req.body)
            .then(user => {
                if (user) {
                    req.session['profile'] = user;
                    res.json(user);
                    return;
                }
                res.sendStatus(403);
            })
    }

    const register = async (req, res) => {
        userDao.findByUsername(req.body)
            .then((user) => {
                if (user) {
                    res.sendStatus(404);
                    return;
                }
                userDao.createUser(req.body)
                    .then(user => {
                        req.session['profile'] = user;
                        calendarDao.createCalendar({events: [], person: user._id})
                        countdownDao.createCountDown({person: user._id, date: ""})
                        res.json(user)
                    })
            })
    }

    const profile = (req, res) =>
        res.json(req.session['profile']);

    const logout = (req, res) =>
        res.send(req.session.destroy());

    app.post('/api/login', login);
    app.post('/api/register', register);
    app.post('/api/profile', profile);
    app.post('/api/logout', logout);
    app.put('/api/users', updateUser);
    app.get('/api/session/set/:name/:value', setSession);

    app.delete('/api/users/:user', deleteUser);
    app.get('/api/users', findAllUsers);
    app.get('/api/users/:user', findUserById);
};