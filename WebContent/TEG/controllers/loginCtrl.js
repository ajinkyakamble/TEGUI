angular.module("login.controller", ['teg.factory'])
    .controller('loginCtrl', function($scope, base64, $rootScope, $state, myConfig, TegServices, $http, $timeout, LoginServices, $sessionStorage, $location) {




        if ($sessionStorage.user == undefined) {

            $location.path('/');
        } else {
            if ($sessionStorage.user.currentUser.roleId == 2) {
                $location.path('/main/orders');
            } else {
                $location.path('/main/orders');
            }

        }

        $scope.checkUser = function(user) {

            $scope.postData = {}

            $scope.uservalue = $scope.user.name + ":" + $scope.user.password;

            $scope.encoded = base64.encode($scope.uservalue);
            console.log($scope.encoded);

            //LoginServices.SetCredentials(0, "Janis", "Vaz", "234234");


            $scope.loginStatus = LoginServices.Login($scope.encoded).then(function(response) {
                    console.log(response);
                    var result = response.data;

                    $scope.roleId = result.roleId;
                    $scope.firstname = result.firstName;
                    $scope.lastname = result.lastName;
                    $scope.accessToken = result.accessToken;
                    LoginServices.SetCredentials($scope.roleId, $scope.firstname, $scope.lastname, $scope.accessToken);
                    if ($sessionStorage.user.currentUser.roleId == 2) {
                        $state.go("main.orders");
                    } else {
                        $state.go("main.orders");
                    }


                },
                function(error) {

                    $scope.error = "Invalid credentials";

                    $timeout(function() {
                        $scope.error = " ";
                    }, 10000);

                });







            // $http.post('http://52.215.252.200/TEG/services/loginApi/login', $scope.postData,
            //     {
            //         headers:{ 
            //          'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
            //          'Authorization':  'Basic ZGVlcGFrLnNocml2YXNAYWRyb3NvbmljLmNvbTpURUdAMTIz'
            //         }
            //     }
            // );

        }

    });
