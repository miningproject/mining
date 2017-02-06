 'use strict';
 
var myApp = angular.module('Navigate', ['mobile-angular-ui','720kb.datepicker','angularFileUpload','ngFileUpload','highcharts-ng','angular-clockpicker']);

		myApp.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }]);
		 
		myApp.directive('validFile',function(){
		return {
			require:'ngModel',
			link:function(scope,el,attrs,ctrl){
				ctrl.$setValidity('validFile', el.val() != '');
				el.bind('change',function(){
					ctrl.$setValidity('validFile', el.val() != '');
					scope.$apply(function(){
						ctrl.$setViewValue(el.val());
						ctrl.$render();
					});
				});
				}
			}
		});
      
         myApp.service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
               var fd = new FormData();
               fd.append('file', file);
            
               $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': 'multipart/form-data'}
               })
            
               .success(function(){
				   console.log("Success");
               })
            
               .error(function(){
               });
            }
         }]);
         
         myApp.service('SplitArrayService', function () {
        	 return {
        	     SplitArray: function (array, columns) {
        	         if (array.length <= columns) {
        	             return [array];
        	         };

        	         var rowsNum = Math.ceil(array.length / columns);

        	         var rowsArray = new Array(rowsNum);

        	         for (var i = 0; i < rowsNum; i++) {
        	             var columnsArray = new Array(columns);
        	             for (var j = 0; j < columns; j++) {
        	                 var index = i * columns + j;

        	                 if (index < array.length) {
        	                     columnsArray[j] = array[index];
        	                 } else {
        	                     break;
        	                 }
        	             }
        	             rowsArray[i] = columnsArray;
        	         }
        	         return rowsArray;
        	     }
        	 }
        	 });


         myApp.filter('formatDateTime', function ($filter) {
            return function (date, format) {
                if (date) {
                    return moment(Number(date)).format(format || "HH:mm");
                }
                else
                    return "";
            };
        });
         
myApp.controller('navigateController', ['$scope','$http','$rootScope','$window','$location','SharedState', 'fileUpload', 'FileUploader', 'SplitArrayService', 'Upload','moment','AuthenticationService','$localStorage',
                                        function ($scope, $http, $rootScope, $window, $location, SharedState , fileUpload, FileUploader , SplitArrayService, Upload, moment, AuthenticationService, $localStorage) {
	console.log("Inside navigate controller");


	var username=$localStorage.currentUser.username;
    	console.log(" NC UserName: "+username);
    $scope.currentUser = username;
	$scope.stonedetails={};
	
	console.log("Event1: "+SharedState.get('event1'));
	
	$scope.logOut= function(){
		delete $localStorage.currentUser;
        $http.defaults.headers.common.Authorization = '';
		$location.path('/login');
	};
	
	$scope.stoneDetailsSave = function(stoneDetails) {
	    var apilink = "http://10.30.54.156:8086/mining/ms/stone/create";
		var stoneDetailssave = angular.toJson(stoneDetails);		
		console.log(stoneDetailssave);
		
		 $http({
		        method: 'POST',
		        url: apilink,
		        data: stoneDetailssave,
		        transformRequest: angular.identity,
		        transformResponse: angular.identity,
		        headers: {'Content-Type': 'application/json'}}
		    ).then(
		    	    function(res) {
		    	        console.log('succes !', res.data);
		    	    },
		    	    function(err) {
		    	        console.log('error...', err);
		    	    }
		    	);
	
	};
	
	$scope.getTimeDiff = function(wo) {
		var iDate = moment(wo.dtIN + ' ' + (moment(wo.tmIN).format("HH:mm")), "YYYY-MM-DD HH:mm");
		var oDate = moment(wo.dtOUT + ' ' + (moment(wo.tmOUT).format("HH:mm")), "YYYY-MM-DD HH:mm");
		var diff = moment.utc(oDate.diff(iDate)).format("HH:mm");
		return diff;		
	};
	
	$scope.workorderCreate = function(e, wo) {
		console.log(wo);
		var iDate = moment(wo.dtIN + ' ' + (moment(wo.tmIN).format("HH:mm")), "YYYY-MM-DD HH:mm");
		var oDate = moment(wo.dtOUT + ' ' + (moment(wo.tmOUT).format("HH:mm")), "YYYY-MM-DD HH:mm");
		var diff = moment.utc(oDate.diff(iDate)).format("HH:mm");
		console.log(diff);
	    var apilink = "http://10.30.54.156:8086/mining/ms/workorder/create";
	    console.log(e);
	    var woData = {
	    		empName: e,
	    		timeIN: moment(wo.tmIN).format("HH:mm"),
	    		timeOUT: moment(wo.tmOUT).format("HH:mm"),
	    		workedHours: diff
            };
	    console.log(woData);
		var woCreate = angular.toJson(woData);		
		console.log(woCreate);
		
		 $http({
		        method: 'POST',
		        url: apilink,
		        data: woCreate,
		        transformRequest: angular.identity,
		        transformResponse: angular.identity,
		        headers: {'Content-Type': 'application/json'}}
		    ).then(
		    	    function(res) {
		    	        console.log('succes !', res.data);
		    	    },
		    	    function(err) {
		    	        console.log('error...', err);
		    	    }
		    	);
	
	};

	$scope.getFile = function(){
		console.log("Calling getFile");
		$http.get("http://10.30.54.156:8086/mining/ms/getImages").then(function(response) {
			$scope.images = SplitArrayService.SplitArray(response.data,3);
			console.log($scope.images);
	    });
	};
	
	$scope.uploadFile = function(){
        var file = $scope.myFile;
               
        console.log('file is ' );
        console.dir(file);
               
        var uploadUrl = "http://10.30.54.156:8086/mining/ms/image";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };
	
	var uploader = $scope.uploader = new FileUploader({
        url: 'http://10.30.54.156:8086/mining/ms/image'
    });

    // FILTERS
  
    // a sync filter
    uploader.filters.push({
        name: 'syncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            console.log('syncFilter');
            return this.queue.length < 10;
        }
    });
  
    // an async filter
    uploader.filters.push({
        name: 'asyncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
            console.log('asyncFilter');
            setTimeout(deferred.resolve, 1e3);
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
    
    $scope.submit = function() {
        if ($scope.form.file.$valid && $scope.file) {
          $scope.upload($scope.file);
        }
      };
      
   // upload on file select or drop
      $scope.upload = function (file) {
          Upload.upload({
              url: 'http://10.30.54.156:8086/mining/ms/image',
              data: {file: file }
          }).then(function (resp) {
              /*console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);*/
        	  console.log(resp.data);
        	  $scope.getFile();
          }, function (resp) {
              console.log('Error status: ' + resp.status);
          }, function (evt) {
             /* var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);*/
          });
      };
      
      $scope.chartConfig = {
    	      chart: {
    	        type: 'column'
    	      },
    	      series: [{
    	        data: [10, 15, 12, 8, 7],
    	        id: 'series1'
    	      },{
    	        data: [1, 2, 12, 8, 7],
    	        id: 'series2'
    	      }],
    	      title: {
    	        text: 'Hello'
    	      }
      };
	
    }]);
