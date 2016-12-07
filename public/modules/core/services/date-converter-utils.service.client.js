'use strict';

// The main purpose of this service is to remove ambiguity timezone in client and in server
angular.module('core').service('DateConverterUtils', [
	function() {
		this.convertFromDateToString = function(date) {
			var returnValue = null;

			if(date !== undefined && date !== null) {
				var year = date.getFullYear();
				var month = (date.getMonth() + 1);
				var day = date.getDate();

				returnValue = (year + '-' + month + '-' + day);
				
			}

			return returnValue;
		};

		this.convertFromStringToDate = function(dateAsString) {
			var returnValue = null;

			if(dateAsString !== undefined && dateAsString !== null) {
				var year = dateAsString.split('-')[0];			// Start from 1.
				var month = (dateAsString.split('-')[1] - 1); 	// Start from 0. January is 0
				var day = dateAsString.split('-')[2]; 			// Start from 1.

				returnValue = new Date(year, month, day);
			}

			return returnValue;
		};

		this.todayAsString = function() {
			return this.convertFromDateToString(new Date());
		};

		this.todayAsDate = function() {
			return this.convertFromStringToDate(this.todayAsString());
		};
	}
]);
