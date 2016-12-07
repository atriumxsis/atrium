'use strict';

angular.module('coorporate-events').controller('FormCoorporateEventController', ['$scope', '$http','DateConverterUtils',
    function($scope, $http, DateConverterUtils) {
        // =====================================================================
        // Non $scope member
        // =====================================================================
        var createNewEvent = function() {
            $scope.event.eventDate_asString = DateConverterUtils.convertFromDateToString($scope.eventDate_asDate);
            //$scope.event.eventDate_asDate = $scope.eventDate_asDate;
            $scope.event.eventDate_asDate = DateConverterUtils.convertFromStringToDate($scope.event.eventDate_asString);
            $scope.event.year = $scope.event.eventDate_asDate.getFullYear();
            if($scope.event.sharingKnowledge === true){
                $scope.event.mandatory = true;
            }
            $scope.formPromise = $http.post('api/coorporate-events', $scope.event).
                success(function(result) {
                    $scope.closeThisDialog();
                }).
                error(function(err) {
                    $scope.error = err.data.message;
                }
            );
        };

        var updateEvent = function() {
            $scope.event.eventDate_asString = DateConverterUtils.convertFromDateToString($scope.eventDate_asDate);
            //$scope.event.eventDate_asDate = $scope.eventDate_asDate;
            $scope.event.eventDate_asDate = DateConverterUtils.convertFromStringToDate($scope.event.eventDate_asString);
            $scope.event.year = $scope.event.eventDate_asDate.getFullYear();
            if($scope.event.sharingKnowledge === true){
                $scope.event.mandatory = true;
            }
            $scope.formPromise = $http.post('api/coorporate-events/update', $scope.event).
                success(function(event) {
                    $scope.closeThisDialog();
                }).
                error(function(err) {
                    $scope.error = err.data.message;
                }
            );
        };

        var deleteEvent = function() {
            $scope.formPromise = $http.delete('api/coorporate-events/'+ $scope.event._id +'/delete', $scope.event).
                success(function(event) {
                    $scope.closeThisDialog();
                }).
                error(function(err) {
                    $scope.error = err.data.message;
                }
            );
        };

        var cancelEvent= function() {
            $scope.closeThisDialog();
        };



        // =====================================================================
        // $scope Member
        // =====================================================================
        $scope.init = function() {
            $scope.dialogTitle = $scope.ngDialogData.dialogTitle;

            if($scope.ngDialogData.aEvent !== undefined && $scope.ngDialogData.aEvent !== null) {
                $scope.editMode = true;
                $scope.event = {
                    _id : $scope.ngDialogData.aEvent._id,
                    name : $scope.ngDialogData.aEvent.name,
                    eventDate_asString : $scope.ngDialogData.aEvent.eventDate_asString,
                    sharingKnowledge : $scope.ngDialogData.aEvent.sharingKnowledge,
                    employeeGathering : $scope.ngDialogData.aEvent.employeeGathering,
                    mandatory : $scope.ngDialogData.aEvent.mandatory
                    //eventDate_asString : $scope.eventDate_asString
                };
                $scope.eventDate_asDate = DateConverterUtils.convertFromStringToDate($scope.ngDialogData.aEvent.eventDate_asString);
            } else {

                $scope.event = {
                    _id: null,
                    name : null,
                    eventDate_asString : DateConverterUtils.todayAsString,
                    eventDate_asDate : DateConverterUtils.todayAsDate,
                    sharingKnowledge : false,
                    employeeGathering : false,
                    mandatory :false
                };
            }
            //$scope.eventDate_asDate = DateConverterUtils.convertFromStringToDate($scope.event.eventDate_asString);
            //$scope.eventDate_asString = DateConverterUtils.convertFromDateToString($scope.ngDialogData.event.eventDate_asDate);
        };

        $scope.init();

        $scope.simpan = function() {
            if($scope.editMode) {
                updateEvent();
            } else {
                createNewEvent();
            }
        };

        $scope.hapus = function() {
            deleteEvent();
        };

        $scope.cancel = function() {
            cancelEvent();
        };
        // =====================================================================
        // Event listener
        // =====================================================================

        $scope.openEventDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.eventDateOpened = !$scope.eventDateOpened;
        };
    }
]);
