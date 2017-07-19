var routes = require('../modules/routes');

module.exports = function(app) {

    var appAquarium = '/Aquarium';

    app.get('/', routes.default.get);

    app.post('/Account' + appAquarium + '/Login', routes.account.login);
    app.post('/Account' + appAquarium + '/Register', routes.account.register);
    app.post('/Account' + appAquarium + '/ForgetPassword', routes.account.forPas);

    app.post('/Account' + appAquarium + '/Modify/UserName', routes.account.mdUserName);
    app.post('/Account' + appAquarium + '/Modify/Sex', routes.account.mdSex);
    app.post('/Account' + appAquarium + '/Modify/Birthday', routes.account.mdBirthday);
    app.post('/Account' + appAquarium + '/Modify/Big_Stickers', routes.account.mdBigSti);
    app.post('/Account' + appAquarium + '/Modify/Password', routes.account.mdPassword);
    app.post('/Account' + appAquarium + '/Modify/Country', routes.account.mdCountry);

    app.post('/Device' + appAquarium + '/Add', routes.dev_aqu.add);
    app.post('/Device' + appAquarium + '/Update', routes.dev_aqu.update);
    app.post('/Device' + appAquarium + '/Del', routes.dev_aqu.del);
}