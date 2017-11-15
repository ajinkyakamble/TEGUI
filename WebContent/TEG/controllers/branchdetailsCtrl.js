angular.module("branchdetails.controller", ['teg.factory'])
    .controller('branchdetailsCtrl', function ($scope, $rootScope, $sessionStorage, myConfig, Urlconfig, TegServices, LoginServices, $location, $state, $mdpTimePicker) {


        $scope.showloader = true;
        $scope.readonly = true;



        if ($sessionStorage.user == undefined) {

            $location.path('/');
        }


        if ($sessionStorage.user.currentUser.roleId == 2) {
            $scope.hidebranchdetails = true;
        }

         $scope.apiTimeConvert = function(time) {
            var t = time.toString().split(" ");
            var currentapiTime = t[4];
            return currentapiTime;
        }
 

        // $scope.timeConvert = function  (time) {
        //   // Check correct time format and split into components
        // time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        //     if (time.length > 1) { // If time format correct
        //     time = time.slice (1);  // Remove full string match value
        //     time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        //     time[0] = +time[0] % 12 || 12; // Adjust hours
        //   }
        //   return time[0] + time[1] + time[2] + " " + time[5]; // return adjusted time or original string
        // }

        $scope.changemode = function() {
            $scope.readonly = !$scope.readonly;
            $scope.showloader = true;
            TegServices.get(Urlconfig.getBranchMatrix, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
            }
        }).then(function(response) {

            $scope.getBranchDetails = response.data;
            console.log($scope.getBranchDetails);

            angular.forEach($scope.getBranchDetails, function(value, key) {

              value.branchTimeList.push(value.branchTimeList.shift());

                angular.forEach(value.branchTimeList, function(value, key) {

                if(value.flag) {
                  value['opencolors'] = "#ffa602";
                  value['closecolors'] = "#ffa602";
                  value['openOrdercolors'] = "#ffa602";
                  value['closeOrdercolors'] = "#ffa602";
                }
                });  

            });

            $scope.showloader = false;            

        }, function(error) {
            console.log(error);

        });
        }

        $scope.toDate = function (dStr,format) {
          var now = new Date();
          if (format == "h:m:s") {
            now.setHours(dStr.substring(0,dStr.indexOf(":")));
            now.setMinutes(dStr.substring(3,dStr.indexOf(":")+3));
            now.setSeconds(0);
            return now;
          }else 
            return false;
          }

        var accessToken = $sessionStorage.user.currentUser.accessToken;


        TegServices.get(Urlconfig.getBranchMatrix, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
            }
        }).then(function(response) {

            $scope.getBranchDetails = response.data;
            console.log($scope.getBranchDetails);

            angular.forEach($scope.getBranchDetails, function(value, key) {

              value.branchTimeList.push(value.branchTimeList.shift());

                angular.forEach(value.branchTimeList, function(value, key) {

                
                //value['displayOpenTime'] = $scope.timeConvert(value.openTime);
                //value['displayCloseTime'] = $scope.timeConvert(value.closeTime);
                // value['opencolors'] = "#005696";
                // value['closecolors'] = "#005696";
                if(value.flag) {
                  value['opencolors'] = "#ffa602";
                  value['closecolors'] = "#ffa602";
                  value['openOrdercolors'] = "#ffa602";
                  value['closeOrdercolors'] = "#ffa602";
                }
                });  

            });

            $scope.showloader = false;

            

        }, function(error) {
            console.log(error);

        });


    //$scope.currentTime = "8:30 AM";
    $scope.showTimePickerFrom = function(time, branchId) {
      var currenttime = $scope.toDate(time,"h:m:s")
      $mdpTimePicker(currenttime, {
        targetEvent: currenttime
      }).then(function(selectedTime) {
        //$scope.branchTime.displayOpenTime = selectedDate;
        var apiTime = [];
        var date = new Date().toLocaleString();
        $scope.todayDate = date.split(" ");

                angular.forEach($scope.getBranchDetails, function(value, key) {

                angular.forEach(value.branchTimeList, function(value, key) {
                $scope.closeTime = new Date($scope.todayDate[0] + " " + value.closeTime);
                
                if(value.id == branchId){
                // if(selectedTime > $scope.closeTime){
                //     return false;
                //   }
                //   else{
                value['openTime'] = selectedTime;  
                //value['opencolors'] = "red";
                var apiTime = selectedTime.toString().split(" ");

                value['openTime'] = apiTime[4];

                if(value.opencolors){
                  delete value.opencolors;
                }
                
                //}
              }
                
                
              
                });  

            });
      });
    }

        $scope.showTimePickerTo = function(time, branchId) {
          var currenttime = $scope.toDate(time,"h:m:s")
      $mdpTimePicker(currenttime, {
        targetEvent: currenttime
      }).then(function(selectedTime) {
        //$scope.branchTime.displayOpenTime = selectedDate;
        
          var apiTime = [];
          var date = new Date().toLocaleString();
          $scope.todayDate = date.split(" ");

                angular.forEach($scope.getBranchDetails, function(value, key) {

                angular.forEach(value.branchTimeList, function(value, key) {
                $scope.openTime = new Date($scope.todayDate[0] + " " + value.openTime);


                
                if(value.id == branchId){
                  // if(selectedTime < $scope.openTime){
                  //   return false;
                  // }
                  // else{
                    //value['closeTime'] = selectedTime; 
                    //value['closecolors'] = "red"; 
                    var apiTime = selectedTime.toString().split(" ");

                    value['closeTime'] = apiTime[4];

                    if(value.closecolors){
                      delete value.closecolors;
                    }
                  //}
                }


                
               
              
                });  

            });  
        
        
      });
    }



       $scope.showOrderTimePickerFrom = function(time, branchId) {
      var currenttime = $scope.toDate(time,"h:m:s")
      $mdpTimePicker(currenttime, {
        targetEvent: currenttime
      }).then(function(selectedTime) {
        //$scope.branchTime.displayOpenTime = selectedDate;
        var apiTime = [];
        var date = new Date().toLocaleString();
        $scope.todayDate = date.split(" ");

                angular.forEach($scope.getBranchDetails, function(value, key) {

                angular.forEach(value.branchTimeList, function(value, key) {
                $scope.closeTime = new Date($scope.todayDate[0] + " " + value.orderCloseTime);
                
                if(value.id == branchId){
                // if(selectedTime > $scope.closeTime){
                //     return false;
                //   }
                //   else{
                value['orderOpenTime'] = selectedTime;  
                //value['opencolors'] = "red";
                var apiTime = selectedTime.toString().split(" ");

                value['orderOpenTime'] = apiTime[4];

                if(value.openOrdercolors){
                  delete value.openOrdercolors;
                }
                
                //}
              }
                
                
              
                });  

            });
      });
    }

        $scope.showOrderTimePickerTo = function(time, branchId) {
          var currenttime = $scope.toDate(time,"h:m:s")
      $mdpTimePicker(currenttime, {
        targetEvent: currenttime
      }).then(function(selectedTime) {
        //$scope.branchTime.displayOpenTime = selectedDate;
        
          var apiTime = [];
          var date = new Date().toLocaleString();
          $scope.todayDate = date.split(" ");

                angular.forEach($scope.getBranchDetails, function(value, key) {

                angular.forEach(value.branchTimeList, function(value, key) {
                $scope.openTime = new Date($scope.todayDate[0] + " " + value.orderOpenTime);


                
                if(value.id == branchId){
                  // if(selectedTime < $scope.openTime){
                  //   return false;
                  // }
                  // else{
                    //value['closeTime'] = selectedTime; 
                    //value['closecolors'] = "red"; 
                //-------------------15 mins code------------------------------------------//
                $scope.closeOrderTime = new Date($scope.todayDate[0] + " " + value.closeTime);
                $scope.closeOrderTime.setMinutes($scope.closeOrderTime.getMinutes() - 15 );
                $scope.closeOrderTime.setSeconds($scope.closeOrderTime.getSeconds() + 1 );

                $scope.selectedTime = $scope.apiTimeConvert(selectedTime);
                $scope.ordertime = $scope.apiTimeConvert($scope.closeOrderTime);

                if((Date.parse('01/01/1970 ' + $scope.selectedTime)) > (Date.parse('01/01/1970 ' + $scope.ordertime))){
                  $("#errorCloseTime").modal("show");
                  value['closeOrdercolors'] = "red"; 
                  return false;
                }
                //-------------------------------------------------------------------------//

                    var apiTime = selectedTime.toString().split(" ");

                    value['orderCloseTime'] = apiTime[4];

                    if(value.closeOrdercolors){
                      delete value.closeOrdercolors;
                    }
                  //}
                }


                
               
              
                });  

            });  
        
        
      });
    }

    $scope.updateMatrix = function(branchmatrix){
      $scope.showloader = true;
            console.log(branchmatrix);
            // if(branchmatrix.openTime > branchmatrix.closeTime){
            //   $("#errorDate").modal("show");
            //   return false;
            // }
            $scope.invalidDate = false;

            angular.forEach(branchmatrix, function(value, key) {
                angular.forEach(value.branchTimeList, function(value, key) {
                    var date = new Date().toLocaleString();
                    $scope.todayDate = date.split(" ");

                    $scope.openTime = new Date($scope.todayDate[0] + " " + value.openTime);
                    $scope.closeTime = new Date($scope.todayDate[0] + " " + value.closeTime);

                    $scope.openOrderTime = new Date($scope.todayDate[0] + " " + value.orderOpenTime);
                    $scope.closeOrderTime = new Date($scope.todayDate[0] + " " + value.orderCloseTime);

                    // $scope.closeValid = new Date($scope.todayDate[0] + " " + value.closeTime);
                    // $scope.closeValid.setMinutes($scope.closeValid.getMinutes() - 15 );

                    // $scope.currentOrderTime = new Date($scope.todayDate[0] + " " + value.orderCloseTime);

                    if(value.flag) {
                      value['opencolors'] = "#ffa602";
                      value['closecolors'] = "#ffa602";
                    }
                    else if($scope.openTime > $scope.closeTime){
                      $("#errorTime").modal("show");
                      $scope.invalidDate = true;
                      value['opencolors'] = "red"; 
                      value['closecolors'] = "red";                       
                    }
                    else if($scope.openOrderTime > $scope.closeOrderTime){
                      $("#errorTime").modal("show");
                      $scope.invalidDate = true;
                      value['openOrdercolors'] = "red";
                      value['closeOrdercolors'] = "red";                     
                    }
                    // else if($scope.currentOrderTime > $scope.closeValid){
                     
                    //   $("#errorCloseTime").modal("show");
                    //   value['closeOrdercolors'] = "red"; 
                    //   $scope.invalidDate = true;                  
                    // }

                });
            });

            if($scope.invalidDate == true){
              $scope.showloader = false;
            return false;
            }
      
            var accessToken = $sessionStorage.user.currentUser.accessToken;
            $scope.postData = branchmatrix;

            angular.forEach(branchmatrix, function(value, key) {
                angular.forEach(value.branchTimeList, function(value, key) {
                    delete value.opencolors;
                    delete value.closecolors;
                    delete value.openOrdercolors;
                    delete value.closeOrdercolors;
                });
            });

            console.log($scope.postData);
            TegServices.put(Urlconfig.updateBranchMatrix, $scope.postData, {
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': accessToken
                },
                'dataType': 'json'
            }).then(function(response) {

                angular.forEach($scope.getBranchDetails, function(value, key) {

                angular.forEach(value.branchTimeList, function(value, key) {

                
                //value['displayOpenTime'] = $scope.timeConvert(value.openTime);
                //value['displayCloseTime'] = $scope.timeConvert(value.closeTime);
                // value['opencolors'] = "#005696";
                // value['closecolors'] = "#005696";
                if(value.flag) {
                  value['opencolors'] = "#ffa602";
                  value['closecolors'] = "#ffa602";
                  value['openOrdercolors'] = "#ffa602";
                  value['closeOrdercolors'] = "#ffa602"; 
                }                
                });  

                });

                $scope.changemode();

                document.getElementById('successModalBranchDetails').style.visibility = "visible";

                setTimeout(function() {
                    document.getElementById('successModalBranchDetails').style.visibility = "hidden";
                }, 3000)

                $scope.showloader = false;

            }, function(error) {
                console.log(error);

            });



    } 

    $scope.cancelChanges = function() {
        $state.reload();
    }

})
.filter('tconvert', function()
    {
     return function(time){
      if(time.length > 7){
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

            if (time.length > 1) { // If time format correct
            time = time.slice (1);  // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
          }
          return time[0] + time[1] + time[2] + " " + time[5];
      }
      else{
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

            if (time.length > 1) { // If time format correct
            time = time.slice (1);  // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
          }
          return time[0];
      }
     
      }
});
