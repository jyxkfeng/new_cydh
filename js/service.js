(function(window,angular){
	angular.module('app')
	.service('API', ['$http','$cookies','$rootScope','userInfo',function($http,$cookies,$rootScope,userInfo){
			var hostName = 'http://api.cydhch.com';
		
		var ucInt = function(host,params){

			var params;
			if($rootScope.isLogin){
				params = angular.extend(params,{
					token:userInfo.get().Token,
					Userid:userInfo.get().UserId,
					usertype:userInfo.get().UserType,
					Platform:4
				});
			}else{
				params = params;
			}

			return $http.post(hostName+host,{params:params});
		}

		var qtInt = function(host,params){
			return $http.get(hostName+host,{params:params});
		}
		
		var ptInt = function(host,params){
			return $http.post(hostName+host,{params:params});
		}
		// var 

		return {
			qtInt:qtInt,
			ucInt:ucInt,
			ptInt:ptInt
			
		}
			
	}])
	.service('userInfo', ['$cookieStore','$rootScope', function($cookieStore,$rootScope){
		// return function(){
			var set = function(user){
				return $cookieStore.put('userInfo',user);
				
			}
			var get = function(){
				return $cookieStore.get('userInfo');
			}

			return {
				set:set,
				get:get
			}
		// };
	}])
	.service('playInfo', ['$cookieStore','$rootScope', function($cookieStore,$rootScope){
		// return function(){
			var set = function(user){
				return $cookieStore.put('playInfo',user);
				
			}
			var get = function(){
				return $cookieStore.get('playInfo');
			}

			return {
				set:set,
				get:get
			}
		// };
	}])
	.factory('isLogin', ['API','userInfo','$rootScope', function(API,userInfo,$rootScope){

		return function(){
			if(!angular.isUndefined(userInfo.get())){
				$rootScope.isLogin = true;
				$rootScope.token = userInfo.get().Token;
				// var userInfo = userInfo.get();
				// var params = {
				// 	action:1002,
				// 	// token:userInfo.get().Token,
				// 	params:angular.toJson({
				// 		token:userInfo.get().Token,
				// 		mobile:userInfo.get().UserName,
				// 		userid:userInfo.get().UserId,
				// 		usertype:userInfo.get().UserType
				// 	})
				// }
				// API.ucInt(params)
				// 	.success(function(rt){
				// 		if(rt.Code == 0){
				// 			userInfo.set(rt.Data);
				// 			$rootScope.isLogin = true;
				// 		}else{
				// 			$rootScope.isLogin = false;
				// 		}
				// 	})
			}else{
				$rootScope.isLogin = false;
			}
		};
	}])
	.factory('isBindCard', ['API','userInfo','$rootScope', function(API,userInfo,$rootScope){

		return function(){
			if(userInfo.get().IsBindBank){
				$rootScope.IsBindBank = true;
			}else{
				$rootScope.IsBindBank = false;
			}
		};
	}])
	.factory('RefreshUserInfo', ['API','userInfo','$rootScope','$cookieStore', function(API,userInfo,$rootScope,$cookieStore){

		return function(callback){
			userid={'uid':userInfo.get().UId}
			API.qtInt('/api/yqsuser/Refresh/', userid)
					.success(function(rt) {
						rt = angular.fromJson(rt)
						if(rt.Code == 0) {
							userInfo=angular.extend({},rt.Data);
							$cookieStore.remove('userInfo');
							userInfo.set(userInfo);							
							console.log(userInfo.get());
							
						} else {
							return false;
						}
						
					});
					
		};
	}])
	.factory('lyer', [function(){
		// return function(msg){

			var msg = function(msg,callback){
				layer.open({
				    content:msg,
				    btn: ['确认'],
				    yes:function(index){
				    	layer.close(index);
				    	if(callback){
				    		callback(index);
				    	}
				    }

				});
			}

			var confirm = function(msg,yesCallback,noCallback){
				layer.open({
					title:'温馨提示',
					content:msg,
					btn:['确认','取消'],
					yes:function(index){
						if(yesCallback){
							yesCallback()
						}
						layer.close(index);
					},
					no:function(index){
						if(noCallback){
							noCallback();
						}
						layer.close(index);
					}
				})
			}

			return {
				msg:msg,
				confirm:confirm
			}
		// };
	}])
	.factory('toLogin', ['$state', function($state){

		return function(){
			$state.go('login',{
				backUrl:encodeURIComponent(location.href)
			})
		};
	}])
	.factory('unlogin', ['lyer','$state',function(lyer,$state){
		return function (e,data){
			// $scope.$on('unlogin',function(e,data){
				if(angular.isObject(data.data) && data.data.Code == -2){
					// lyer.msg(data.data.Msg,function(){
						$state.go('login',{
							backUrl:encodeURIComponent(location.href)
						});
					// })
					return false;
				}else if(angular.isObject(data.data) && (!angular.isUndefined(data.data.Code) && data.data.Code !=0 &&  data.data.Code != -2)){
					lyer.msg(data.data.Msg);
				}
			// })
		};
	}])
	.factory('sessionInterceptor', ['$q','$injector','lyer','$rootScope', function($q,$injector,lyer,$rootScope) {
		return {
            'request': function(config) {
            	// console.log(config);
            	return config;
            },
            'requestError': function(rejection) {
                return $q.reject(rejection);
            },
            'response': function(response) {
            	$rootScope.$broadcast('unlogin',response);
            	return response;
        	}
        }

	}])
	//倒计时
    .factory('countDown',['$rootScope','$timeout','$interval',function($rootScope,$timeout,$interval){
		return function(diff,loadTime,item,callback){
			var t = true;
			function round($diff){
				var dd = parseInt($diff / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
				var hh = parseInt($diff / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
				var mm = parseInt($diff / 1000 / 60 % 60, 10);//计算剩余的分钟数
				var ss = parseInt($diff / 1000 % 60, 10);//计算剩余的秒数

				function checkTime(a){
					if (a < 10) {
						a= "0" + a;
					}
					return a.toString();
				}

				item.conttainer = {
				dd:checkTime(dd),
				hh:checkTime(hh),
				mm:checkTime(mm),
				ss:checkTime(ss),
				hs:99
				};
				var hs = 100;

				$interval(function(){
					hs = hs -4;
					item.conttainer.hs  = checkTime(hs);
				},40,25)
				if(item.conttainer.dd > 0 || item.conttainer.hh > 0 || item.conttainer.mm > 0 || item.conttainer.ss > 0 ){
					$timeout(function(){
					// console.log(new Date() - loadTime,diff);
					var $diff = diff - (new Date() - loadTime);
					round($diff);
					},1000);
				}else{

					if(callback)
						callback();
				}
			}

			// console.log(new Date() - loadTime);
			round((diff - (new Date() - loadTime)-1000));
			//hh!=0 || mm!=0 || ss!=0



		};
    }])
	;
		
})(window,angular);
(function() {
    'use strict';
 
    angular.module('base64', []).constant('$base64', (function() {
 
        // existing version for noConflict()
        var version = "2.1.8";
        // if node.js, we use Buffer
        var buffer;
        if (typeof module !== 'undefined' && module.exports) {
            buffer = require('buffer').Buffer;
        }
        // constants
        var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var b64tab = function(bin) {
            var t = {};
            for (var i = 0,
            l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
            return t;
        } (b64chars);
        var fromCharCode = String.fromCharCode;
        // encoder stuff
        var cb_utob = function(c) {
            if (c.length < 2) {
                var cc = c.charCodeAt(0);
                return cc < 0x80 ? c: cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6)) + fromCharCode(0x80 | (cc & 0x3f))) : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)));
            } else {
                var cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
                return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07)) + fromCharCode(0x80 | ((cc >>> 12) & 0x3f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)));
            }
        };
        var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
        var utob = function(u) {
            return u.replace(re_utob, cb_utob);
        };
        var cb_encode = function(ccc) {
            var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16 | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8) | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
            chars = [b64chars.charAt(ord >>> 18), b64chars.charAt((ord >>> 12) & 63), padlen >= 2 ? '=': b64chars.charAt((ord >>> 6) & 63), padlen >= 1 ? '=': b64chars.charAt(ord & 63)];
            return chars.join('');
        };
        var btoa = function(b) {
            return b.replace(/[\s\S]{1,3}/g, cb_encode);
        };
        var _encode = buffer ?
        function(u) {
            return (u.constructor === buffer.constructor ? u: new buffer(u)).toString('base64')
        }: function(u) {
            return btoa(utob(u))
        };
        var encode = function(u, urisafe) {
            return ! urisafe ? _encode(String(u)) : _encode(String(u)).replace(/[+\/]/g,
            function(m0) {
                return m0 == '+' ? '-': '_';
            }).replace(/=/g, '');
        };
        var encodeURI = function(u) {
            return encode(u, true)
        };
        // decoder stuff
        var re_btou = new RegExp(['[\xC0-\xDF][\x80-\xBF]', '[\xE0-\xEF][\x80-\xBF]{2}', '[\xF0-\xF7][\x80-\xBF]{3}'].join('|'), 'g');
        var cb_btou = function(cccc) {
            switch (cccc.length) {
            case 4:
                var cp = ((0x07 & cccc.charCodeAt(0)) << 18) | ((0x3f & cccc.charCodeAt(1)) << 12) | ((0x3f & cccc.charCodeAt(2)) << 6) | (0x3f & cccc.charCodeAt(3)),
                offset = cp - 0x10000;
                return (fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00));
            case 3:
                return fromCharCode(((0x0f & cccc.charCodeAt(0)) << 12) | ((0x3f & cccc.charCodeAt(1)) << 6) | (0x3f & cccc.charCodeAt(2)));
            default:
                return fromCharCode(((0x1f & cccc.charCodeAt(0)) << 6) | (0x3f & cccc.charCodeAt(1)));
            }
        };
        var btou = function(b) {
            return b.replace(re_btou, cb_btou);
        };
        var cb_decode = function(cccc) {
            var len = cccc.length,
            padlen = len % 4,
            n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
            chars = [fromCharCode(n >>> 16), fromCharCode((n >>> 8) & 0xff), fromCharCode(n & 0xff)];
            chars.length -= [0, 0, 2, 1][padlen];
            return chars.join('');
        };
        var atob = function(a) {
            return a.replace(/[\s\S]{1,4}/g, cb_decode);
        };
        var _decode = buffer ?
        function(a) {
            return (a.constructor === buffer.constructor ? a: new buffer(a, 'base64')).toString();
        }: function(a) {
            return btou(atob(a))
        };
        var decode = function(a) {
            return _decode(String(a).replace(/[-_]/g,
            function(m0) {
                return m0 == '-' ? '+': '/'
            }).replace(/[^A-Za-z0-9\+\/]/g, ''));
        };
 
        return {            
            encode: encode,            
            decode: decode,
        };
 
    })());
 
})();