var routes = require('../modules/routes');

module.exports = function(app) {

    var appAquarium = '/Aquarium';

    app.use(function(req, res, next) {
        var err = req.session.error;
        var msg = req.session.success;
        delete req.session.error;
        delete req.session.success;
        res.locals.message = '';
        if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
        if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
        next();
    });

    app.set('view engine', 'ejs');

    app.get('/Account' + appAquarium + '/VF', routes.web.vfAcc);
    app.get('/Account' + appAquarium + '/ChangePassword', routes.web.chaPass);

    app.post('/Account' + appAquarium + '/ChangePassword', routes.web.chaPassDB);
}