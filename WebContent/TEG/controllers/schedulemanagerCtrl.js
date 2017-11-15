angular.module("schedulemanager.controller", ['teg.factory'])
    .controller('schedulemanagerCtrl', function ($scope, $rootScope, $sessionStorage, myConfig, Urlconfig, TegServices, LoginServices, $location, $mdpDatePicker, $mdpTimePicker) {


       if ($sessionStorage.user == undefined) {

            $location.path('/');
        }


        if ($sessionStorage.user.currentUser.roleId == 2) {
            $scope.hideschedulemanager = true;
        }

        $scope.readonly = true;
        $scope.showloader = true;
        $scope.branchavailable = 0;

        $scope.changemode = function(index) {

            angular.forEach($scope.getSpecialBranchTime, function(value, key) {
                if(value.date == index){
                    value.readonly = !value.readonly;
                }

            });

            
        }


        var accessToken = $sessionStorage.user.currentUser.accessToken;

        $scope.currentDateFrom = new Date();
        $scope.currentDateTo = new Date();
        $scope.showDatePickerFrom = function(ev) {
            $mdpDatePicker($scope.currentDateFrom, {
                targetEvent: ev
            }).then(function(selectedDate) {
                
                $scope.currentDateFrom = selectedDate;
                
                
            });;
        };

        $scope.showDatePickerTo = function(ev) {
            $mdpDatePicker($scope.currentDateTo, {
                targetEvent: ev
            }).then(function(selectedDate) {
                
                    $scope.currentDateTo = selectedDate;
                    
                

            });;
        };

        $scope.apiTime = function(time) {
            var t = time.toString().split(" ");
            var currentapiTime = t[4];
            return currentapiTime;
        }

        $scope.currentTimeBranchFrom = new Date();
        $scope.currentTimeBranchFrom.setHours(0);
        $scope.currentTimeBranchFrom.setMinutes(0);

        $scope.openBranchTimeFrom = $scope.apiTime($scope.currentTimeBranchFrom);

        $scope.currentTimeBranchTo = new Date();
        $scope.currentTimeBranchTo.setHours(0);
        $scope.currentTimeBranchTo.setMinutes(0);
        $scope.openBranchTimeTo = $scope.apiTime($scope.currentTimeBranchTo);
        $scope.showTimePickerBranchFrom = function(ev) {
        $mdpTimePicker($scope.currentTimeBranchFrom, {
        targetEvent: ev
      }).then(function(selectedTime) {

                // var apiTime = selectedTime.toString().split(" ");

                // $scope.openBranchTimeFrom = apiTime[4];
                $scope.currentTimeBranchFrom = selectedTime;
      });;
    }  
    $scope.showTimePickerBranchTo = function(ev) {
        $mdpTimePicker($scope.currentTimeBranchTo, {
        targetEvent: ev
      }).then(function(selectedTime) {
        // var apiTime = selectedTime.toString().split(" ");

        // $scope.openBranchTimeTo = apiTime[4];
        $scope.currentTimeBranchTo = selectedTime;
      });;
    }

        $scope.currentTimeOrderFrom = new Date();
        $scope.currentTimeOrderFrom.setHours(0);
        $scope.currentTimeOrderFrom.setMinutes(0);

        $scope.openOrderTimeFrom = $scope.apiTime($scope.currentTimeOrderFrom);

        $scope.currentTimeOrderTo = new Date();
        $scope.currentTimeOrderTo.setHours(0);
        $scope.currentTimeOrderTo.setMinutes(0);

        $scope.openOrderTimeTo = $scope.apiTime($scope.currentTimeOrderTo);  

        $scope.showTimePickerOrderFrom = function(ev) {
        $mdpTimePicker($scope.currentTimeOrderFrom, {
        targetEvent: ev
      }).then(function(selectedTime) {

        // var apiTime = selectedTime.toString().split(" ");

        // $scope.openOrderTimeFrom = apiTime[4];
        $scope.currentTimeOrderFrom = selectedTime;

      });;
    }  
    $scope.showTimePickerOrderTo = function(ev) {
        $mdpTimePicker($scope.currentTimeOrderTo, {
        targetEvent: ev
      }).then(function(selectedTime) {



        // var apiTime = selectedTime.toString().split(" ");

        // $scope.openOrderTimeTo = apiTime[4];
        $scope.currentTimeOrderTo = selectedTime;


      });;
    }  

//---------------------Api for Branch Filter ----------------------------------------//
        $rootScope.getBranchForAdd = function(){
        TegServices.get(Urlconfig.getBranchMatrix, {
        headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
        }
        }).then(function(response) {

            $scope.getBranchDetails = response.data;
            console.log($scope.getBranchDetails);

        angular.forEach($scope.getBranchDetails, function(value, key) {
        
        value['selected'] = "0";     

        }); 

        $scope.showloader = false;


        }, function(error) {
            console.log(error);

        });
    }

//-----------------------API to get special branch time------------------------//
        $rootScope.getSpecialBranchTime = function(scheduleIndex){

         TegServices.get(Urlconfig.getSpecialBranchTime, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
            }
        }).then(function(response) {

            $scope.getSpecialBranchTime = response.data;
            console.log($scope.getSpecialBranchTime);

            angular.forEach($scope.getSpecialBranchTime, function(value, key) {
                
                value['readonly'] = true;  

                //-------------------To get format 21st March 2017-----------------------//
                var d = new Date(value.date);
                var options = { year: 'numeric', month: 'long', day: 'numeric' };
                var n = d.toLocaleDateString('en-US', options);

                var displayDate = n.split(" ");

                $scope.getGetOrdinal = function (n) {
                    var s=["th","st","nd","rd"],
                    v=n%100;
                    return n+(s[(v-20)%10]||s[v]||s[0]);
                }

                if(displayDate[1].length == 3)
                    var day = $scope.getGetOrdinal(displayDate[1].substring(0, 2));
                else
                    var day = $scope.getGetOrdinal(displayDate[1].substring(0, 1));
                
                value['displayDate'] = day + " " + displayDate[0] + ", " + displayDate[2];
                //------------------------------------------------------------------------//
              
            }); 

            angular.forEach($scope.getSpecialBranchTime, function(value, key) {
                if(value.date == scheduleIndex){
                    if(scheduleIndex != undefined){
                        value.readonly = false;
                    }
                }

            });

            
            

            $scope.showloader = false;

        }, function(error) {
            console.log(error);

        });
}       
//-----------------------------------------------------------------------------//


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

        $scope.showTimePickerFrom = function(time, branchId) {
          var currenttime = $scope.toDate(time,"h:m:s")
          $mdpTimePicker(currenttime, {
            targetEvent: currenttime
          }).then(function(selectedTime) {
        $scope.specialBranchTimeFrom = selectedTime;

        var apiTime = [];
        var date = new Date().toLocaleString();
        $scope.todayDate = date.split(" ");

                angular.forEach($scope.getSpecialBranchTime, function(value, key) {

                angular.forEach(value.specialBranchTimeList, function(value, key) {
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
        $scope.specialBranchTimeTo = selectedTime;
        
          var apiTime = [];
          var date = new Date().toLocaleString();
          $scope.todayDate = date.split(" ");

                angular.forEach($scope.getSpecialBranchTime, function(value, key) {

                angular.forEach(value.specialBranchTimeList, function(value, key) {
                $scope.openTime = new Date($scope.todayDate[0] + " " + value.openTime);

                //-------------------15 mins code------------------------------------------//
                //$scope.closeOrderTime = new Date($scope.todayDate[0] + " " + value.closeTime);
                //$scope.closeOrderTime.setMinutes($scope.closeOrderTime.getMinutes() - 15 );
                // else if(selectedTime > $scope.closeOrderTime){
                //   return false;
                // }
                //-------------------------------------------------------------------------//
                
                if(value.id == branchId){
                  // if(selectedTime < $scope.openTime){
                  //   return false;
                  // }
                  // else{
                    value['closeTime'] = selectedTime; 
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
        $scope.specialBranchTimeFrom = selectedTime;

        var apiTime = [];
        var date = new Date().toLocaleString();
        $scope.todayDate = date.split(" ");

                angular.forEach($scope.getSpecialBranchTime, function(value, key) {

                angular.forEach(value.specialBranchTimeList, function(value, key) {
                $scope.closeTime = new Date($scope.todayDate[0] + " " + value.closeTime);
                
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
        $scope.specialBranchTimeTo = selectedTime;
        
          var apiTime = [];
          var date = new Date().toLocaleString();
          $scope.todayDate = date.split(" ");

                angular.forEach($scope.getSpecialBranchTime, function(value, key) {

                angular.forEach(value.specialBranchTimeList, function(value, key) {
                $scope.openTime = new Date($scope.todayDate[0] + " " + value.openTime);

                //-------------------15 mins code------------------------------------------//
                //$scope.closeOrderTime = new Date($scope.todayDate[0] + " " + value.closeTime);
                //$scope.closeOrderTime.setMinutes($scope.closeOrderTime.getMinutes() - 15 );
                // else if(selectedTime > $scope.closeOrderTime){
                //   return false;
                // }
                //-------------------------------------------------------------------------//
                
                if(value.id == branchId){
                  // if(selectedTime < $scope.openTime){
                  //   return false;
                  // }
                  // else{
                //-------------------15 mins code------------------------------------------//
                // $scope.closeOrderTime = new Date($scope.todayDate[0] + " " + value.closeTime);
                // $scope.closeOrderTime.setMinutes($scope.closeOrderTime.getMinutes() - 15 );
                // if(selectedTime > $scope.closeOrderTime){
                //   $("#errorCloseTime").modal("show");
                //   return false;
                // }
                //-------------------------------------------------------------------------//
                    value['orderCloseTime'] = selectedTime; 
                    //value['closecolors'] = "red"; 
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

    $scope.selectAll = function(select){

        if(select == 1){
        angular.forEach($scope.getBranchDetails, function(value, key) {

        value.selected = 1;

        }); 

        }
        else{
        angular.forEach($scope.getBranchDetails, function(value, key) {

        value.selected = 0;

        });     
        }
        
        console.log($scope.getBranchDetails);
    }


    $scope.updateSchedule = function(branchDate, branchDetail, index) {
        console.log(branchDate, branchDetail);
        $scope.showloader = true;

        $scope.invalidDate = false;
       
        $scope.updateBranch = [];

        angular.forEach(branchDetail, function(value, key) {

        var date = new Date().toLocaleString();
        $scope.todayDate = date.split(" ");
        $scope.openTime = new Date($scope.todayDate[0] + " " + value.openTime);
        $scope.closeTime = new Date($scope.todayDate[0] + " " + value.closeTime);

        $scope.openOrderTime = new Date($scope.todayDate[0] + " " + value.orderOpenTime);
        $scope.closeOrderTime = new Date($scope.todayDate[0] + " " + value.orderCloseTime);

        if($scope.openTime > $scope.closeTime){
            $("#errorTime").modal("show");
            $scope.invalidDate = true;
            value['opencolors'] = "red"; 
            value['closecolors'] = "red"; 
        }
        if($scope.openOrderTime > $scope.closeOrderTime){
            $("#errorTime").modal("show");
            $scope.invalidDate = true;
            value['openOrdercolors'] = "red"; 
            value['closeOrdercolors'] = "red"; 
        }

        
        if(value.available == 1){
        $scope.closeOrderTime = new Date($scope.todayDate[0] + " " + value.closeTime);
        $scope.closeOrderTime.setMinutes($scope.closeOrderTime.getMinutes() - 15 );

        $scope.currentOrderTime = new Date($scope.todayDate[0] + " " + value.orderCloseTime);
        if($scope.currentOrderTime > $scope.closeOrderTime){
        $("#errorCloseTime").modal("show");
        $scope.invalidDate = true;
        value['closeOrdercolors'] = "red"; 
            return false;
        }

}
    



        $scope.updateBranch.push(
            {
                branchId: value.branchId,
                date: branchDate,
                openTime: value.openTime,
                closeTime: value.closeTime,
                comment: value.comment,
                available: value.available,
                orderOpenTime: value.orderOpenTime,
                orderCloseTime: value.orderCloseTime
            });       

        }); 

        if($scope.invalidDate == true){
            $scope.showloader = false;
            return false;
        }



        var accessToken = $sessionStorage.user.currentUser.accessToken;

        angular.forEach(branchDetail, function(value, key) {
        
                    delete value.opencolors;
                    delete value.closecolors;
                    delete value.openOrdercolors;
                    delete value.closeOrdercolors;
           
        });
        

        TegServices.post(Urlconfig.updateSpecialBranchTime, $scope.updateBranch, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
            },
                'dataType': 'json'
        }).then(function(response) {

            
            //$scope.changemode();
            $scope.changemode(index);
            $scope.showloader = false;

        }, function(error) {
            console.log(error);

        });

    }





    $scope.addCustomBranches = function(branchSchedule, branchavailable) {
       
        var start = $scope.currentDateFrom; //yyyy-mm-dd
        var end = $scope.currentDateTo; //yyyy-mm-dd

        if(start > end){
          $("#errorDate").modal("show");
          return false;  
        }

        $scope.openBranchTimeFrom = $scope.apiTime($scope.currentTimeBranchFrom);
        $scope.openBranchTimeTo = $scope.apiTime($scope.currentTimeBranchTo);
        $scope.openOrderTimeFrom = $scope.apiTime($scope.currentTimeOrderFrom);
        $scope.openOrderTimeTo = $scope.apiTime($scope.currentTimeOrderTo);

        if($scope.branchavailable == 1){
        if(Date.parse('01/01/1970 ' + $scope.openBranchTimeFrom) > Date.parse('01/01/1970 ' + $scope.openBranchTimeTo)){
          $("#errorTime").modal("show");
          return false;  
        }
        if(Date.parse('01/01/1970 ' + $scope.openOrderTimeFrom) > Date.parse('01/01/1970 ' + $scope.openOrderTimeTo)){
          $("#errorTime").modal("show");
          return false;  
        }    
        }
        

       
        

        var range =[];


        $scope.addBranch = [];

        while(start <= end){

        var mm = ((start.getMonth()+1)>=10)?(start.getMonth()+1):'0'+(start.getMonth()+1);
        var dd = ((start.getDate())>=10)? (start.getDate()) : '0' + (start.getDate());
        var yyyy = start.getFullYear();
        var date = yyyy+ "-" +mm+"-"+dd; //yyyy-mm-dd

        range.push(date);

        
        start = new Date(start.setDate(start.getDate() + 1)); //date increase by 1            
        


        angular.forEach(branchSchedule, function(value, key) {
        
        
        
         if(value.selected == "1"){
            $scope.branchId = value.branchId;

            $scope.addBranch.push({
            branchId: $scope.branchId,
            date: date,
            openTime: $scope.openBranchTimeFrom,
            closeTime: $scope.openBranchTimeTo,
            orderOpenTime: $scope.openOrderTimeFrom,
            orderCloseTime: $scope.openOrderTimeTo,
            available: branchavailable,
            comment: $scope.comment
         });

        }   

         
             

        }); 

        }

        $scope.currentDateFrom = new Date($scope.currentDateFrom.setDate($scope.currentDateFrom.getDate() - 1));

        console.log($scope.addBranch);

        var date = new Date().toLocaleString();
        $scope.todayDate = date.split(" ");

        if($scope.branchavailable == 1){

        for(var i = 0; i<$scope.addBranch.length; i++) {

        $scope.closeOrderTime = new Date($scope.todayDate[0] + " " + $scope.addBranch[i].closeTime);
        $scope.closeOrderTime.setMinutes($scope.closeOrderTime.getMinutes() - 15 );

        $scope.currentOrderTime = new Date($scope.todayDate[0] + " " + $scope.addBranch[i].orderCloseTime);
        if($scope.currentOrderTime > $scope.closeOrderTime){
        $("#errorCloseTime").modal("show");
            return false;
        }

    };
}

 //--------------API to add branch-------------------------//
        var accessToken = $sessionStorage.user.currentUser.accessToken;
        

        TegServices.post(Urlconfig.addSpecialBranchTime, $scope.addBranch, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
            },
                'dataType': 'json'
        }).then(function(response) {

            $scope.showloader = true;
            $("#myModal").modal("hide");
            // $('body').removeClass('modal-open');
            // $('.modal-backdrop').remove();


            $rootScope.getSpecialBranchTime();
            $rootScope.getBranchForAdd();
            $scope.currentTimeBranchFrom = new Date();
            $scope.currentTimeBranchTo = new Date();
            $scope.currentTimeOrderFrom = new Date();
            $scope.currentTimeOrderTo = new Date();
            $scope.currentDateFrom = new Date();
            $scope.currentDateTo = new Date();
            $scope.branchavailable = 0;
            $scope.comment = "";

        }, function(error) {
            console.log(error);

            $("#errorDupBranch").modal("show");
            $rootScope.getSpecialBranchTime();

        });
 //--------------------------------------------------------//       
    }


    $scope.deleteCustomBranch = function(Id, Index) {
        var accessToken = $sessionStorage.user.currentUser.accessToken;
        

        TegServices.get(Urlconfig.deleteSpecialBranchTime + Id, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
            },
                'dataType': 'json'
        }).then(function(response) {

           //$scope.showloader = true;   

           angular.forEach($scope.getSpecialBranchTime, function(value, key) {
                if(value.date == Index){
                    if(value.specialBranchTimeList.length == 1) {
                        $rootScope.getSpecialBranchTime();
                    } else {
                        $rootScope.getSpecialBranchTime(Index);
                    }
                }

            });         

            
            
            $rootScope.getBranchForAdd();


        }, function(error) {
            console.log(error);

            $rootScope.getSpecialBranchTime();

        });
    }

        $scope.deleteScheduleByDate = function(date) {
        var accessToken = $sessionStorage.user.currentUser.accessToken;
        

        TegServices.get(Urlconfig.deleteSpecialBranchTimeByDate + date, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
            },
                'dataType': 'json'
        }).then(function(response) {

           $scope.showloader = true;            

            // if($scope.getSpecialBranchTime[Index].specialBranchTimeList.length == 1) {
            //     $rootScope.getSpecialBranchTime();
            // } else {
            //     $rootScope.getSpecialBranchTime(Index);
            // }
            $rootScope.getSpecialBranchTime();
            $rootScope.getBranchForAdd();


        }, function(error) {
            console.log(error);

            $rootScope.getSpecialBranchTime();

        });
    }

    $scope.clearModal = function(){

        angular.forEach($scope.getBranchDetails, function(value, key) {

        value.selected = 0;

        }); 
        $scope.select = 0;
        $scope.currentTimeBranchFrom = new Date();
        $scope.currentTimeBranchFrom.setHours(0);
        $scope.currentTimeBranchFrom.setMinutes(0);        

        $scope.currentTimeBranchTo = new Date();
        $scope.currentTimeBranchTo.setHours(0);
        $scope.currentTimeBranchTo.setMinutes(0);  

        $scope.currentTimeOrderFrom = new Date();
        $scope.currentTimeOrderFrom.setHours(0);
        $scope.currentTimeOrderFrom.setMinutes(0);

        $scope.currentTimeOrderTo = new Date();
        $scope.currentTimeOrderTo.setHours(0);
        $scope.currentTimeOrderTo.setMinutes(0);

        $scope.currentDateFrom = new Date();
        $scope.currentDateTo = new Date();
        $scope.branchavailable = 0;
        $scope.comment = "";

    }

    $scope.cancelEdit = function(index){
        $scope.showloader = true;
        $rootScope.getSpecialBranchTime();
        $scope.changemode(index);

    }

    $scope.clearDateSearch = function() {
       $scope.showloader = true;
       $scope.searchDate = "";
       $rootScope.getSpecialBranchTime();
    }

        
})
.filter('tconvert', function()
    {
     return function(time){
        if(time == null)
            return;
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
