'use strict';

module.exports = function(app) {
	var userSecurity = require('../../app/services/user/user-security.service.server');
	var coorporateEvents = require('../../app/services/coorporate-events/coorporate-events.server.controller');

	// Coorporate events Routes
	app.route('/api/coorporate-events').get(userSecurity.requiresEroRole, coorporateEvents.list);
	app.route('/api/coorporate-events').post(userSecurity.requiresEroRole, coorporateEvents.create);

	//app.route('/api/coorporate-events/:coorporateEventId').get(userSecurity.requiresEroRole,coorporateEvents.read);
	app.route('/api/coorporate-events/update').post(userSecurity.requiresEroRole, coorporateEvents.update);
	app.route('/api/coorporate-events/:coorporateEventId/delete').delete(userSecurity.requiresEroRole, coorporateEvents.delete);
	app.route('/api/coorporate-events/:resourceJoinDate/year/:year').get(userSecurity.requiresEroRole, coorporateEvents.listByEventDate);
	app.route('/api/coorporate-events/:eventId/peserta/:pesertaId/update').post(userSecurity.requiresEroRole, coorporateEvents.updatePesertaEvent);
	app.route('/api/coorporate-events/:eventId/peserta/:pesertaId/delete').post(userSecurity.requiresEroRole, coorporateEvents.removePesertaEvent);
	app.route('/api/coorporate-events/peserta/:pesertaId/year/:year').get(userSecurity.requiresEroRole, coorporateEvents.listEventByPeserta);

	// Finish by binding the Coorporate event middleware
	app.param('coorporateEventId', coorporateEvents.coorporateEventByID);
};
