angular.module('teg.factory', [])
    .factory('Urlconfig', function() {

        var service = {};

        // service.login = "http://52.215.252.200/TEG/services/loginApi/login";
        // service.logout = "http://52.215.252.200/TEG/services/loginApi/logout";
        // service.getexchangeRates = "http://52.215.252.200/TEG/services/exchangeRateAPI/getExchangeRates";
        // service.uploadCSV = "http://52.215.252.200/TEG/services/exchangeRateAPI/uploadCSV?file";
        // service.updateExchangeRates = "http://52.215.252.200/TEG/services/exchangeRateAPI/updateExchangeRates";
        // service.getOrders = "http://52.215.252.200/TEG/services/orderAPI/getOrders";
        // service.updateOrder = "http://52.215.252.200/TEG/services/orderAPI/updateOrder/";
        // service.getBranchMatrix = "http://52.215.252.200/TEG/services/branchAPI/getBranchMatrix";
        // service.updateBranchMatrix = "http://52.215.252.200/TEG/services/branchAPI/updateBranchMatrix";
        // service.getSpecialBranchTime = "http://52.215.252.200/TEG/services/branchAPI/getSpecialBranchTime";
        // service.updateSpecialBranchTime = "http://52.215.252.200/TEG/services/branchAPI/updateSpecialBranchTime";
        // service.addSpecialBranchTime = "http://52.215.252.200/TEG/services/branchAPI/addSpecialBranchTime";
        // service.deleteSpecialBranchTime = "http://52.215.252.200/TEG/services/branchAPI/deleteSpecialBranchTime/";
        // service.deleteSpecialBranchTimeByDate = "http://52.215.252.200/TEG/services/branchAPI/deleteSpecialBranchTimeByDate/";

        service.login = "http://34.249.194.50/TEG/services/loginApi/login";
        service.logout = "http://34.249.194.50/TEG/services/loginApi/logout";
        service.getexchangeRates = "http://34.249.194.50/TEG/services/exchangeRateAPI/getExchangeRates";
        service.uploadCSV = "http://34.249.194.50/TEG/services/exchangeRateAPI/uploadCSV?file";
        service.updateExchangeRates = "http://34.249.194.50/TEG/services/exchangeRateAPI/updateExchangeRates";
        service.getOrders = "http://34.249.194.50/TEG/services/orderAPI/getOrders";
        service.updateOrder = "http://34.249.194.50/TEG/services/orderAPI/updateOrder/";
        service.getBranchMatrix = "http://34.249.194.50/TEG/services/branchAPI/getBranchMatrix";
        service.updateBranchMatrix = "http://34.249.194.50/TEG/services/branchAPI/updateBranchMatrix";
        service.getSpecialBranchTime = "http://34.249.194.50/TEG/services/branchAPI/getSpecialBranchTime";
        service.updateSpecialBranchTime = "http://34.249.194.50/TEG/services/branchAPI/updateSpecialBranchTime";
        service.addSpecialBranchTime = "http://34.249.194.50/TEG/services/branchAPI/addSpecialBranchTime";
        service.deleteSpecialBranchTime = "http://34.249.194.50/TEG/services/branchAPI/deleteSpecialBranchTime/";
        service.deleteSpecialBranchTimeByDate = "http://34.249.194.50/TEG/services/branchAPI/deleteSpecialBranchTimeByDate/";

        // service.login = "http://10.211.164.39:8100/TEG/services/loginApi/login";
        // service.logout = "http://10.211.164.39:8100/TEG/services/loginApi/logout";
        // service.getexchangeRates = "http://10.211.164.39:8100/TEG/services/exchangeRateAPI/getExchangeRates";
        // service.uploadCSV = "http://10.211.164.39:8100/TEG/services/exchangeRateAPI/uploadCSV?file";
        // service.updateExchangeRates = "http://10.211.164.39:8100/TEG/services/exchangeRateAPI/updateExchangeRates";

        // service.login = "https://www.bestforexrate.com/TEGAPI/services/loginApi/login";
        // service.logout = "https://www.bestforexrate.com/TEGAPI/services/loginApi/logout";
        // service.getexchangeRates = "https://www.bestforexrate.com/TEGAPI/services/exchangeRateAPI/getExchangeRates";
        // service.uploadCSV = "https://www.bestforexrate.com/TEGAPI/services/exchangeRateAPI/uploadCSV?file";
        // service.updateExchangeRates = "https://www.bestforexrate.com/TEGAPI/services/exchangeRateAPI/updateExchangeRates";
        // service.getOrders = "https://www.bestforexrate.com/TEGAPI/services/orderAPI/getOrders";
        // service.updateOrder = "https://www.bestforexrate.com/TEGAPI/services/orderAPI/updateOrder/";
        // service.getBranchMatrix = "https://www.bestforexrate.com/TEGAPI/services/branchAPI/getBranchMatrix";
        // service.updateBranchMatrix = "https://www.bestforexrate.com/TEGAPI/services/branchAPI/updateBranchMatrix";
        // service.getSpecialBranchTime = "https://www.bestforexrate.com/TEGAPI/services/branchAPI/getSpecialBranchTime";
        // service.updateSpecialBranchTime = "https://www.bestforexrate.com/TEGAPI/services/branchAPI/updateSpecialBranchTime";
        // service.addSpecialBranchTime = "https://www.bestforexrate.com/TEGAPI/services/branchAPI/addSpecialBranchTime";
        // service.deleteSpecialBranchTime = "https://www.bestforexrate.com/TEGAPI/services/branchAPI/deleteSpecialBranchTime/";
        // service.deleteSpecialBranchTimeByDate = "https://www.bestforexrate.com/TEGAPI/services/branchAPI/deleteSpecialBranchTimeByDate/";

        return service;


    })

.factory('TegServices', function($http, $q) {


    var TegService = {
        get: function(url, config) {

            var deferred = $q.defer();

            // var config = {
            //     headers: {
            //         'Content-type': 'application/json'
            //     }
            // };

            $http.get(url, config).then(function(data) {
                deferred.resolve(data);
            }, function(error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        },

        post: function(url, params, config) {

            var deferred = $q.defer();

            // var config = {
            //     headers: {
            //         'Content-type': 'application/json',
            //         'Authorization': 'Basic ' + auth
            //     }
            // };

            $http.post(url, params, config).then(function(data) {
                if (data.status) {


                    deferred.resolve(data);
                } else {

                }
            }, function(error) {
                console.log(error);
                deferred.reject(error);


            });
            return deferred.promise;

        },

        put: function(url, params, config) {

            var deferred = $q.defer();

            // var config = {
            //     headers: {
            //         'Content-type': 'application/json',
            //         'Accept': 'application/json'
            //     },
            //     'dataType': 'json'
            // };

            $http.put(url, params, config).then(function(data) {
                if (data.status) {

                    deferred.resolve(data);
                } else {
                    deferred.reject(data);
                }
            }, function(error) {
                console.log(error);
                document.getElementById('failureModal').style.visibility = "visible";

                setTimeout(function() {
                    document.getElementById('failureModal').style.visibility = "hidden";
                }, 3000)


            });
            return deferred.promise;
        }

    };
    return TegService;


})



.factory('LoginServices', function($rootScope, $sessionStorage, $http, $q, Urlconfig, TegServices) {

    var service = {};


    service.Login = function(encoded) {

        var postData = {};

        var url = Urlconfig.login;

        var config = {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Basic ' + encoded
            }
        };

        var deferred = $q.defer();

        $http.post(url, postData, config).then(function(data) {
            if (data.status) {


                deferred.resolve(data);

            } else {

            }
        }, function(error) {
            console.log(error);
            deferred.reject(error);


        });
        return deferred.promise;



    };


    service.SetCredentials = function(roleId, firstname, lastname, accessToken) {


        $rootScope.globals = {
            currentUser: {
                roleId: roleId,
                firstname: firstname,
                lastname: lastname,
                accessToken: accessToken
            }
        };

        $sessionStorage.user = $rootScope.globals;

        // var cookieExp = new Date();
        // cookieExp.setDate(cookieExp.getDate() + 7);
        // $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
    };



    return service;


});
