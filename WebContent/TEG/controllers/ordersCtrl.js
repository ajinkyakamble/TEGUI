angular.module("orders.controller", ['teg.factory'])
    .controller('ordersCtrl', function($scope, $rootScope, $sessionStorage, myConfig, Urlconfig, TegServices, LoginServices, $location, $mdpDatePicker, $sce) {



        if ($sessionStorage.user == undefined) {

            $location.path('/');
        }

        var accessToken = $sessionStorage.user.currentUser.accessToken;

        $scope.colName = "SELLING";


        //----------------------DatePicker-------------------------------------------//

        $scope.currentDateFrom = new Date();
        $scope.currentDateTo = new Date();
        $scope.showDatePickerFrom = function(ev) {
            $mdpDatePicker($scope.currentDateFrom, {
                targetEvent: ev
            }).then(function(selectedDate) {
                if (selectedDate > $scope.currentDateTo) {
                    return false;
                } else {
                $scope.currentDateFrom = selectedDate;
                $scope.FromDate = $scope.getDateApiFormat(selectedDate);

                $scope.getSearchApi();
                }
            });;
        };

        $scope.showDatePickerTo = function(ev) {
            $mdpDatePicker($scope.currentDateTo, {
                targetEvent: ev
            }).then(function(selectedDate) {
                if (selectedDate < $scope.currentDateFrom) {
                    return false;
                } else {
                    $scope.currentDateTo = selectedDate;
                    $scope.ToDate = $scope.getDateApiFormat(selectedDate);

                    $scope.getSearchApi();
                }

            });;
        };

        this.filterDate = function(date) {
            return moment(date).date() % 2 == 0;
        };

        $scope.showTimePicker = function(ev) {
            $mdpTimePicker($scope.currentTime, {
                targetEvent: ev
            }).then(function(selectedDate) {
                $scope.currentTime = selectedDate;
            });;
        }

        //------------------------------------------------------------------------------//

        $scope.initial = 1;
        $scope.final = 100;

        $scope.curPage = 1;
        //$scope.pageSize = 100;
        $scope.toparrow = false;
        $scope.toparrow_card = false;
        $scope.toparrow_calci = false;
        $scope.toparrow_filter = false;

        $scope.arrowtoggle = function() {
            $scope.toparrow = !$scope.toparrow;
        }
        $scope.arrowtoggle_card = function() {
            $scope.toparrow_card = !$scope.toparrow_card;
        }
        $scope.arrowtoggle_calci = function() {
            $scope.toparrow_calci = !$scope.toparrow_calci;
        }
        $scope.arrowtoggle_filter = function() {
            $scope.toparrow_filter = !$scope.toparrow_filter;
        }



        $scope.getDateApiFormat = function(value) {
            var dateSrting = value.toDateString();
            var date = dateSrting.split(" ");
            var val = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(date[1]) / 3 + 1;
            var d = date[3] + "-" + val + "-" + date[2];
            return d;
        }
        $scope.getDateOrderDisplayFormat = function(value) {
            var date = value.split(" ");
            var val = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(date[1]) / 3 + 1;
            var year = date[3].substr(2, 3);
            var d = date[2] + "/" + (val > 9 ? val : "0" + val) + "/" + year;
            return d;
        }
        $scope.getTimeOrderDisplayFormat = function(value) {
            var time = value.split(" ");
            var d = time[0] + " " + time[1];
            return d;
        }

        // 	console.log(document.getElementById('cardinput'));
        // .addEventListener('input', function (e) {
        //   e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
        // });

        $scope.showloader = true;

        $scope.selectedOrderType = {};
        $scope.selectedOrderStatus = {};
        $scope.selectedBranch = {};
        $scope.selectedCurrency = {};
        $scope.selectedCardType = {};
        $scope.selectedCardTypeCal = {};
        $scope.selectedOrderStatusSecond = {};

        $scope.selectedCurrType = {};

        $scope.orderTypeValues = [{
            'key': -1,
            'value': 'All'
        }, {
            'key': 0,
            'value': 'Buy Back'
        }, {
            'key': 1,
            'value': 'Fast Track'
        }];

        $scope.orderStatusValues = [{
            'key': -1,
            'value': 'All'
        }, {
            'key': 4,
            'value': 'Expired'
        }, {
            'key': 1,
            'value': 'Pending'
        }, {
            'key': 3,
            'value': 'Rejected'
        }, {
            'key': 2,
            'value': 'Served'
        }];

        $scope.branchData = [{
            'key': -1,
            'value': 'All'
        }];
        $scope.orderBranchValues = $scope.branchData;

        $scope.orderCurrencyValues = ["All"];

        $scope.orderTabStatusValues = [
            { id: 1, name: 'Pending', colors: '#F6A623' },
            { id: 2, name: 'Rejected', colors: '#D0011B' },
            { id: 3, name: 'Served', colors: '#417505' },
        ];
        //$scope.orderTabStatusValues.sort();

        $scope.cardTypeValues = ['UK Visa MasterCard Debit', 'UK Credit Card', 'Foreign Dr/Cr Card'];

        $scope.cardTypeValuesTab = ['Cash', 'UK Visa MasterCard Debit', 'UK Credit Card', 'Foreign Dr/Cr Card'];

        $scope.currTypeValues = [{
            'key': -1,
            'value': 'Please select range type'
        },{
            'key': 1,
            'value': 'GBP'
        }, {
            'key': 2,
            'value': 'Foreign'
        }, {
            'key': 3,
            'value': 'Total'
        }];

        $scope.dropdownSort = function(item) {
            if (item == "All") {

                return -1;
            } else {
                return item;
                //return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            }
        }
        $scope.dropdownSortBranch = function(item) {
            if (item.value == "All") {

                return -1;
            } else {
                return item.value;
                //return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            }
        }

//---------------------Api for Branch Filter ----------------------------------------//
		TegServices.get(Urlconfig.getBranchMatrix, {
        headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
        }
        }).then(function(response) {

            $scope.getBranchDetails = response.data;
            console.log($scope.getBranchDetails);

            angular.forEach($scope.getBranchDetails, function(value, key) {

            $scope.orderBranchValues.push({key: value.branchId, value: value.branchName});

            });

            //$scope.showloader = false;

            

        }, function(error) {
            console.log(error);

        });

//---------------------Api for currency filter--------------------------------------//
        TegServices.get(Urlconfig.getexchangeRates, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
            }
        }).then(function(response) {


            $scope.currencyvalues = [];
            $scope.getExchangeRates = response.data;
            console.log($scope.getExchangeRates);

            angular.forEach($scope.getExchangeRates, function(value, key) {


                $scope.orderCurrencyValues.push(value.countryName + "-" + value.currencyName);

            });

            $scope.orderCurrencyValues = $scope.orderCurrencyValues.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            })

            //$scope.orderCurrencyValues.sort();




            console.log($scope.currencyvalues);
            //$scope.showloader = false;

        }, function(error) {
            console.log(error);

        });
//---------------------------------------------------------------------------------//

        $scope.selectedOrderType.selected = $scope.orderTypeValues[0];
        $scope.selectedOrderStatus.selected = $scope.orderStatusValues[0];
        $scope.selectedBranch.selected = $scope.orderBranchValues[0];
        $scope.selectedCurrency.selected = $scope.orderCurrencyValues[0];
        $scope.selectedCardType.selected = $scope.cardTypeValuesTab[0];
        $scope.selectedCardTypeCal.selected = $scope.cardTypeValues[0];
        $scope.selectedOrderStatusSecond.selected = $scope.orderTabStatusValues[0];

        $scope.selectedCurrType.selected = $scope.currTypeValues[0];
        //-------------------------------API for first time load------------------------------------//

        $scope.searchinput = "";
        $scope.Date = new Date();
        $scope.FromDate = $scope.ToDate = $scope.getDateApiFormat($scope.Date);
        //$scope.currFrom = $scope.currTo = "";
        $scope.disableFilter = true;



        $scope.requestParams = {
            "orderType": 1,
            "orderStatus": $scope.selectedOrderStatus.selected.key,
            "startDate": $scope.FromDate, //$scope.FromDate
            "endDate": $scope.ToDate, //$scope.ToDate
            "orderId": "",
            "name": "",
            "country": "",
            "currency": "",
            "pageNo": 1,
            "branchId": -1,
            "startAmount": 0,
            "endAmount": 0,
            "amountRangeType": -1
        }

        TegServices.post(Urlconfig.getOrders, $scope.requestParams, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
            }
        }).then(function(response) {



            $scope.result = response.data;

            // $scope.servedOrders = $scope.result.totalServedOrders.toString().slice(0, ($scope.result.totalServedOrders.toString().indexOf("."))+3) + "/" + $scope.result.totalOrders.toString().slice(0, ($scope.result.totalOrders.toString().indexOf("."))+3);
            // if($scope.result.totalServedOrders.toString().indexOf(".") == -1 || $scope.result.totalOrders.toString().indexOf(".") == -1) 
            // 	$scope.servedOrders = $scope.result.totalServedOrders + "/" + $scope.result.totalOrders;

            // $scope.totalValue = $scope.result.totalServedValue.toString().slice(0, ($scope.result.totalServedValue.toString().indexOf("."))+3) + "/" + $scope.result.totalOrderValue.toString().slice(0, ($scope.result.totalOrderValue.toString().indexOf("."))+3);
            // if($scope.result.totalServedValue.toString().indexOf(".") == -1 || $scope.result.totalOrderValue.toString().indexOf(".") == -1) 
            // 	$scope.totalValue = $scope.result.totalServedValue + "/" + $scope.result.totalOrderValue;

            // $scope.servedValuePercent = $scope.result.servedValuePercentage.toString().slice(0, ($scope.result.servedValuePercentage.toString().indexOf("."))+3); + "%";
            // if($scope.result.servedValuePercentage.toString().indexOf(".") == -1) $scope.servedValuePercent = $scope.result.servedValuePercentage;

            // $scope.totalValuePercent = $scope.result.servedOrderPercentage.toString().slice(0, ($scope.result.servedOrderPercentage.toString().indexOf("."))+3); + "%";
            // if($scope.result.servedOrderPercentage.toString().indexOf(".") == -1) $scope.totalValuePercent = $scope.result.servedOrderPercentage;


            //Served Orders
            $scope.totalServedOrders = $scope.result.totalServedOrders;
            $scope.totalOrders = $scope.result.totalOrders;
            $scope.totalServedValue = $scope.result.totalServedValue;
            $scope.totalOrderValue = $scope.result.totalOrderValue;

            // $scope.servedOrders =
            //     $scope.totalServedOrders.toString().slice(0, ($scope.totalServedOrders.toString().indexOf(".")) + 3) + "/" +
            //     $scope.totalOrders.toString().slice(0, ($scope.totalOrders.toString().indexOf(".")) + 3);

            // if ($scope.totalServedOrders.toString().indexOf(".") == -1 && $scope.totalOrders.toString().indexOf(".") == -1)
            //     $scope.servedOrders = $scope.totalServedOrders + "/" + $scope.totalOrders;

            // if ($scope.totalServedOrders.toString().indexOf(".") != -1 && $scope.totalOrders.toString().indexOf(".") == -1)
            //     $scope.servedOrders = $scope.totalServedOrders.toString().slice(0, ($scope.totalServedOrders.toString().indexOf(".")) + 3) + "/" + $scope.totalOrders;

            // if ($scope.totalServedOrders.toString().indexOf(".") == -1 && $scope.totalOrders.toString().indexOf(".") != -1)
            //     $scope.servedOrders = $scope.totalServedOrders + "/" + $scope.totalOrders.toString().slice(0, ($scope.totalOrders.toString().indexOf(".")) + 3);


            //Total Value
            // $scope.totalValue = $scope.totalServedValue.toString().slice(0, ($scope.totalServedValue.toString().indexOf(".")) + 3) + "/" +
            //     $scope.totalOrderValue.toString().slice(0, ($scope.totalOrderValue.toString().indexOf(".")) + 3);

            // if ($scope.totalServedValue.toString().indexOf(".") == -1 && $scope.totalOrderValue.toString().indexOf(".") == -1)
            //     $scope.totalValue = $scope.totalServedValue + "/" + $scope.totalOrderValue;

            // if ($scope.totalServedValue.toString().indexOf(".") != -1 && $scope.totalOrderValue.toString().indexOf(".") == -1)
            //     $scope.totalValue = $scope.totalServedValue.toString().slice(0, ($scope.totalServedValue.toString().indexOf(".")) + 3) + "/" +
            //     $scope.totalOrderValue;

            // if ($scope.totalServedValue.toString().indexOf(".") == -1 && $scope.totalOrderValue.toString().indexOf(".") != -1)
            //     $scope.totalValue = $scope.totalServedValue + "/" +
            //     $scope.totalOrderValue.toString().slice(0, ($scope.totalOrderValue.toString().indexOf(".")) + 3);


            //Served Value Percent
            $scope.servedValuePercent = $scope.result.servedValuePercentage.toString().slice(0, ($scope.result.servedValuePercentage.toString().indexOf(".")) + 3); + "%";
            if ($scope.result.servedValuePercentage.toString().indexOf(".") == -1) $scope.servedValuePercent = $scope.result.servedValuePercentage;
            //$scope.servedValuePercent = Number(Math.round($scope.result.servedValuePercentage +'e2')+'e-2');
            //Total Value Percent
            $scope.totalValuePercent = $scope.result.servedOrderPercentage.toString().slice(0, ($scope.result.servedOrderPercentage.toString().indexOf(".")) + 3); + "%";
            if ($scope.result.servedOrderPercentage.toString().indexOf(".") == -1) $scope.totalValuePercent = $scope.result.servedOrderPercentage;
            //$scope.totalValuePercent = Number(Math.round($scope.result.servedOrderPercentage +'e2')+'e-2');

            $scope.data = response.data;
            console.log($scope.data);



            // if($scope.data.orderList.length > 1){
            // 	$scope.ordersheight = true;
            // }
            if ($scope.data.orderList != null) {
                if ($scope.data.orderList.length < 100) {
                    $scope.final = $scope.data.totalOrders;
                }
            }

            // if($scope.data.orderList != null){
            // $scope.totalPages = (Math.floor($scope.data.orderList.length/100)) +1;	
            // }


            //     	$rootScope.curPage = 0;
            // $scope.pageSize = 4;

            if ($scope.data != "") {
                $scope.numberOfPages = function() {
                    return Math.ceil($scope.data.orderList.length / $scope.pageSize);
                };


                angular.forEach($scope.data.orderList, function(value, key) {
                    var total = 0;
                    var d = new Date(value.orderDate);
                    var n = d.toDateString();
                    var t = d.toLocaleString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    $scope.orderDate = $scope.getDateOrderDisplayFormat(n);
                    $scope.orderTime = $scope.getTimeOrderDisplayFormat(t);
                    value['datetime'] = $scope.orderDate + " " + $scope.orderTime;

                    // if(value.servedOrderDate == null){
                    // 	value['serveddatetime'] = "Not yet served";	
                    // }
                    // else{
                    // 	var d = new Date(value.servedOrderDate);
                    // 				var n = d.toDateString();
                    // 				var t = d.toTimeString();
                    // 				$scope.servedorderDate = $scope.getDateOrderDisplayFormat(n);
                    // 				$scope.servedorderTime = $scope.getTimeOrderDisplayFormat(t);
                    // 	value['serveddatetime'] = $scope.servedorderDate + " " + $scope.servedorderTime;	
                    // }
                    $scope.orderPlacedDate = new Date(value.orderDate);
                    $scope.currentDate = new Date();
                    if(($scope.orderPlacedDate.setHours(0,0,0,0) < $scope.currentDate.setHours(0,0,0,0))){
                        value['disablestatus'] = true;
                    }
                    else{
                        value['disablestatus'] = false;
                    }


                    switch (value.orderStatus.statusName) {
                        case 'Pending':
                            value['serveddatetime'] = "Pending";
                            value['selectedOrderStatusSecond'] = { selected: { id: 1, name: value.orderStatus.statusName, colors: '#F6A623' } };
                            break;
                        case 'Rejected':
                            value['serveddatetime'] = "Rejected";
                            value['selectedOrderStatusSecond'] = { selected: { id: 1, name: value.orderStatus.statusName, colors: '#D0011B' } };
                            break;
                        case 'Expired':
                            value['serveddatetime'] = "Expired";
                            value['selectedOrderStatusSecond'] = { selected: { id: 1, name: value.orderStatus.statusName, colors: 'black' } };
                            break;
                        case 'Served':
                            var d = new Date(value.servedOrderDate);
                            var n = d.toDateString();
                            var t = d.toLocaleString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                            $scope.servedorderDate = $scope.getDateOrderDisplayFormat(n);
                            $scope.servedorderTime = $scope.getTimeOrderDisplayFormat(t);
                            value['serveddatetime'] = $scope.servedorderDate + " " + $scope.servedorderTime;
                            value['selectedOrderStatusSecond'] = { selected: { id: 1, name: value.orderStatus.statusName, colors: '#417505' } };
                            break;
                    }


                    value['selectedcardType'] = "Cash";


                    angular.forEach(value.orderDetails, function(value, key) {


                        total += value.sterlingOrGBPAmount;


                        if (value.currencyRate.toString().indexOf(".") == -1) {
                            value['currencyRate'] = value.currencyRate;
                        } else {
                            //value['currencyRate'] = Number(Math.round(value.currencyRate+'e2')+'e-2');
                            value['currencyRate'] = value.currencyRate.toString().slice(0, (value.currencyRate.toString().indexOf(".")) + 5);
                        }


                        if (value.sterlingOrGBPAmount.toString().indexOf(".") == -1) {
                            value['sterlingOrGBPAmount'] = value.sterlingOrGBPAmount;
                        } else {
                            value['sterlingOrGBPAmount'] = Number(Math.round(value.sterlingOrGBPAmount+'e2')+'e-2');
                        }

                        if (value.amount.toString().indexOf(".") == -1) {
                            value['amount'] = value.amount;
                        } else {
                            value['amount'] = Number(Math.round(value.amount+'e2')+'e-2');
                        }




                    });

                    // value.orderDetails['total'] = total.toString().slice(0, (total.toString().indexOf(".")) + 3);
                    // if (total.toString().indexOf(".") == -1) {
                    //     value.orderDetails['total'] = total;
                    // }
                    // value.orderDetails['ordercharge'] = 0;
                    // var finaltotal = Number(total) + Number(value.orderDetails.ordercharge);
                    // value.orderDetails['orderfinalCharge'] = finaltotal.toString().slice(0, (finaltotal.toString().indexOf(".")) + 3);

                    // value.orderDetails['actualtotal'] = total;
                    // value.orderDetails['total'] = Number(Math.round(total+'e2')+'e-2');
                    //     if (total.toString().indexOf(".") == -1) {
                    //         value.orderDetails['total'] = total;
                    //     }
                    value.orderDetails['actualtotal'] = value.totalOrderAmount;
                    value.orderDetails['total'] = Number(Math.round(value.totalOrderAmount+'e2')+'e-2');
                        if (total.toString().indexOf(".") == -1) {
                            value.orderDetails['total'] = value.totalOrderAmount;
                        }


                        value.orderDetails['ordercharge'] = 0.00;
                        var finaltotal = Number(value.totalOrderAmount) + Number(value.orderDetails.ordercharge);
                        value.orderDetails['orderfinalCharge'] = Number(Math.round(finaltotal+'e2')+'e-2');

                });

            }

            $scope.showloader = false;


        }, function(error) {
            console.log(error);

        });

        //----------------------------------------------------------------------------------------------------------//

        $scope.changeFilter = function(value) {

            $scope.selectedOrderStatus.selected.key = value;
            $scope.getSearchApi();
        }

        $scope.changeBranchFilter = function(value) {

            $scope.selectedBranch.selected.key = value;
            $scope.getSearchApi();
        }

        $scope.countryValue = "";
        $scope.currencyValue = "";

        $scope.changeCurrencyFilter = function(value) {
            $scope.selectedCurrency.selected = value;

            var c = value.split("-");
            if (c != "All") {
                $scope.countryValue = c[0];
                $scope.currencyValue = c[1];
            } else {
                $scope.countryValue = "";
                $scope.currencyValue = "";
            }

            $scope.getSearchApi();
        }

        $scope.currrencyRangeFilter = function(rangeValue, currFrom, currTo) {

            //$scope.selectedCurrType.selected.key = rangeValue;
            $scope.currFromDisplay = currFrom;
            $scope.currToDisplay = currTo;

            $scope.amountRangeType = rangeValue;

            // if(currFrom == undefined || currTo == undefined || currFrom == NaN || currTo == NaN){
            //     if($scope.selectedCurrType.selected.key == -1)
            //         {   
                        
            //             $scope.currError = true;
                       
            //         }
            //     $scope.currRangeError = true;
            //     return false;
            // }
            if(currFrom){
            currFrom = currFrom.replace(/,/g,'');
            }
            if(currTo){
            currTo = currTo.replace(/,/g,'');   
            }
            

            $scope.currFrom = Number(currFrom);
            $scope.currTo = Number(currTo);

            if($scope.amountRangeType == -1)
            {   
                if($scope.currFrom > $scope.currTo){
                    $scope.currRangeError = true;
                    
                }
                $scope.currError = true;
                return false;
            }
            
            

            if($scope.currFrom > $scope.currTo){
                $scope.currRangeError = true;
                return false;
            }

            if(!currFrom){
                $scope.currFrom = 0;
            }
            else{
                $scope.currFrom = Number(currFrom);
            }

            if(!currTo){
                $scope.currTo = 0;
            }
            else{
                $scope.currTo = Number(currTo);
            }

            $scope.active = true;
            $scope.getSearchApi();
        }

        $scope.getValues = function(currFrom, currTo){

            if(currFrom != undefined || currTo != undefined){
                $scope.disableFilter = false;
                 $scope.currRangeError = false;
            }
            else{
                $scope.disableFilter = true;
                $scope.currRangeError = false;
            }
        }

        $scope.removeError = function(){
            $scope.currError = false;
            $scope.active = true;
        }





        $scope.checkSearchValue = function(keyEvent, searchinput) {

            if (keyEvent.which == 13) {
                $scope.searchinput = searchinput;
                $scope.getSearchApi();
            }

        }

        $scope.blankSearch = function(searchinput) {
            
            if(searchinput == "" || searchinput == undefined){
                 $scope.searchinput = searchinput;
                 $scope.getSearchApi();
            }

        }


        $scope.getSearchApi = function(pageApi) {

            $scope.showloader = true;
            $scope.toparrow = false;
            $scope.toparrow_card = false;
            $scope.toparrow_calci = false;
            $scope.toparrow_filter = false;

            if($scope.active){
                $scope.toparrow_filter = true;
            }

            if (pageApi == undefined) {
                $scope.initial = 1;
                $scope.final = 100;
                $scope.curPage = 1;
            }
            $scope.currError = false;
            $scope.currRangeError = false;

            // if($scope.currFrom == undefined || $scope.currTo == undefined){
            //     $scope.selectedCurrType.selected.key = -1;
            //     $scope.selectedCurrType.selected = $scope.currTypeValues[0];
            // }

           // $scope.searchInputModel = $scope.searchinput;
           //  for(var i = 0; i<$scope.orderBranchValues.length; i++) {
           //      if($scope.orderBranchValues[i].value.toLowerCase().includes($scope.searchinput.toLowerCase())){
           //         $scope.selectedBranch.selected.key = $scope.orderBranchValues[i].key;
           //         $scope.searchinput = ""; 
           //         break;
           //      }  
           //  }      

            $scope.requestParams = {
                "orderType": 1,
                "orderStatus": $scope.selectedOrderStatus.selected.key,
                "startDate": $scope.FromDate,
                "endDate": $scope.ToDate,
                "orderId": $scope.searchinput,
                "name": $scope.searchinput,
                "country": $scope.countryValue,
                "currency": $scope.currencyValue,
                "pageNo": $scope.curPage,
                "branchId":$scope.selectedBranch.selected.key,
                "startAmount": $scope.currFrom,
                "endAmount": $scope.currTo,
                "amountRangeType": $scope.amountRangeType
            }

            TegServices.post(Urlconfig.getOrders, $scope.requestParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': accessToken
                }
            }).then(function(response) {

            //    $scope.searchinput =  $scope.searchInputModel;


                $scope.result = response.data;

                if($scope.currTo == 0){
                    $scope.currTo = undefined;
                }
                else{
                    $scope.currTo = $scope.currToDisplay;
                }
                if($scope.currFrom == 0){
                    $scope.currFrom = undefined;
                }
                else{
                    $scope.currFrom = $scope.currFromDisplay;
                }


                if ($scope.result != "") {


                    // $scope.servedOrders = $scope.result.totalServedOrders.toString().slice(0, ($scope.result.totalServedOrders.toString().indexOf("."))+3) + "/" + $scope.result.totalOrders.toString().slice(0, ($scope.result.totalOrders.toString().indexOf("."))+3);
                    // if($scope.result.totalServedOrders.toString().indexOf(".") == -1 || $scope.result.totalOrders.toString().indexOf(".") == -1) 
                    // 	$scope.servedOrders = $scope.result.totalServedOrders + "/" + $scope.result.totalOrders;

                    // $scope.totalValue = $scope.result.totalServedValue.toString().slice(0, ($scope.result.totalServedValue.toString().indexOf("."))+3) + "/" + $scope.result.totalOrderValue.toString().slice(0, ($scope.result.totalOrderValue.toString().indexOf("."))+3);
                    // if($scope.result.totalServedValue.toString().indexOf(".") == -1 || $scope.result.totalOrderValue.toString().indexOf(".") == -1) 
                    // 	$scope.totalValue = $scope.result.totalServedValue + "/" + $scope.result.totalOrderValue;

                    // $scope.servedValuePercent = $scope.result.servedValuePercentage.toString().slice(0, ($scope.result.servedValuePercentage.toString().indexOf("."))+3); + "%";
                    // if($scope.result.servedValuePercentage.toString().indexOf(".") == -1) $scope.servedValuePercent = $scope.result.servedValuePercentage;

                    // $scope.totalValuePercent = $scope.result.servedOrderPercentage.toString().slice(0, ($scope.result.servedOrderPercentage.toString().indexOf("."))+3); + "%";
                    // if($scope.result.servedOrderPercentage.toString().indexOf(".") == -1) $scope.totalValuePercent = $scope.result.servedOrderPercentage;

                    //Served Orders
                    $scope.totalServedOrders = $scope.result.totalServedOrders;
                    $scope.totalOrders = $scope.result.totalOrders;
                    $scope.totalServedValue = $scope.result.totalServedValue;
                    $scope.totalOrderValue = $scope.result.totalOrderValue;

                    // $scope.servedOrders =
                    //     $scope.totalServedOrders.toString().slice(0, ($scope.totalServedOrders.toString().indexOf(".")) + 3) + "/" +
                    //     $scope.totalOrders.toString().slice(0, ($scope.totalOrders.toString().indexOf(".")) + 3);

                    // if ($scope.totalServedOrders.toString().indexOf(".") == -1 && $scope.totalOrders.toString().indexOf(".") == -1)
                    //     $scope.servedOrders = $scope.totalServedOrders + "/" + $scope.totalOrders;

                    // if ($scope.totalServedOrders.toString().indexOf(".") != -1 && $scope.totalOrders.toString().indexOf(".") == -1)
                    //     $scope.servedOrders = $scope.totalServedOrders.toString().slice(0, ($scope.totalServedOrders.toString().indexOf(".")) + 3) + "/" + $scope.totalOrders;

                    // if ($scope.totalServedOrders.toString().indexOf(".") == -1 && $scope.totalOrders.toString().indexOf(".") != -1)
                    //     $scope.servedOrders = $scope.totalServedOrders + "/" + $scope.totalOrders.toString().slice(0, ($scope.totalOrders.toString().indexOf(".")) + 3);



                    //Total Value
                    // $scope.totalValue = $scope.totalServedValue.toString().slice(0, ($scope.totalServedValue.toString().indexOf(".")) + 3) + "/" +
                    //     $scope.totalOrderValue.toString().slice(0, ($scope.totalOrderValue.toString().indexOf(".")) + 3);

                    // if ($scope.totalServedValue.toString().indexOf(".") == -1 && $scope.totalOrderValue.toString().indexOf(".") == -1)
                    //     $scope.totalValue = $scope.totalServedValue + "/" + $scope.totalOrderValue;

                    // if ($scope.totalServedValue.toString().indexOf(".") != -1 && $scope.totalOrderValue.toString().indexOf(".") == -1)
                    //     $scope.totalValue = $scope.totalServedValue.toString().slice(0, ($scope.totalServedValue.toString().indexOf(".")) + 3) + "/" +
                    //     $scope.totalOrderValue;

                    // if ($scope.totalServedValue.toString().indexOf(".") == -1 && $scope.totalOrderValue.toString().indexOf(".") != -1)
                    //     $scope.totalValue = $scope.totalServedValue + "/" +
                    //     $scope.totalOrderValue.toString().slice(0, ($scope.totalOrderValue.toString().indexOf(".")) + 3);


                    //Served Value Percent
                    $scope.servedValuePercent = $scope.result.servedValuePercentage.toString().slice(0, ($scope.result.servedValuePercentage.toString().indexOf(".")) + 3); + "%";
                    if ($scope.result.servedValuePercentage.toString().indexOf(".") == -1) $scope.servedValuePercent = $scope.result.servedValuePercentage;
                    //$scope.servedValuePercent = Number(Math.round($scope.result.servedValuePercentage +'e2')+'e-2');
                    //Total Value Percent
                    $scope.totalValuePercent = $scope.result.servedOrderPercentage.toString().slice(0, ($scope.result.servedOrderPercentage.toString().indexOf(".")) + 3); + "%";
                    if ($scope.result.servedOrderPercentage.toString().indexOf(".") == -1) $scope.totalValuePercent = $scope.result.servedOrderPercentage;
                    //$scope.totalValuePercent = Number(Math.round($scope.result.servedOrderPercentage +'e2')+'e-2');


                } else {
                    $scope.servedOrders = "";
                    $scope.totalValue = "";
                    $scope.servedValuePercent = "";
                    $scope.totalValuePercent = "";
                }

                if (pageApi == undefined) {
                    $scope.initial = 1;
                    $scope.final = 100;
                    $scope.curPage = 1;
                }


                $scope.data = response.data;
                console.log(response.data);

                if ($scope.data.orderList != null) {
                    if ($scope.data.orderList.length < 100) {
                        $scope.final = $scope.data.totalOrders;
                    }
                }

                //     if($scope.data.orderList != null){
                //     $scope.totalPages = (Math.floor($scope.data.orderList.length/100)) +1;
                // }

                //     	$rootScope.curPage = 0;
                // $scope.pageSize = 4;

                if ($scope.data != "") {
                    $scope.numberOfPages = function() {
                        return Math.ceil($scope.data.orderList.length / $scope.pageSize);
                    };


                    angular.forEach($scope.data.orderList, function(value, key) {
                        var total = 0;
                        var d = new Date(value.orderDate);
                        var n = d.toDateString();
                        var t = d.toLocaleString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        $scope.orderDate = $scope.getDateOrderDisplayFormat(n);
                        $scope.orderTime = $scope.getTimeOrderDisplayFormat(t);
                        value['datetime'] = $scope.orderDate + " " + $scope.orderTime;

                        $scope.orderPlacedDate = new Date(value.orderDate);
                        $scope.currentDate = new Date();
                        if(($scope.orderPlacedDate.setHours(0,0,0,0) < $scope.currentDate.setHours(0,0,0,0))){
                            value['disablestatus'] = true;
                        }
                        else{
                            value['disablestatus'] = false;
                        }


                        switch (value.orderStatus.statusName) {
                            case 'Pending':
                                value['serveddatetime'] = "Pending";
                                value['selectedOrderStatusSecond'] = { selected: { id: 1, name: value.orderStatus.statusName, colors: '#F6A623' } };
                                break;
                            case 'Rejected':
                                value['serveddatetime'] = "Rejected";
                                value['selectedOrderStatusSecond'] = { selected: { id: 1, name: value.orderStatus.statusName, colors: '#D0011B' } };
                                break;
                            case 'Expired':
                                value['serveddatetime'] = "Expired";
                                value['selectedOrderStatusSecond'] = { selected: { id: 1, name: value.orderStatus.statusName, colors: 'black' } };
                                break;
                            case 'Served':
                                var d = new Date(value.servedOrderDate);
                                var n = d.toDateString();
                                var t = d.toLocaleString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                                $scope.servedorderDate = $scope.getDateOrderDisplayFormat(n);
                                $scope.servedorderTime = $scope.getTimeOrderDisplayFormat(t);
                                value['serveddatetime'] = $scope.servedorderDate + " " + $scope.servedorderTime;
                                value['selectedOrderStatusSecond'] = { selected: { id: 1, name: value.orderStatus.statusName, colors: '#417505' } };
                                break;
                        }



                        value['selectedcardType'] = "Cash";



                        angular.forEach(value.orderDetails, function(value, key) {

                            console.log(value.sterlingOrGBPAmount);
                            total += value.sterlingOrGBPAmount;

                            if (value.currencyRate.toString().indexOf(".") == -1) {
                                value['currencyRate'] = value.currencyRate;
                            } else {
                                //value['currencyRate'] = Number(Math.round(value.currencyRate+'e2')+'e-2');
                                value['currencyRate'] = value.currencyRate.toString().slice(0, (value.currencyRate.toString().indexOf(".")) + 5);
                            }


                            if (value.sterlingOrGBPAmount.toString().indexOf(".") == -1) {
                                value['sterlingOrGBPAmount'] = value.sterlingOrGBPAmount;
                            } else {
                                value['sterlingOrGBPAmount'] = Number(Math.round(value.sterlingOrGBPAmount+'e2')+'e-2');
                            }

                            if (value.amount.toString().indexOf(".") == -1) {
                                value['amount'] = value.amount;
                            } else {
                                value['amount'] = Number(Math.round(value.amount+'e2')+'e-2');
                            }
                        });

                        // value.orderDetails['total'] = total.toString().slice(0, (total.toString().indexOf(".")) + 3);
                        // if (total.toString().indexOf(".") == -1) {
                        //     value.orderDetails['total'] = total;
                        // }
                        // value.orderDetails['ordercharge'] = 0;
                        // var finaltotal = Number(total) + Number(value.orderDetails.ordercharge);
                        // value.orderDetails['orderfinalCharge'] = finaltotal.toString().slice(0, (finaltotal.toString().indexOf(".")) + 3);
                        
                        // value.orderDetails['actualtotal'] = total;
                        // value.orderDetails['total'] = Number(Math.round(total+'e2')+'e-2');
                        // if (total.toString().indexOf(".") == -1) {
                        //     value.orderDetails['total'] = total;
                        // }
                        value.orderDetails['actualtotal'] = value.totalOrderAmount;
                        value.orderDetails['total'] = Number(Math.round(value.totalOrderAmount+'e2')+'e-2');
                        if (total.toString().indexOf(".") == -1) {
                            value.orderDetails['total'] = value.totalOrderAmount;
                        }

                        value.orderDetails['ordercharge'] = 0.00;
                        var finaltotal = Number(value.totalOrderAmount) + Number(value.orderDetails.ordercharge);
                        value.orderDetails['orderfinalCharge'] = Number(Math.round(finaltotal+'e2')+'e-2');
                    });

                }

                $scope.showloader = false;


            }, function(error) {
                console.log(error);

            });
        }




        $scope.prevPage = function() {
            $scope.curPage = $scope.curPage - 1;
            $scope.initial = $scope.initial - 100;

            if ($scope.curPage + 1 == $scope.data.totalPages) {
                $scope.final = $scope.final - ($scope.final % 100);
            } else {
                $scope.final = $scope.final - 100;
            }
            $scope.getSearchApi('page');
        }

        $scope.nextPage = function() {
            if ($scope.curPage < $scope.data.totalPages - 1) {
                $scope.curPage = $scope.curPage + 1;
                $scope.initial = $scope.initial + 100;
                $scope.final = $scope.final + 100;
                $scope.getSearchApi('page');
            } else {
                $scope.curPage = $scope.curPage + 1;
                $scope.initial = $scope.initial + 100;
                $scope.final = $scope.data.orderList.length;
                $scope.getSearchApi('page');
            }

        }

        $scope.gotoPage = function(keyEvent, value) {
            if (keyEvent.which == 13) {
                if (Number(value) > $scope.data.totalPages) {
                    return;
                }
                $scope.curPage = Number(value);
                var page = Number(value) - 1;
                $scope.initial = 1;
                $scope.final = 100;
                if (Number(value) <= $scope.data.totalPages - 1) {
                    $scope.curPage = Number(value);
                    $scope.initial = $scope.initial + (100 * page);
                    $scope.final = $scope.final + (100 * page);
                    $scope.getSearchApi('page');
                } else {
                    $scope.initial = $scope.initial + (100 * page);
                    $scope.final = $scope.data.totalOrders % 100;
                    $scope.getSearchApi('page');
                }
            }

        }

        $scope.startsWithBranch = function(actual, expected) {
            var lowerStr = (actual + "").toLowerCase();
            
            return lowerStr.indexOf(expected.toLowerCase()) === 0;
        }

        $scope.startsWith = function(actual, expected) {
            var curr = actual.split("-");
            var lowerStr = (curr[1] + "").toLowerCase();
            return lowerStr.indexOf(expected.toLowerCase()) === 0;
        }

        $scope.calculateOrderCharge = function(selectedCard, gbpamount, orderno) {


            angular.forEach($scope.data.orderList, function(value, key) {

                if (value.orderNo == orderno) {
                    switch (selectedCard) {
                        case 'Cash':

                            value.orderDetails['ordercharge'] = 0;

                            value.orderDetails['orderfinalCharge'] = Number(Math.round((Number(gbpamount) + Number(value.orderDetails.ordercharge))+'e2')+'e-2');
                            break;
                        case 'UK Visa MasterCard Debit':
                            var cal = (0.21 / 100) * gbpamount;
                            value.orderDetails['ordercharge'] = Number(Math.round(cal+'e2')+'e-2');
                            //$scope.percentValue = '0.21%';
                            value.orderDetails['orderfinalCharge'] = Number(Math.round((Number(gbpamount) + Number(cal))+'e2')+'e-2');
                            break;
                        case 'UK Credit Card':
                            if (gbpamount <= 300)
                                var cal = 3;
                            else
                                var cal = (1 / 100) * gbpamount;
                            value.orderDetails['ordercharge'] = Number(Math.round(cal+'e2')+'e-2');
                            //$scope.percentValue 
                            //= '1% or £3';
                            value.orderDetails['orderfinalCharge'] = Number(Math.round((Number(gbpamount) + Number(cal))+'e2')+'e-2');
                            break;
                        case 'Foreign Dr/Cr Card':
                            if (gbpamount <= 700)
                                var cal = 7;
                            else
                                var cal = (7 / 100) * gbpamount;
                            value.orderDetails['ordercharge'] = Number(Math.round(cal+'e2')+'e-2');
                           // $scope.percentValue = '7% or £7';
                            value.orderDetails['orderfinalCharge'] = Number(Math.round((Number(gbpamount) + Number(cal))+'e2')+'e-2');
                            break;
                    }
                    if (gbpamount == undefined || gbpamount == "") {
                        value.orderDetails['ordercharge'] = 0.00;
                        value.orderDetails['orderfinalCharge'] = "NA";
                    }
                }

            });


        }


        $scope.clearSearch = function(searchinput) {
        	if(searchinput != ""){
        		$scope.searchinput = "";
                $scope.selectedBranch.selected.key = -1;
				$scope.getSearchApi();
        	}
            
        }

        $scope.resetCurrencyfilter = function() {
            $scope.selectedCurrType.selected = $scope.currTypeValues[0];
            $scope.amountRangeType = -1;
            $scope.currFrom = $scope.currTo = undefined;
            $scope.currFromDisplay = $scope.currToDisplay = undefined;
            $scope.active = true;
            $scope.getSearchApi();
        }


        $scope.resetAllFilters = function() {
            $scope.selectedOrderType.selected = $scope.orderTypeValues[0];
            $scope.selectedOrderStatus.selected = $scope.orderStatusValues[0];
            $scope.selectedBranch.selected = $scope.orderBranchValues[0];
            $scope.selectedCurrency.selected = $scope.orderCurrencyValues[0];


            $scope.selectedOrderType.selected.key = -1;
            $scope.selectedOrderStatus.selected.key = -1;
            $scope.selectedBranch.selected.key = -1;
            $scope.countryValue = "";
            $scope.currencyValue = "";

            //$scope.searchinput = "";

            $scope.currentDateFrom = $scope.currentDateTo = new Date();
            $scope.FromDate = $scope.ToDate = $scope.getDateApiFormat($scope.Date);

            $scope.selectedCurrType.selected = $scope.currTypeValues[0];
            $scope.amountRangeType = -1;
            //$scope.currFrom = $scope.currTo = "";
            $scope.currFrom = $scope.currTo = undefined;
            $scope.currFromDisplay = $scope.currToDisplay = undefined;
            $scope.active = false;
            $scope.toparrow_filter = false;
            $scope.getSearchApi();


        }

        $scope.clearCard = function() {
            $scope.cardinput = "";
            $scope.bank = "NA";
            $scope.country = "NA";
            $scope.number = "NA";
            $scope.type = "NA";
            $scope.brand = "NA";
            $scope.category = "NA";
        }

        $scope.clearCalculator = function() {
            $scope.charge = 0.00;
            $scope.total = 0.00;
        }


        $scope.bank = "NA";
        $scope.country = "NA";
        $scope.number = "NA";
        $scope.type = "NA";
        $scope.brand = "NA";
        $scope.category = "NA";

        $scope.getCardDetails = function(value) {

            if(value == undefined){
                $scope.bank = "NA";
                $scope.country = "NA";
                $scope.number = "NA";
                $scope.type = "NA";
                $scope.brand = "NA";
                $scope.category = "NA";
            }


            TegServices.get('https://lookup.binlist.net/' + value, {
            headers: {
                'Accept-Version': '3'
            }
        }).then(function(response) {

                $scope.cardDetails = response.data;

                $scope.bank = $scope.cardDetails.bank.name;
                $scope.country = $scope.cardDetails.country.name;
                $scope.number = value;
                $scope.type = $scope.cardDetails.type;
                $scope.brand = $scope.cardDetails.brand;
                if ($scope.cardDetails.prepaid == true) {
                    $scope.category = "Yes";
                } else if ($scope.cardDetails.prepaid == false) {
                    $scope.category = "No";
                }

                if (angular.equals({}, $scope.cardDetails.bank) == true || $scope.cardDetails.bank.name == "") {
                    $scope.bank = "NA";
                }
                if (angular.equals({}, $scope.cardDetails.country) == true || $scope.cardDetails.country.name == "") {
                    $scope.country = "NA";
                }
                if ($scope.cardDetails.type == "") {
                    $scope.type = "NA";
                }
                if ($scope.cardDetails.brand == "") {
                    $scope.brand = "NA";
                }


                console.log($scope.cardDetails);

            }, function(error) {
                console.log(error);
                $scope.bank = "NA";
                $scope.country = "NA";
                $scope.number = "NA";
                $scope.type = "NA";
                $scope.brand = "NA";
                $scope.category = "NA";


            });
        }

        $scope.statusColor = '#D0011B';
        $scope.changeColor = '.orderStatus > .btn > .ui-select-match-text{ color:' + $scope.statusColor + "; }";


        $scope.saveStatus = function(orderno, statusvalue) {



            switch (statusvalue) {
                case 'Pending':
                    $scope.statusValue = 1;
                    break;
                case 'Rejected':
                    $scope.statusValue = 3;
                    break;
                case 'Served':
                    $scope.statusValue = 2;
                    break;
            }

            TegServices.get(Urlconfig.updateOrder + orderno + '/' + $scope.statusValue, {
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': accessToken
                }
            }).then(function(response) {

                var d = new Date(Number(response.data));
                var n = d.toDateString();
                var t = d.toLocaleString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                $scope.updatedDate = $scope.getDateOrderDisplayFormat(n);
                $scope.updatedTime = $scope.getTimeOrderDisplayFormat(t);
                $scope.updatedServeTime = $scope.updatedDate + " " + $scope.updatedTime;


                angular.forEach($scope.data.orderList, function(value, key) {

                    if (value.orderNo == orderno) {
                        if (statusvalue == "Pending") {
                            value['serveddatetime'] = "Pending";
                        }
                        if (statusvalue == "Rejected") {
                            value['serveddatetime'] = "Rejected";
                        }
                        if (statusvalue == "Served") {
                            value['serveddatetime'] = $scope.updatedServeTime;
                        }

                    }

                });

                $scope.getSearchApi();





            }, function(error) {
                console.log(error);

            });


        }
        $scope.gbpamount = {amount: null};
        $scope.display_gbpamount = function(value) {
            $scope.gbpamount.amount = value;
            $scope.calculateCharge($scope.selectedCardTypeCal.selected, $scope.gbpamount.amount);            
        }



        $scope.percentValue = '0.21%';
        $scope.charge = 0;
        $scope.total = 0;

        $scope.displayCharge = function(selectedCard, gbpamount) {

                switch (selectedCard) {
                    

                    case 'UK Visa MasterCard Debit':
                        var cal = (0.21 / 100) * gbpamount;
                        $scope.charge = Number(Math.round(cal+'e2')+'e-2');
                        $scope.percentValue = '0.21%';
                        $scope.total = Number(Math.round((Number(gbpamount) + Number(cal))+'e2')+'e-2');
                        break;
                    case 'UK Credit Card':
                        if (gbpamount <= 300)
                            var cal = 3;
                        else
                            var cal = (1 / 100) * gbpamount;
                        $scope.charge = Number(Math.round(cal+'e2')+'e-2');
                        $scope.percentValue = '1% or £3';
                        $scope.total = Number(Math.round((Number(gbpamount) + Number(cal))+'e2')+'e-2');
                        break;
                    case 'Foreign Dr/Cr Card':
                        if (gbpamount <= 700)
                            var cal = 7;
                        else
                            var cal = (7 / 100) * gbpamount;
                        $scope.charge = Number(Math.round(cal+'e2')+'e-2');
                        $scope.percentValue = '7% or £7';
                        $scope.total = Number(Math.round((Number(gbpamount) + Number(cal))+'e2')+'e-2');
                        break;
                }
                if (gbpamount == undefined || gbpamount == "") {
                    $scope.charge = 0.00;
                    $scope.total = 0.00;
                }

            }
            // if (keyEvent.which == 13){
            // 		$scope.searchinput = searchinput;
            // 		$scope.getSearchApi();
            // 	}
        $scope.calculateCharge = function(selectedCard, gbpamount) {

            if (selectedCard == 'UK Visa MasterCard Debit') {
                var cal = (0.21 / 100) * gbpamount;
                $scope.charge = Number(Math.round(cal+'e2')+'e-2');
                $scope.percentValue = '0.21%';
                $scope.total = Number(Math.round((Number(gbpamount) + Number(cal))+'e2')+'e-2');
            }
            if (selectedCard == 'UK Credit Card') {
                if (gbpamount <= 300)
                    var cal = 3;
                else
                    var cal = (1 / 100) * gbpamount;
                $scope.charge = Number(Math.round(cal+'e2')+'e-2');
                $scope.percentValue = '1% or £3';
                $scope.total = Number(Math.round((Number(gbpamount) + Number(cal))+'e2')+'e-2');
            }
            if (selectedCard == 'Foreign Dr/Cr Card') {
                if (gbpamount <= 700)
                    var cal = 7;
                else
                    var cal = (7 / 100) * gbpamount;
                $scope.charge = Number(Math.round(cal+'e2')+'e-2');
                $scope.percentValue = '7% or £7';
                $scope.total = Number(Math.round((Number(gbpamount) + Number(cal))+'e2')+'e-2');
            }

            if (gbpamount == undefined || gbpamount == "") {
                $scope.charge = 0.00;
                $scope.total = 0.00;
            }
        }


    })
    // .filter('pagination', function()
    // {
    //  return function(input, start, scope)
    //  {
    //   if((input != "") && (input != undefined)){
    //   start = +start;
    //   scope.initial = 1;
    //   scope.final = 100;
    //   for(var i = 0; i < scope.curPage; i++) {
    //   	scope.initial = scope.initial + 100;
    //   	scope.final = scope.final + 100; 
    //   }
    //   if(scope.curPage == Math.floor(input.length/100)) {
    //   		scope.final = input.length;
    //   }
    //   if(input.length < 100) {
    //   	scope.final = input.length;
    //   }
    //   return input.slice(start);
    // 	}
    //  };
    // })
    // .filter('unsafe', function($sce) {
    //     return function(val) {
    //         return $sce.trustAsHtml(val);
    //     };
    // });




// var myapp = angular.module('sampleapp', [ ]);

// myapp.controller('samplecontoller', function ($rootScope, $scope) {

// $scope.initial = 1;
//   $scope.final = 10;

//  $scope.showData = function( ){

//  $rootScope.curPage = 0;
//  $scope.pageSize = 4;
//      $scope.datalists = [
//          { "name": "John","age":"16","designation":"Software Engineer1"},
//     {"name": "John2","age":"21","designation":"Software Engineer2"},
//     {"name": "John3","age":"19","designation":"Software Engineer3"},
//     {"name": "John4","age":"17","designation":"Software Engineer4"},
//     {"name": "John5","age":"21","designation":"Software Engineer5"},
//     {"name": "John6","age":"31","designation":"Software Engineer6"},
//     {"name": "John7","age":"41","designation":"Software Engineer7"},
//     {"name": "John8","age":"16","designation":"Software Engineer8"},
//     {"name": "John18","age":"16","designation":"Software Engineer9"},
//     {"name": "John28","age":"16","designation":"Software Engineer10"},
//     {"name": "John38","age":"16","designation":"Software Engineer11"},
//     {"name": "John48","age":"16","designation":"Software Engineer12"},
//     {"name": "John58","age":"16","designation":"Software Engineer13"},
//     {"name": "John68","age":"16","designation":"Software Engineer14"},
//     {"name": "John68","age":"16","designation":"Software Engineer15"},
//         {"name": "John6","age":"31","designation":"Software Engineer6"},
//     {"name": "John7","age":"41","designation":"Software Engineer7"},
//     {"name": "John8","age":"16","designation":"Software Engineer8"},
//     {"name": "John18","age":"16","designation":"Software Engineer9"},
//     {"name": "John28","age":"16","designation":"Software Engineer10"},
//     {"name": "John38","age":"16","designation":"Software Engineer11"},
//     {"name": "John48","age":"16","designation":"Software Engineer12"},
//     {"name": "John58","age":"16","designation":"Software Engineer13"},
//     {"name": "John68","age":"16","designation":"Software Engineer14"},
//     {"name": "John68","age":"16","designation":"Software Engineer15"}
// ]
//      $scope.numberOfPages = function() {
// 				return Math.ceil($scope.datalists.length / $scope.pageSize);
// 			};

// }

// $scope.gotopage = function(value) {
// 				$rootScope.curPage = value;
// 			};

// });

// angular.module('sampleapp').filter('pagination', function()
// {
//  return function(input, start, scope)
//  {
//  //console.log(input);
//   start = +start;
//  	scope.initial = 1;
//   scope.final = 10;
//   for(var i = 0; i < scope.curPage; i++) {
//   	scope.initial = scope.initial + 10;
//   	scope.final = scope.final + 10; 
//   }
//   if(scope.curPage == Math.floor(input.length/10)) {
//   		scope.final = input.length;
//   }
//   return input.slice(start); 
//   }
//  });



// <div ng-app="sampleapp">
//     <div ng-controller="samplecontoller" ng-init="showData()">


//         <ul>
//             <li class="paginationclass" style="font-weight:bold;"><span>Name</span><span>Age</span><span>Designation</span></li>            
//  <li class="paginationclass" ng-repeat="datalist in datalists | pagination: curPage * pageSize : this | limitTo: pageSize">
//      <div><span>{{ datalist.name }} </span><span>{{ datalist.age }}</span><span>{{ datalist.designation }}</span></div> 
//  </li>
// </ul> 

// <input type ="text" ng-model="value" ng-change="gotopage(value)"/>

//     <div class="pagination pagination-cente#D0011B" ng-show="datalists.length">
// <ul class="pagination-controle pagination">
//  <li>
//   <button type="button" class="btn btn-primary" ng-disabled="curPage == 0"
//  ng-click="curPage=curPage-1"> &lt; PREV</button>
//  </li>
//  <li>

//  </li>
//  <li>
//  <button type="button" class="btn btn-primary"
//  ng-disabled="curPage >= datalists.length/final"
//  ng-click="curPage = curPage+1">NEXT &gt;</button>
//  </li>
//  <li class="pageinfo">Showing <b>{{initial}} - {{final}}</b> out of <b>{{datalists.length}}</b></li>

// </ul>
// </div>



//     </div>
// </div>
