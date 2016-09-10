(function(window, angular) {
    var app = angular.module('app', ['ui.router','ngCookies','base64','angular-md5']);

    
    app.run(function($rootScope, $state, $stateParams, $interval,$http,isLogin,userInfo) {

       
        
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            if(toState.title){
                $rootScope.pageTitle = toState.title;
            }
           // console.log(userInfo.get());
            if(userInfo.get()){
                $rootScope.isLogin = true;
                $rootScope.token = userInfo.get().Token;
             // isLogin();
            }else{
                $rootScope.isLogin = false;
            }



        });
        $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){

           // isLogin();
          if(toState.title){
                $rootScope.pageTitle = toState.title;
          }
          if(userInfo.get()){
                $rootScope.isLogin = true;
                $rootScope.token = userInfo.get().token;
             // isLogin();
            }else{
                $rootScope.isLogin = false;
            }
        });
    });
    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
        
       $httpProvider.interceptors.push('sessionInterceptor');

        $stateProvider
            .state('register',{
                url:'/register/:ReferenceRealName?ReferenceTel',
                templateUrl:'views/qiantai/register.html',
                title:'注册',
                controller:'registerCtrl'
            })
            .state('login',{
                url:'/login',
                templateUrl:'views/qiantai/login.html',
                title:'登陆',
                controller:'loginCtrl'
            })
             .state('bankcard',{
                url:'/bankcard',
                templateUrl:'views/qiantai/bankcard.html',
                title:'完善资料',
                controller:'bankcardCtrl'
            })
            .state('index',{
                url:'/index',
                templateUrl:'views/qiantai/index.html',
                title:'首页',
                controller:'indexCtrl'
            })
            .state('gamelist',{
                url:'/gamelist',
                templateUrl:'views/qiantai/gamelist.html',
                title:'选择游戏',
                controller:'gamelistCtrl'
            })
            .state('myhome',{
                url:'/myhome',
                templateUrl:'views/qiantai/myhome.html',
                title:'个人中心',
                controller:'myhomeCtrl'
            })
            .state('kf',{
                url:'/kf',
                templateUrl:'views/qiantai/kf.html',
                title:'客服',
                controller:'kfCtrl'
            })
            .state('chuantong',{
                url:'/chuantong',
                templateUrl:'views/qiantai/chuantong.html',
                title:'传统模式',
                controller:'chuantongCtrl'
            })
            .state('ziyou',{
                url:'/ziyou',
                templateUrl:'views/qiantai/ziyou.html',
                title:'自由模式',
                controller:'ziyouCtrl'
            })
            .state('newtouzi',{
                url:'/newtouzi/:Playid?PlayCollection?PlayStage',
                templateUrl:'views/qiantai/newtouzi.html',
                title:'新建游戏',
                controller:'newtouziCtrl'
            })
            .state('touzi',{
                url:'/touzi/:Playid?PlayCollection?PlayStage?SchemeId',
                templateUrl:'views/qiantai/touzi.html',
                title:'投资',
                controller:'touziCtrl'
            })
             .state('touzilist',{
                url:'/touzilist/:Playid?PlayCollection?PlayStage?SchemeId',
                templateUrl:'views/qiantai/touzilist.html',
                title:'打款列表',
                controller:'touzilistCtrl'
            })
            .state('tixian',{
                url:'/tixian',
                templateUrl:'views/qiantai/tixian.html',
                title:'提现',
                controller:'tixianCtrl'
            })
             .state('tixianlist',{
                url:'/tixianlist',
                templateUrl:'views/qiantai/tixianlist.html',
                title:'提现列表',
                controller:'tixianlistCtrl'
            })
              .state('orderlist',{
                url:'/orderlist',
                templateUrl:'views/qiantai/orderlist.html',
                title:'订单列表',
                controller:'orderlistCtrl'
            })
            .state('qianbao',{
                url:'/qianbao',
                templateUrl:'views/qiantai/qianbao.html',
                title:'钱包',
                controller:'qianbaoCtrl'
            })
             .state('tixiandetail',{
                url:'/tixiandetail/:fundId',
                templateUrl:'views/qiantai/tixiandetail.html',
                title:'提现详情',
                controller:'tixiandetailCtrl'
            })
             .state('mydetail',{
                url:'/mydetail/:type',
                templateUrl:'views/qiantai/mydetail.html',
                title:'详情',
                controller:'mydetailCtrl'
            })
             .state('guize',{
                url:'/guize',
                templateUrl:'views/qiantai/guize.html',
                title:'规则',
                controller:'guizeCtrl'
            })
               .state('yqs',{
                url:'/yqs',
                templateUrl:'views/qiantai/yqs.html',
                title:'摇钱树',
                controller:'yqsCtrl'
            })
            
        $urlRouterProvider.otherwise("/index");
    }]);



})(window, angular);
