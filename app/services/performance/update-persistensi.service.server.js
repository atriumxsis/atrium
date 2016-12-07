'use strict';

// =============================================================================
// var declaration
// =============================================================================
var mongoose = require('mongoose'),
    Performance = mongoose.model('Performance'),
    SystemConfig = mongoose.model('SystemConfig');

// =============================================================================
// helper function declaration
// =============================================================================
var savePerformance = function(persistensiPerformance, jumlahEvent, jumlahEventHadir) {
    persistensiPerformance.kriteriaPersistensi.jumlahEvent = jumlahEvent;
    persistensiPerformance.kriteriaPersistensi.jumlahEventHadir = jumlahEventHadir;

   // persistensiPerformance.kriteriaPersistensi.kriteriaValue = (parseInt(jumlahEventHadir) / 4);
    persistensiPerformance.save();
};
//
var updatePerformance = function(resourceId, jumlahEvent, jumlahEventHadir,year,pengali) {
    Performance.findOne({resource: resourceId, year:year, isEvent:true}).exec(function(err, persistensiPerformance) {
        if(!err) {
            if(persistensiPerformance ===undefined || persistensiPerformance === null){
                persistensiPerformance = new Performance({
                    resource:resourceId,
                    year:year,
                    isEvent:true,
                    rumusAkhir:pengali
                });
            }
            savePerformance(persistensiPerformance, jumlahEvent, jumlahEventHadir);
        }
    });
};

var findSystemConfigPengaliPerformance = function(resourceId, jumlahEvent, jumlahEventHadir,year) {
    SystemConfig.findOne({key: SystemConfig.PENGALI_PERFORMANCE}, function(err, systemConfig) {
        if(!err) {
            var pengali = systemConfig.value;

            updatePerformance(resourceId, jumlahEvent, jumlahEventHadir,year,pengali);
        }

    });
};
// =============================================================================
// exported function declaration
// =============================================================================
exports.do = function(req, res) {
    var resourceId = req.body.resource;
    var jumlahEvent = req.body.kriteriaPersistensi.jumlahEvent;
    var jumlahEventHadir = req.body.kriteriaPersistensi.jumlahEventHadir;
    var year = req.body.year;
    //var kriteriaValue = (parseInt(jumlahEventHadir) / parseInt(jumlahEvent));
    //console.log(resourceId);
    //console.log(jumlahEvent);
    //console.log(jumlahEventHadir);
    //console.log('test');

    //updatePerformance(resourceId, jumlahEvent, jumlahEventHadir,year);
    findSystemConfigPengaliPerformance(resourceId, jumlahEvent, jumlahEventHadir,year);
    res.send(200);
};
