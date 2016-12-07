'use strict';

angular.module('ero-placement').controller('EroListEventController', ['$scope', '$http','$filter', 'DateConverterUtils',
    function ($scope, $http, $filter, DateConverterUtils) {
        // =====================================================================
        // Non $scope member
        // =====================================================================
        var today = new Date();
        var month = today.getMonth();
        var year = today.getFullYear();

        var retrieveListEvent = function () {
            $scope.eventPromise = $http.get('api/coorporate-events/' + $scope.ngDialogData.aResource.joinDate_asString + '/year/' + year).
                success(function (coorporateEventList) {
                    $scope.coorporateEventList = coorporateEventList;
                }).
                error(function (err) {
                    $scope.error = err.data.message;
                }
            );
        };

        var retrieveCheckedEvent = function () {
            $scope.eventPromise = $http.get('api/coorporate-events/peserta/' + $scope.ngDialogData.aResource._id + '/year/' + year).
                success(function (coorporateEventList) {
                    $scope.checkedEventList = coorporateEventList;
                    if ($scope.checkedEventList.length !== 0) {
                        $scope.isSk1 = false;
                        angular.forEach($scope.checkedEventList, function (value) {
                            var key = value._id;
                            var json = {};
                            json[key] = true;
                            $scope.selection.idx = angular.extend($scope.selection.idx, json);
                            if (value.sharingKnowledge) {
                                //$scope.checked++;
                                $scope.sk1 = value;
                                $scope.isSk1 = true;
                                //console.log(k +':'+$scope.sk1);
                            }
                            if(value.employeeGathering){
                                $scope.eg = value;
                            }
                            //if($scope.sk1 != null && $scope.sk1 != value && value.sharingKnowledge){
                            //    $scope.sk2 = value;
                            //    console.log($scope.sk2);
                            //}
                        });
                        if ($scope.isSk1) {
                            angular.forEach($scope.checkedEventList, function (value) {
                                if (value.sharingKnowledge && value !== $scope.sk1) {
                                    //$scope.checked++;
                                    $scope.sk2 = value;
                                    //$scope.isSk1 = true;
                                    //console.log(k +':'+$scope.sk1);
                                }
                            });
                        }
                    }
                    console.log($scope.selection);
                }).
                error(function (err) {
                    $scope.error = err.data.message;
                }
            );
        };

        var isCreateMode = function () {
            return ($scope.checkedEventList === undefined || $scope.checkedEventList === null);
        };

        var init = function () {
            $scope.limit = 2;
            $scope.checked = 0;
            $scope.selection = {};
            $scope.selection.idx = {};
            $scope.performance = {};
            $scope.coorporateEventList={};
            $scope.performance.resource = {};
            $scope.performance.kriteriaPersistensi = {};
            $scope.performance.kriteriaPersistensi.jumlahEvent = {};
            $scope.performance.kriteriaPersistensi.jumlahEventHadir = {};
            // $scope.performance.kriteriaPersistensi.kriteriaValue={};
            retrieveListEvent();
            retrieveCheckedEvent();
            // Create Placement
            //if (isCreateMode()) {
            //
            //}
            //// Edit Placement
            //else {
            //
            //}
        };

        init();

        // =====================================================================
        // $scope Member
        // =====================================================================
        //$scope.checkChanged = function (selection, id) {
        //    if (selection.idx[id]) $scope.checked++;
        //    else $scope.checked--;
        //};

        function getEventById(id) {
            for (var i = 0; i < $scope.coorporateEventList.length; i++) {
                if ($scope.coorporateEventList[i]._id === id) {
                    return $scope.coorporateEventList[i];
                }
            }
        }

        $scope.$watch(function () {
            return $scope.selection.idx;
        }, function (value) {
            $scope.selection.objects = [];
            angular.forEach($scope.selection.idx, function (v, k) {
                v && $scope.selection.objects.push(getEventById(k));
            });
        }, true);



        var updatePerformance = function () {
            var pembagiBawah;
            var pembagiAtas;
            var mandatoryOnlyFiltered;
            var allEventWithSK = $filter('filter')($scope.coorporateEventList,{mandatory:true});
            var sKOnly = $filter('filter')($scope.coorporateEventList,{mandatory:true,sharingKnowledge:true});
            if(sKOnly.length > 1){
                pembagiBawah = (allEventWithSK.length - sKOnly.length) + 1;
            }else{
                pembagiBawah = allEventWithSK.length;
            }
            if (pembagiBawah >4){
                pembagiBawah = 4;
            }
            //console.log('pembagi bawah :'+pembagiBawah);


            var allAttendedEventWithSK = $scope.selection.objects;
            var attendedSK = $filter('filter')($scope.selection.objects,{sharingKnowledge:true});
            if(attendedSK.length > 1){
                pembagiAtas = (allAttendedEventWithSK.length - attendedSK.length) + 1;
            }else {
                pembagiAtas = allAttendedEventWithSK.length;
            }
            //console.log('pembagiAtas :'+pembagiAtas);
            //var withoutMandatoryEvent = $filter('filter')($scope.selection.objects,{mandatory:false});
            var mandatoryOnly = $filter('filter')($scope.selection.objects,{mandatory:true});
            //var mandatoryOnly = $filter('filter')(pembagiAtas,{mandatory:true});
            if(attendedSK.length > 1){
                mandatoryOnlyFiltered = (mandatoryOnly.length - attendedSK.length) + 1;
            }else{
                mandatoryOnlyFiltered = mandatoryOnly.length;
            }

            if(pembagiAtas === pembagiBawah){
                if(pembagiAtas === mandatoryOnlyFiltered){
                    $scope.performance.kriteriaPersistensi.jumlahEventHadir = pembagiAtas;
                }else {
                    $scope.performance.kriteriaPersistensi.jumlahEventHadir = mandatoryOnlyFiltered;
                }
            }else{
                //console.log('pembagiAtas2 :'+pembagiAtas);
                $scope.performance.kriteriaPersistensi.jumlahEventHadir = pembagiAtas;
            }
            //console.log('jumlahEventHadir :'+$scope.performance.kriteriaPersistensi.jumlahEventHadir);

            $scope.performance.kriteriaPersistensi.jumlahEvent = pembagiBawah;
            //$scope.performance.kriteriaPersistensi.jumlahEventHadir = $scope.selection.objects.length;
            $scope.performance.resource = $scope.ngDialogData.aResource._id;
            $scope.performance.year = year;
            $scope.eventPromise = $http.post('api/performance/update-persistensi', $scope.performance).
                success(function () {
                    $scope.closeThisDialog();
                }).
                error(function (err) {
                    $scope.error = err.data.message;

                }
            );
        };

        $scope.simpan = function () {
            var peserta = $scope.ngDialogData.aResource;
            var successFlag1 = true;
            var successFlag2 = true;
            var listAllEvent = $scope.coorporateEventList;
            var listEvent = $scope.selection.objects;

            var pullEvent = window._.filter(listAllEvent, function (obj) {
                return !_.findWhere(listEvent, obj);
            });
            //console.log(pullEvent);
            updatePerformance();

            for (i = 0; i < listEvent.length; i++) {
                $scope.eventPromise = $http.post('api/coorporate-events/' + listEvent[i]._id + '/peserta/' + peserta._id + '/update', $scope.coorporateEvent).
                    success(function () {
                        successFlag1 = true;
                    }).
                    error(function (err) {
                        $scope.error = err.data.message;
                        successFlag1 = false;
                    }
                );

            }

            for (var i = 0; i < pullEvent.length; i++) {
                $scope.eventPromise = $http.post('api/coorporate-events/' + pullEvent[i]._id + '/peserta/' + peserta._id + '/delete', $scope.coorporateEvent).
                    success(function () {
                        successFlag2 = true;
                    }).
                    error(function (err) {
                        $scope.error = err.data.message;
                        successFlag2 = false;
                    }
                );

            }

            if (successFlag1 && successFlag2) {
                $scope.closeThisDialog();
            } else {
                console.log('looping gagal');
            }
        };

        // =====================================================================
        // Event listener
        // =====================================================================

        $scope.openEventDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.eventDateOpened = !$scope.eventDateOpened;
        };
    }
]);
