'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Coorporate event Schema
 */
var CoorporateEventSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Coorporate event name',
		trim: true
	},
	eventDate_asString: {
		type: String
	},
	eventDate_asDate: {
		type: Date
	},
	year:{
		type:Number
	},
	peserta:[{
		type: Schema.ObjectId,
		ref : 'User',
		default: null
	}],
	sharingKnowledge: {
		type: Boolean,
		default: false
	},
	employeeGathering: {
		type: Boolean,
		default: false
	},
	mandatory: {
		type: Boolean,
		default: false
	}
});

mongoose.model('CoorporateEvent', CoorporateEventSchema);