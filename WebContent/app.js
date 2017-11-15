/*app.js to bootstrap application and defining the routing of the application */


(function(){angular.module("teg", ['ui.router', 'ui.select', 'ui.mask','ngStorage', "ngMaterial", "mdPickers", 'utf8-base64', 'login.controller', 'main.controller', 'exchangerates.controller', 'orders.controller', 'buybackorders.controller', 'branchdetails.controller', 'schedulemanager.controller', 'teg.factory'])
    .run(function () {})
    .constant("myConfig", {
        "demoMode": true
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        
        $stateProvider
        .state('login', {
            url: '/',
            templateUrl: 'TEG/views/login.html',
            controller: "loginCtrl",
        
        })
        .state('main', {
            url: '/main',
            templateUrl: 'TEG/views/main.html',
            controller: "mainCtrl",
        
        })
        .state('main.exchangerates', {
            url: '/exchangerates',
            templateUrl: 'TEG/views/exchangerates.html',
            controller: "exchangeratesCtrl",
        
        })
        .state('main.orders', {
            url: '/orders',
            templateUrl: 'TEG/views/orders.html',
            controller: "ordersCtrl",
        
        })
        .state('main.buybackorders', {
            url: '/buybackorders',
            templateUrl: 'TEG/views/orders.html',
            controller: "buybackordersCtrl",
        
        })
        .state('main.branchdetails', {
            url: '/branchdetails',
            templateUrl: 'TEG/views/branchdetails.html',
             controller: "branchdetailsCtrl",
        })
        .state('main.schedulemanager', {
            url: '/schedulemanager',
            templateUrl: 'TEG/views/schedulemanager.html',
             controller: "schedulemanagerCtrl",
        })
        
        
        

        //for unmatched url redirect to home
        $urlRouterProvider.otherwise("/");
    })})(angular);



