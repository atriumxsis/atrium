'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Performance = mongoose.model('Performance'),
	Timesheet = mongoose.model('Timesheet'),
	TimesheetTemplate = mongoose.model('TimesheetTemplate'),
	SystemConfig = mongoose.model('SystemConfig'),
	_ = require('lodash');

// =============================================================================
// helper function declaration
// =============================================================================
var savePerformance = function(timesheetCollectionPerformance, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform,currentWorkingMonths) {
	timesheetCollectionPerformance.kriteriaPenilaianUser.ski = ski;
	timesheetCollectionPerformance.kriteriaPenilaianUser.kompetensiPendukung = kompetensiPendukung;
	timesheetCollectionPerformance.kriteriaPenilaianUser.kedisiplinan = kedisiplinan;
	timesheetCollectionPerformance.kriteriaPenilaianUser.kriteriaValue = ((parseInt(ski) + parseInt(kompetensiPendukung) + parseInt(kedisiplinan)) / (4 * 3 * (12-parseInt(currentWorkingMonths))));

	timesheetCollectionPerformance.kriteriaTimesheetCollection.collectionDate_asString = collectionDate_asString;
	timesheetCollectionPerformance.kriteriaTimesheetCollection.perform = timesheetCollectionPerform;
	timesheetCollectionPerformance.kriteriaTimesheetCollection.kriteriaValue = (timesheetCollectionPerform) ? (1/(12-parseInt(currentWorkingMonths))) : 0;
	console.log("totalworkingDays = "+timesheetCollectionPerformance.totalWorkingDays);
	//console.log("totalworkingMonths = "+currentWorkingMonths);
	timesheetCollectionPerformance.save();
};

var findPerformance = function(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform, pengali, totalWorkingDays,currentWorkingMonths) {
	Performance.findOne({resource: resource, year: year, month: month}).exec(function(err, timesheetCollectionPerformance) {
		if(!err) {
			if(timesheetCollectionPerformance === undefined || timesheetCollectionPerformance === null) {
				timesheetCollectionPerformance = new Performance({
					resource: resource, 
					year: year, 
					month: month,
					totalWorkingDays: totalWorkingDays,
					rumusAkhir: pengali,
					currentWorkingMonths:currentWorkingMonths
				});
			}else{
				timesheetCollectionPerformance = _.extend(timesheetCollectionPerformance,{currentWorkingMonths:currentWorkingMonths});
				//console.log(timesheetCollectionPerformance);
			}

			savePerformance(timesheetCollectionPerformance, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform,currentWorkingMonths);
		}
	});
};

var findTimesheetTemplateByYear = function(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform, pengali,resourceJoinDate_asString) {
	var locYear = resourceJoinDate_asString.split('-')[0];			// Start from 1.
	var locMonth = (resourceJoinDate_asString.split('-')[1] - 1); 	// Start from 0. January is 0
	console.log("locmonth = "+locMonth);
	var locDay = resourceJoinDate_asString.split('-')[2];
	var currentWorkingMonths=0;
	TimesheetTemplate.findOne({year: year}).exec(function(err, timesheetTemplate) {
		if(!err && timesheetTemplate !== null) {
			var totalWorkingDays = timesheetTemplate.totalWorkingDays;
			if(locYear == year){
				for(var i = 0; i < locMonth; i++) {
					currentWorkingMonths++;
				}
				console.log("totalworkingMonths = "+currentWorkingMonths);
			}
			findPerformance(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform, pengali, totalWorkingDays,currentWorkingMonths);
		}
	});
};

var findSystemConfigPengaliPerformance = function(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform,resourceJoinDate_asString) {
	SystemConfig.findOne({key: SystemConfig.PENGALI_PERFORMANCE}, function(err, systemConfig) {
		if(!err) {
			var pengali = systemConfig.value;

			findTimesheetTemplateByYear(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform, pengali,resourceJoinDate_asString);
		}
	});
};

var findResourceJoinDate = function(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform) {
	User.findOne({_id:resource }, function(err, user) {
		if(!err) {
			var resourceJoinDate_asString = user.joinDate_asString;

			findSystemConfigPengaliPerformance(resource, year, month, ski, kompetensiPendukung, kedisiplinan, collectionDate_asString, timesheetCollectionPerform,resourceJoinDate_asString);
		}
	});
};

// =============================================================================
// exported function declaration
// =============================================================================
module.exports = {
	doCalculation: findResourceJoinDate
};
