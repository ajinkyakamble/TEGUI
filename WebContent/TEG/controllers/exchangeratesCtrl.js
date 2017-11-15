angular.module("exchangerates.controller", ['teg.factory'])
    .controller('exchangeratesCtrl', function($timeout, $scope, $rootScope, $sessionStorage, myConfig, Urlconfig, TegServices, LoginServices, $location, $state) {

        $scope.readonly = true;
        $scope.showloader = true;

        if ($sessionStorage.user == undefined) {

            $location.path('/');
        }


        if ($sessionStorage.user.currentUser.roleId == 2) {
            $scope.hideexchangerates = true;
        }

        $scope.changemode = function() {
            $scope.readonly = !$scope.readonly;
            $scope.showloader = true;
            TegServices.get(Urlconfig.getexchangeRates, {
                    headers: {
                        'Content-Type': 'application/json',
                        'access_token': accessToken
                    }
                }).then(function(response) {
                    $scope.getExchangeRates = response.data;
                    console.log($scope.getExchangeRates);

                    $scope.showloader = false;

                }, function(error) {
                    console.log(error);

                    $scope.showloader = false;

                });

        }

        var accessToken = $sessionStorage.user.currentUser.accessToken;


        TegServices.get(Urlconfig.getexchangeRates, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
            }
        }).then(function(response) {

            $scope.getExchangeRates = response.data;
            console.log($scope.getExchangeRates);

            $scope.showloader = false;

            // $scope.getExchangeRates.sort(function(a, b) { return a.displayOrder - b.displayOrder; });



            // angular.forEach($scope.getExchangeRates, function(value, key) {
            //      $scope.value = value; 
            //      if($scope.value.status == true){
            //        $scope.value['stock'] = "YES";  
            //      }
            //      else{
            //        $scope.value['stock'] = "NO"; 
            //      }

            //      console.log($scope.getExchangeRates);
            // });

            //    angular.forEach($scope.getExchangeRates, function(value, key) {
            //      $scope.date = value; 
            //      var isoDate = [];

            //      var p = Number($scope.date.uploadedDate);
            //      var date = new Date(p);
            //      var isoDate = date.toISOString().split("T");
            //      var formattedDate = isoDate[0].split("-");


            //      $scope.date['formattedDate'] = formattedDate[2] + "-" + formattedDate[1] + "-" + formattedDate[0];  

            //      console.log($scope.getExchangeRates);
            //    });

        }, function(error) {
            console.log(error);

        });

        $scope.uploadFile = function() {
            var file = $scope.myFile;
            $(this).attr("value", "");

            console.log('file is ');
            console.dir(file);

            if(file.name != "ExchangeRates.csv"){
                $("#errorFile").modal("show");
                return false;
            }

            var uploadUrl = Urlconfig.uploadCSV;
            $scope.uploadFileToUrl(file, uploadUrl);
        };

        $scope.uploadFileToUrl = function(file, uploadUrl) {

            $scope.showloader = true;

            var accessToken = $sessionStorage.user.currentUser.accessToken;

            var fd = new FormData();
            fd.append("file", file);

            // console.log(fd.get("file"));

            TegServices.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'access_token': accessToken
                }

            }).then(function(data) {
                var accessToken = $sessionStorage.user.currentUser.accessToken;
                // alert("hi");

                TegServices.get(Urlconfig.getexchangeRates, {
                    headers: {
                        'Content-Type': 'application/json',
                        'access_token': accessToken
                    }
                }).then(function(response) {
                    $scope.getExchangeRates = response.data;
                    console.log($scope.getExchangeRates);

                    $scope.showloader = false;

                }, function(error) {
                    console.log(error);

                    $scope.showloader = false;

                });


            }, function(error) {
                console.log(error);

            });
        }


        $scope.successModal = false;
        $scope.update = function(data) {

            var accessToken = $sessionStorage.user.currentUser.accessToken;
            $scope.postData = data;

            TegServices.put(Urlconfig.updateExchangeRates, $scope.postData, {
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': accessToken
                },
                'dataType': 'json'
            }).then(function(response) {

                console.log(response.data);
                $scope.readonly = !$scope.readonly;
                $scope.showloader = true;
                TegServices.get(Urlconfig.getexchangeRates, {
                    headers: {
                        'Content-Type': 'application/json',
                        'access_token': accessToken
                    }
                }).then(function(response) {
                    $scope.getExchangeRates = response.data;
                    console.log($scope.getExchangeRates);

                    $scope.showloader = false;

                    $scope.successModal = true;

                    $timeout( function(){
                            $scope.successModal = false;
                    }, 3000 );

                }, function(error) {
                    console.log(error);                    
                    $scope.showloader = false;
                });                

            }, function(error) {
                console.log(error);

            });

        }

    $scope.cancelChanges = function() {
        $state.reload();
    }


    })
    .directive('fileModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(evt) {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                        evt.target.value = "";
                    });
                    document.getElementById("test").classList.remove("open");
                    scope.uploadFile();
                });
            }
        };
    }])  



//     .service('fileUpload', ['$http', function ($http) {
//             this.uploadFileToUrl = function(file, uploadUrl){
//                var fd = new FormData();
//                fd.append("file", file);

//                // console.log(fd.get("file"));

//                $http.post(uploadUrl, fd, {
//                   transformRequest: angular.identity,
//                   headers: {
//                 'Content-Type': undefined
//                 }

//                }).then(function(data) {
//                 alert("hi");
//             }, function (error) {
//                 console.log(error);



//             });
//             }
// }]);
