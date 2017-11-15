angular.module("main.controller", ['teg.factory'])
    .controller('mainCtrl', function($scope, $state, $rootScope, $sessionStorage, myConfig, Urlconfig, TegServices, LoginServices, $location) {

        if ($sessionStorage.user == undefined) {

            $location.path('/');
        } else {
            $scope.firstname = $sessionStorage.user.currentUser.firstname;
            $scope.lastname = $sessionStorage.user.currentUser.lastname;

            if ($sessionStorage.user.currentUser.roleId == 2) {
                $scope.hideexchangerates = true;
                $scope.hidebranchdetails = true;
                $scope.hideschedulemanager = true;
                
                $location.path('/main/orders');
            } else {
                $location.path('/main/orders');
            }
        }


        switch ($state.current.url) {
            case "/orders":
                $scope.bordervalue1 = true;
                $scope.bordervalue2 = false;
                $scope.bordervalue3 = false;
                $scope.bordervalue4 = false;
                $scope.bordervalue5 = false;
                $scope.title = "Fast Track Branch Collection";
                $state.go("main.orders");
                break;
            case "/buybackorders":
                $scope.bordervalue1 = false;
                $scope.bordervalue2 = true;
                $scope.bordervalue3 = false;
                $scope.bordervalue4 = false;
                $scope.bordervalue5 = false;
                $scope.title = "Buy Back At Branch";
                $state.go("main.buybackorders");
                break;
            case "/exchangerates":
                $scope.bordervalue1 = false;
                $scope.bordervalue2 = false;
                $scope.bordervalue3 = true;
                $scope.bordervalue4 = false;
                $scope.bordervalue5 = false;
                $scope.title = "Exchange Rates";
                $state.go("main.exchangerates");
                break;
            case "/branchdetails":
                $scope.bordervalue1 = false;
                $scope.bordervalue2 = false;
                $scope.bordervalue3 = false;
                $scope.bordervalue4 = true;
                $scope.bordervalue5 = false;
                $scope.title = "Branch Details";
                $state.go("main.branchdetails");
                break;
            case "/schedulemanager":
                $scope.bordervalue1 = false;
                $scope.bordervalue2 = false;
                $scope.bordervalue3 = false;
                $scope.bordervalue4 = false;
                $scope.bordervalue5 = true;
                $scope.title = "Schedule Manager";
                $state.go("main.schedulemanager");
                break;

        }



        $scope.changetab = function(value) {

            switch (value) {
                case "orders":
                    $scope.bordervalue1 = true;
                    $scope.bordervalue2 = false;
                    $scope.bordervalue3 = false;
                    $scope.bordervalue4 = false;
                    $scope.bordervalue5 = false;
                    $scope.title = "Fast Track Branch Collection";
                    $state.go("main.orders");
                    break;
                case "buybackorders":
                    $scope.bordervalue1 = false;
                    $scope.bordervalue2 = true;
                    $scope.bordervalue3 = false;
                    $scope.bordervalue4 = false;
                    $scope.bordervalue5 = false;
                    $scope.title = "Buy Back At Branch";
                    $state.go("main.buybackorders");
                    break;
                case "exchangerates":
                    $scope.bordervalue1 = false;
                    $scope.bordervalue2 = false;
                    $scope.bordervalue3 = true;
                    $scope.bordervalue4 = false;
                    $scope.bordervalue5 = false;
                    $scope.title = "Exchange Rates";
                    $state.go("main.exchangerates");
                    break;
                case "branchdetails":
                    $scope.bordervalue1 = false;
                    $scope.bordervalue2 = false;
                    $scope.bordervalue3 = false;
                    $scope.bordervalue4 = true;
                    $scope.bordervalue5 = false;
                    $scope.title = "Branch Details";
                    $state.go("main.branchdetails");
                    break;
                case "schedulemanager":
                    $scope.bordervalue1 = false;
	                $scope.bordervalue2 = false;
	                $scope.bordervalue3 = false;
	                $scope.bordervalue4 = false;
	                $scope.bordervalue5 = true;
                    $scope.title = "Schedule Manager";
                    $state.go("main.schedulemanager");
                    break;

            }

        }

        $scope.logout = false;


        $scope.logoutpage = function() {

            var accessToken = $sessionStorage.user.currentUser.accessToken;
            $scope.postData = {};

            TegServices.post(Urlconfig.logout, $scope.postData, {
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': accessToken
                }
            }).then(function(response) {

                delete $sessionStorage.user;
                $location.path('/');

            }, function(error) {
                console.log(error);



            });



        }



    })
