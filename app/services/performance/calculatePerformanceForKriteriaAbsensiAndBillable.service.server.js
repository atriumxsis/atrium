'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Performance = mongoose.model('Performance'),
	Placement = mongoose.model('Placement'),
	Timesheet = mongoose.model('Timesheet'),
	TimesheetTemplate = mongoose.model('TimesheetTemplate'),
	SystemConfig = mongoose.model('SystemConfig'),
	_ = require('lodash');

// =============================================================================
// helper function declaration (Kriteria Billable)
// =============================================================================
//var today = new Date();
//var refMonth = today.getMonth();
//var refYear = today.getFullYear();
//var refDay = today.getDay();

//var dateConverter = require('../../app/utils/date-converter-utils.service.server');

var isPlacementOnExternal = function(placementList, placement) {
	if(placement === undefined || placement === null || placement.client === undefined || placement.client === null) {
		return false;
	}

	var clientId = placement.client;

	for(var i = 0; i < placementList.length; i++) {
		if(placementList[i].client._id.equals(clientId)) {
			return placementList[i].client.external;
		}
	}

	return false;
};

var calculateStatusBillableFromTimesheet = function(performance, timesheetList, placementList,currentWorkingDays) {
	var jumlahHariMasuk = 0;
	var jumlahHariSakit = 0;
	var jumlahHariCuti = 0;
	var jumlahHariLibur = 0;
	var jumlahHariAlfa = 0;

	for(var i = 0; i < timesheetList.length; i++) {
		if(isPlacementOnExternal(placementList, timesheetList[i].placement)) {
			if(timesheetList[i].statusAbsensi === 'Masuk') {
				jumlahHariMasuk++;
			} else if(timesheetList[i].statusAbsensi === 'Sakit') {
				jumlahHariSakit++;
			} else if(timesheetList[i].statusAbsensi === 'Cuti') {
				jumlahHariCuti++;
			} else if(timesheetList[i].statusAbsensi === 'Alfa') {
				jumlahHariAlfa++;
			}
		}

		if(timesheetList[i].statusAbsensi === 'Libur') {
			jumlahHariLibur++;
		}
	}

	performance.kriteriaBillableUtilization.jumlahHariMasuk = jumlahHariMasuk;
	performance.kriteriaBillableUtilization.jumlahHariSakit = jumlahHariSakit;
	performance.kriteriaBillableUtilization.jumlahHariCuti = jumlahHariCuti;
	performance.kriteriaBillableUtilization.jumlahHariLibur = jumlahHariLibur;
	performance.kriteriaBillableUtilization.jumlahHariAlfa = jumlahHariAlfa;
	//console.log("totalWorkingDays : "+performance.totalWorkingDays);
	//console.log("currentWorkingDays : "+currentWorkingDays);
	// console.log("jumlahHariMasuk : "+jumlahHariMasuk);
	// console.log("jumlahHariLibur : "+jumlahHariLibur);

	performance.kriteriaBillableUtilization.kriteriaValue = ((jumlahHariMasuk + jumlahHariCuti) / (performance.totalWorkingDays - currentWorkingDays));

};

// =============================================================================
// helper function declaration (Kriteria Absensi)
// =============================================================================
var calculateStatusAbsensiFromTimesheet = function(performance, timesheetList) {
	var jumlahHariMasuk = 0;
	var jumlahHariSakit = 0;
	var jumlahHariCuti = 0;
	var jumlahHariLibur = 0;
	var jumlahHariAlfa = 0;

	for(var i = 0; i < timesheetList.length; i++) {
		if(timesheetList[i].statusAbsensi === 'Masuk') {
			jumlahHariMasuk++;
		} else if(timesheetList[i].statusAbsensi === 'Sakit') {
			jumlahHariSakit++;
		} else if(timesheetList[i].statusAbsensi === 'Cuti') {
			jumlahHariCuti++;
		} else if(timesheetList[i].statusAbsensi === 'Libur') {
			jumlahHariLibur++;
		} else if(timesheetList[i].statusAbsensi === 'Alfa') {
			jumlahHariAlfa++;
		}
	}

	performance.kriteriaAbsensi.jumlahHariMasuk = jumlahHariMasuk;
	performance.kriteriaAbsensi.jumlahHariSakit = jumlahHariSakit;
	performance.kriteriaAbsensi.jumlahHariCuti = jumlahHariCuti;
	performance.kriteriaAbsensi.jumlahHariLibur = jumlahHariLibur;
	performance.kriteriaAbsensi.jumlahHariAlfa = jumlahHariAlfa;

	performance.kriteriaAbsensi.kriteriaValue = ((jumlahHariMasuk + jumlahHariCuti) / performance.totalWorkingDays);
};

var findPlacement = function(performance, resource, year, month, timesheetList,currentWorkingDays) {
	Placement.find({user: resource}).populate('client').exec(function(err, placementList) {
		if(!err) {
			calculateStatusAbsensiFromTimesheet(performance, timesheetList);
			calculateStatusBillableFromTimesheet(performance, timesheetList, placementList,currentWorkingDays);

			performance.save();
		}
	});
};

var findTimesheet = function(performance, resource, year, month,currentWorkingDays) {
	Timesheet.find({user: resource, year: year, month: month}).populate('placement').exec(function(err, timesheetList) {
		if(!err && timesheetList !== undefined && timesheetList !== null) {
			findPlacement(performance, resource, year, month, timesheetList,currentWorkingDays);
		}
	});
};

var findOrCreatePerformance = function(resource, year, month, pengali, totalWorkingDays,currentWorkingDays,currentWorkingMonths) {
	Performance.findOne({resource: resource, year: year, month: month}).exec(function(err, performance) {
		if(!err) {
			if(performance === undefined || performance === null) {
				performance = new Performance({
					resource: resource, 
					year: year, 
					month: month, 
					totalWorkingDays: totalWorkingDays,
					rumusAkhir: pengali,
					currentWorkingDays:currentWorkingDays,
					currentWorkingMonths:currentWorkingMonths
				});
			}else{
				performance = _.extend(performance,{currentWorkingDays:currentWorkingDays,currentWorkingMonths:currentWorkingMonths});
			}
		
			findTimesheet(performance, resource, year, month,currentWorkingDays);
		}
	});
};

var findTimesheetTemplateByYear = function(resource, year, month, pengali,resourceJoinDate_asString) {
	var locYear = resourceJoinDate_asString.split('-')[0];			// Start from 1.
	var locMonth = (resourceJoinDate_asString.split('-')[1] - 1); 	// Start from 0. January is 0
	var locDay = resourceJoinDate_asString.split('-')[2];
	var currentWorkingDays =0;
	var currentWorkingMonths =0;
	var currentWorkingMonthsEdit =0;
	TimesheetTemplate.findOne({year: year}).exec(function(err, timesheetTemplate) {
		if(!err && timesheetTemplate !=	 null) {
			var totalWorkingDays = timesheetTemplate.totalWorkingDays;
			if(locYear == year){
				for(var i = 0; i <= locMonth; i++) {
					currentWorkingMonthsEdit++;
					for(var j = 0; j < timesheetTemplate.monthList[i].dayList.length; j++) {
						if((i == locMonth)&& (j >= locDay-1)){

						}else
						if(timesheetTemplate.monthList[i].dayList[j].status == 'Masuk') {
							currentWorkingDays++;
						}
					}
				}

				for(var i = 0; i < locMonth; i++) {
					currentWorkingMonths++;
				}
			}
			// console.log("currentWorkingDays : "+currentWorkingDays);
			findOrCreatePerformance(resource, year, month, pengali, totalWorkingDays,currentWorkingDays,currentWorkingMonths);
		}
	});
};

var findSystemConfigPengaliPerformance = function(resource, year, month,resourceJoinDate_asString) {
	SystemConfig.findOne({key: SystemConfig.PENGALI_PERFORMANCE}, function(err, systemConfig) {
		if(!err) {
			var pengali = systemConfig.value;

			findTimesheetTemplateByYear(resource, year, month, pengali,resourceJoinDate_asString);
		}
	});
};

var findResourceJoinDate = function(resource, year, month) {
	User.findOne({_id:resource }, function(err, user) {
		if(!err) {
			var resourceJoinDate_asString = user.joinDate_asString;

			findSystemConfigPengaliPerformance(resource, year, month,resourceJoinDate_asString);
		}
	});
};
// =============================================================================
// exported function declaration
// =============================================================================
module.exports = {
	doCalculation: findResourceJoinDate
};
