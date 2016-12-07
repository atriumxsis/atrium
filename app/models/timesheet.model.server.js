'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var TimesheetSchema = new Schema({
	tanggal_asString: {
		type: String
	},
	// Autogenerated
	tanggal_asDate: {
		type: Date
	},
	// field to improve query speed. Autogenerated
	year: {
		type: Number
	},
	// field to improve query speed. Autogenerated
	month: {
		type: Number
	},
	// field to improve query speed. Autogenerated
	day: {
		type: Number
	},
	template: {
		type: Boolean,
		default: true
	},
	statusAbsensi: {
		type: String
	},
	jamKerjaMulai: {
		type: String
	},
	jamKerjaSelesai: {
		type: String
	},
	jamKerjaTotal: {
		type: String
	},
	jamOTMulai: {
		type: String
	},
	jamOTSelesai: {
		type: String
	},
	jamOTTotal: {
		type: String
	},
	kegiatan: {
		type: String
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	placement: {
		type: Schema.ObjectId,
		ref: 'Placement'	
	}
});

TimesheetSchema.methods.calculateYearMonthDay = function() {
	if(this.tanggal_asString !== undefined && this.tanggal_asString !== null) {
		this.year = this.tanggal_asString.split('-')[0];					// Start from 1.
		this.month = (this.tanggal_asString.split('-')[1] - 1); 			// Start from 0. January is 0
		this.day = this.tanggal_asString.split('-')[2]; 					// Start from 1.
		this.tanggal_asDate = new Date(this.year, this.month, this.day);	// 
	}
};

TimesheetSchema.methods.calculateTotalJamKerja = function() {
	if(this.jamKerjaMulai !== undefined && this.jamKerjaMulai !== null && this.jamKerjaSelesai !== undefined && this.jamKerjaSelesai !== null) {
		var jamKerjaMulaiInMinutes = (parseInt(this.jamKerjaMulai.split(':')[0] * 60) + parseInt(this.jamKerjaMulai.split(':')[1]));
		var jamKerjaSelesaiInMinutes = (parseInt(this.jamKerjaSelesai.split(':')[0] * 60) + parseInt(this.jamKerjaSelesai.split(':')[1]));
		var jamKerjaTotal = parseInt(jamKerjaSelesaiInMinutes - jamKerjaMulaiInMinutes - 60);

		var jamKerjaTotal_hourPart = parseInt(jamKerjaTotal / 60);
		var jamKerjaTotal_minutePart = (jamKerjaTotal - (jamKerjaTotal_hourPart * 60));

		this.jamKerjaTotal = (jamKerjaTotal_hourPart + ':' + jamKerjaTotal_minutePart);
	} else {
		this.jamKerjaTotal = null;
	}
};

TimesheetSchema.methods.calculateTotalOT = function() {
	if(this.jamOTMulai !== undefined && this.jamOTMulai !== null && this.jamOTSelesai !== undefined && this.jamOTSelesai !== null) {
		var jamOTMulaiInMinutes = (parseInt(this.jamOTMulai.split(':')[0] * 60) + parseInt(this.jamOTMulai.split(':')[1]));
		var jamOTSelesaiInMinutes = (parseInt(this.jamOTSelesai.split(':')[0] * 60) + parseInt(this.jamOTSelesai.split(':')[1]));
		var jamOTTotal = parseInt(jamOTSelesaiInMinutes - jamOTMulaiInMinutes);

		var jamOTTotal_hourPart = parseInt(jamOTTotal / 60);
		var jamOTTotal_minutePart = (jamOTTotal - (jamOTTotal_hourPart * 60));

		this.jamOTTotal = (jamOTTotal_hourPart + ':' + jamOTTotal_minutePart);
	} else {
		this.jamOTTotal = null;
	}
};

TimesheetSchema.pre('save', function(next) {
	this.calculateYearMonthDay();
	this.calculateTotalJamKerja();
	this.calculateTotalOT();

	next();
});

mongoose.model('Timesheet', TimesheetSchema);
