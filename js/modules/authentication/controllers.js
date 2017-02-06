'use strict';
 
angular.module('Authentication')
 
.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService', '$window', '$localStorage',
    function ($scope, $rootScope, $location, AuthenticationService, $window, $localStorage) {

        initController();
        
        function initController() {
            AuthenticationService.Logout();
        };       
 
        $scope.login = function () {
            $scope.dataLoading = true;
            console.log($scope.username);
            console.log($scope.password);
            AuthenticationService.Login($scope.username, $scope.password, function(response) {
                if(response === true) {
/*                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $window.localStorage.setItem('currentUser', $scope.username);*/
                    $scope.currentUser = $localStorage.currentUser.username;
                    console.log("Inside Login");
                    $location.path('/homepage/');
                } else {
                    $scope.error = 'Username or password is incorrect';
                    $scope.dataLoading = false;
                 /*   $window.localStorage.removeItem('currentUser');*/
                }
            });
        };
    }]);