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
    _ = require('lodash');

var calculatePerformanceForKriteriaAbsensiAndBillable = require('../performance/calculatePerformanceForKriteriaAbsensiAndBillable.service.server');
//var calculatePerformanceForCollectingTimesheetAndPenilaianUser = require('../performance/calculatePerformanceForCollectingTimesheetAndPenilaianUser.service.server');

// =============================================================================
// helper function declaration
// =============================================================================
var updateRumusAkhirPerformance = function(req,res){
    var updater={
        $set : {
            rumusAkhir : {
                "pengaliBillableUtilization" : 0.6,
                "pengaliAbsensi" : 0.15,
                "pengaliTimesheetCollection" : 0.15,
                "pengaliPenilaianUser" : 0.1
            }
        }
    };
    var options ={multi:true};

    Performance.update({},updater,options,function(err){
        if(err){
            return res.send(400,{message:'Failed to update performances'});
        }else{
            res.send(200);
        }
    })
}

var calculateTimesheetPerformAndKepuasaPelanggan = function(performance){
    //console.log(performance);
    var ski = performance.kriteriaPenilaianUser.ski;
    var kompetensiPendukung = performance.kriteriaPenilaianUser.kompetensiPendukung;
    var kedisiplinan = performance.kriteriaPenilaianUser.kedisiplinan;
    var collectionDate_asString = performance.kriteriaTimesheetCollection.collectionDate_asString;
    var timesheetCollectionPerform = performance.kriteriaTimesheetCollection.perform;
    var kriteriaValuePenilaianUser = ((parseInt(ski) + parseInt(kompetensiPendukung) + parseInt(kedisiplinan)) / (4 * 3 * (12-parseInt(performance.currentWorkingMonths))));
    var kriteriaValueTimesheetCollection = (timesheetCollectionPerform) ? (1/(12-parseInt(performance.currentWorkingMonths))) : 0;

    //console.log("penilaianUser bulan ke :"+performance.month+" adalah :"+kriteriaValuePenilaianUser);
    //console.log("kepuasanPelanggan bulan ke :"+performance.month+" adalah :"+kriteriaValueTimesheetCollection);

    var updater={
        $set : {
            kriteriaPenilaianUser : {
                "kedisiplinan": kedisiplinan,
                "kompetensiPendukung" : kompetensiPendukung,
                "ski" : ski,
                "kriteriaValue" : kriteriaValuePenilaianUser
            },
            kriteriaTimesheetCollection : {
                "collectionDate_asString" : collectionDate_asString,
                "perform" : timesheetCollectionPerform,
                "kriteriaValue" : kriteriaValueTimesheetCollection
            }
        }
    };

    var options ={multi:false};

    Performance.update({_id:performance._id},updater,options,function(err){
        if(err){
            //return res.send(400,{message:'Failed to update performance with id :'+performance._id});
            return err;
        }
    });
}

var updateCurrentWorkingDaysAndMonth = function(req,res){
    var resource,month,year;
    var resourceId = req.param('resourceId');
    Performance.find({$or:[{resource:resourceId,isEvent:{$exists:false}},{resource:resourceId,isEvent:false}]}).exec(function(err,performance){
        if(err){
            return res.send(400,{message:'Failed to find performances'});
        }else if(!err && performance !== undefined && performance !== null){
            var limit = performance.length;
            var iPerformance = new Performance;
            console.log("limit :"+limit);
            for(var i=0;i<limit;i++){
                resource = performance[i].resource;
                month = performance[i].month;
                year = performance[i].year;
                calculatePerformanceForKriteriaAbsensiAndBillable.doCalculation(resource, year, month);
                //console.log(iPerformance);
                if (performance[i].kriteriaPenilaianUser !== undefined && performance[i].kriteriaPenilaianUser !== null && performance[i].kriteriaTimesheetCollection !== undefined && performance[i].kriteriaTimesheetCollection !== null){
                    calculateTimesheetPerformAndKepuasaPelanggan(performance[i]);
                }
            }
            res.send(200);
        }
    })

    //============================

    //Performance.find().stream()
    //    .on('data',function(doc,err){
    //        if((!err && doc !== undefined && doc !== null)){
    //            //var limit = performance.length;
    //            //for(var i=0;i<limit;i++){
    //                resource = doc.resource;
    //                month = doc.month;
    //                year = doc.year;
    //                calculatePerformanceForKriteriaAbsensiAndBillable.doCalculation(resource, year, month);
    //                //console.log(i);
    //            //}
    //        }
    //    })
    //    .on('error',function(err){
    //        res.send(400,{message:'Failed to find performances' + err})
    //    })
    //    .on('end',function(){
    //        res.send(200);
    //    });
}

// =============================================================================
// exported function declaration
// =============================================================================
module.exports = {
    do:updateCurrentWorkingDaysAndMonth,
    updateRA:updateRumusAkhirPerformance
}