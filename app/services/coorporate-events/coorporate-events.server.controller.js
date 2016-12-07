'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
//errorHandler = require('./errors.server.controller'),
    CoorporateEvent = mongoose.model('CoorporateEvent'),
    _ = require('lodash');

/**
 * Create a Coorporate event
 */
exports.create = function (req, res) {
    var coorporateEvent = new CoorporateEvent(req.body);

    coorporateEvent.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: 'Something error'
            });
        } else {
            res.jsonp(coorporateEvent);
        }
    });
};

/**
 * Show the current Coorporate event
 */
exports.read = function (req, res) {
    res.jsonp(req.coorporateEvent);
};

/**
 * Update a Coorporate event
 */
//exports.update = function(req, res) {
//	var coorporateEvent = req.coorporateEvent ;
//
//	coorporateEvent = _.extend(coorporateEvent , req.body);
//
//	coorporateEvent.save(function(err) {
//		if (err) {
//			return res.status(400).send({
//				message: 'Something error'
//			});
//		} else {
//			res.jsonp(coorporateEvent);
//		}
//	});
//};

var updateEvent = function (req, res) {
    CoorporateEvent.findById(req.body._id, function (err, coorporateEvent) {
        if (err) {
            return res.send(400, {message: 'Something error'});
        } else {
            coorporateEvent = _.extend(coorporateEvent, req.body);
            coorporateEvent.save(function (err) {
                if (err) {
                    return res.send(400, {message: 'Something error'});
                } else {
                    res.send(200);
                }
            });
        }
    });
};

exports.update = function (req, res) {
    updateEvent(req, res);
};

/**
 * Delete an Coorporate event
 */
exports.delete = function (req, res) {
    var coorporateEvent = req.coorporateEvent;

    coorporateEvent.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: 'Something error'
            });
        } else {
            res.jsonp(coorporateEvent);
        }
    });
};

/**
 * List of Coorporate events
 */
exports.list = function (req, res) {
    CoorporateEvent.find().sort('-name').exec(function (err, coorporateEvents) {
        if (err) {
            return res.status(400).send({
                message: 'Something error'
            });
        } else {
            res.jsonp(coorporateEvents);
        }
    });
};

/**
 * Coorporate event middleware
 */
exports.coorporateEventByID = function (req, res, next, id) {
    CoorporateEvent.findById(id).populate('user', 'displayName').exec(function (err, coorporateEvent) {
        if (err) return next(err);
        if (!coorporateEvent) return next(new Error('Failed to load Coorporate event ' + id));
        req.coorporateEvent = coorporateEvent;
        next();
    });
};

exports.listByEventDate = function (req, res) {
    var joinDate = null;
    var resourceJoinDate = req.param('resourceJoinDate');
    var refYear = req.param('year');
    if (resourceJoinDate !== undefined && resourceJoinDate !== null) {
        var year = resourceJoinDate.split('-')[0];			// Start from 1.
        var month = (resourceJoinDate.split('-')[1] - 1); 	// Start from 0. January is 0
        var day = resourceJoinDate.split('-')[2]; 			// Start from 1.

        joinDate = new Date(year, month, day);
    }

    //CoorporateEvent.find({'eventDate_asDate':{'$gt':joinDate}}).sort('name').exec(function(err, coorporateEventsByDate) {
    //CoorporateEvent.find({$or: [{eventDate_asDate: {$gt: joinDate}}, {eventDate_asDate: null}]}).sort('name').exec(function (err, coorporateEventsByDate) {
    CoorporateEvent.find({$or:[{eventDate_asDate:null},{$and:[{eventDate_asDate:{$gt:joinDate}},{year:refYear}]}]}).sort('name').exec(function (err, coorporateEventsByDate) {
        if (err) {
            return res.status(400).send({
                message: 'Something error'
            });
        } else {
            res.jsonp(coorporateEventsByDate);
        }
    });
};

exports.updatePesertaEvent = function (req, res) {
    var eventId = req.param('eventId');
    var pesertaId = req.param('pesertaId');
    CoorporateEvent.findById(eventId, function (err) {
        if (err) {
            return res.send(400, {message: 'Event not found'});
        } else {
            CoorporateEvent.update({_id: eventId}, {$addToSet: {peserta: pesertaId}}, function (err) {
                if (err) {
                    return res.send(400, {message: 'Error at updating'});
                } else {
                    res.send(200);
                }
            });
        }
    });
};

exports.removePesertaEvent = function (req, res) {
    var eventId = req.param('eventId');
    var pesertaId = req.param('pesertaId');
    CoorporateEvent.findById(eventId, function (err) {
        if (err) {
            return res.send(400, {message: 'Event not found'});
        } else {
            CoorporateEvent.update({_id: eventId}, {$pull: {peserta: pesertaId}}, function (err) {
                if (err) {
                    return res.send(400, {message: 'Error at updating'});
                } else {
                    res.send(200);
                }
            });
        }
    });
};

exports.listEventByPeserta = function (req, res) {
    var pesertaId = req.param('pesertaId');
    var year = req.param('year');

    CoorporateEvent.find({$and:[{peserta: pesertaId},{year:year}]}).exec(function (err,events) {
        if (err) {
            return res.send(400, {message: 'Error at updating'});
        } else {
            res.jsonp(events);
        }
    });
};


