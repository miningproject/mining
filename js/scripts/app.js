'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Navigate', []);
angular.module('Home', []);

angular.module('BasicHttpAuthExample', [
    'Authentication',
    'Home',
    'Navigate',
    'ngRoute',
    'ngCookies',
    'ngResource',
    'ngStorage',
    'mobile-angular-ui',
    '720kb.datepicker',
	'angularjs-datetime-picker',
	'angularFileUpload'
])
 
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login/', {
            controller: 'LoginController',
            templateUrl: 'js/modules/authentication/views/login.html',
            hideMenus: true
        })
 
        .when('/signup/', {
            controller: 'HomeController',
            templateUrl: 'js/modules/home/views/home.html'
        })
        
        .when('/homepage/', {
        	controller: 'navigateController',
            templateUrl: 'js/modules/navigate/views/navigate.html'
        })
 
        .otherwise({ redirectTo: '/login/' });
}])  

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])
 
.run(['$rootScope', '$location', '$cookieStore', '$http', '$window', '$resource', 'SharedState', '$localStorage', '$cordovaNetwork',
      function ($rootScope, $location, $cookieStore, $http, $window, $resource, SharedState, $localStorage, $cordovaNetwork) {        
      	
        	$rootScope.$on('$locationChangeStart', function (event, next, current) {
                var publicPages = ['/login/'];
                var restrictedPage = publicPages.indexOf($location.path()) === -1;
                if (restrictedPage && !$localStorage.currentUser) {
                    $location.path('/login/');
                }
            });
        	
        	var isOnline = $cordovaNetwork.isOnline();
        	var isOffline = $cordovaNetwork.isOffline();
        	 $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        	      var onlineState = networkState;
        	      alert(onlineState);
        	 });
        	   
        	 $rootScope.$on('$cordovaNetwork:offline',function(event,networkState){
        		  var offlineState = networkState;
        	       alert(offlineState);
        	   /*  $window.confirm({
        	                        title: "Internet Disconnected",
        	                        content: "The internet is disconnected on your device."
        	                    }).then(function(result){
        	                                    ionic.Platform.exitApp();
        	                    	if(!result) {
        	                            console.log('ok clicked');
        	                          }
        	                    })*/
        	  });
       
    }]);