(function(window, angular) {
	angular.module('app')
		//一级header
		.directive('footerDirective', ['$state', '$rootScope', function($state, $rootScope) {
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: 'views/directive/footerDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
					$scope.gohome = function() {
						console.log('index');
						$rootScope.menuindex = 1;
						$state.go('index');

					}
					$scope.gogame = function() {
						console.log('gamelistCtrl');
						$rootScope.menuindex = 2;
						$state.go('gamelist');
					}
					$scope.gokf = function() {
						console.log('kf');
						$rootScope.menuindex = 3;
						$state.go('kf');
					}
					$scope.gomy = function() {
							console.log('myhome');
							$rootScope.menuindex = 4;
							$state.go('myhome');
						}
						// console.log($scope.stateName);
				}
			};
		}])
		//二级header
		.directive('subHeaderDirctive', ['$state', '$stateParams', function($state, $stateParams) {
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: 'views/directive/subHeaderDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
					// console.log($stateParams.source);
					if($stateParams.source == 'app') {
						$scope.subHeaderShow = false;
						console.log(1);
					} else {
						$scope.subHeaderShow = true;
					}

					// console.log($state.current.goHomeShow);
					if(angular.isUndefined($state.current.goHomeShow)) {
						$scope.goIndexShow = true;
					} else if($state.current.goHomeShow == false) {
						$scope.goIndexShow = false;
					}

					$scope.goBack = function() {
						history.go(-1);
					}

					// if($stateParams.source == 'app'){

					// }
				}
			};
		}])
		.directive('kfboxDirective', [function() {
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: 'views/directive/kfboxDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
					$scope.tiphide = function() {
						$scope.tipShow = false;
						console.log($scope.tipShow);
					}
				}
			};
		}])
		.directive('uploadpicDirective', ['$state', '$http','API', 'lyer','playInfo', function($state, $http,API, lyer,playInfo) {
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				//scope:true, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: 'views/directive/uploadpicDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
					    $scope.ablebtn=false;
					    $scope.host='http://api.cydhch.com';
						$scope.UpLoadPic = function() {
							document.querySelector('#localfile').click();
						}
						$scope.fileNameChanged = function(sender) {
							
							if(!sender.value.match(/.jpg|.jpeg|.gif|.png|.bmp/i)) {
								console.log('图片格式无效！');
								return false;
							}
							if(sender.files && sender.files[0]) { //这里面就是chrome和ff可以兼容的了 
								var params = {
									imgpay: sender.files[0]
								}
								$http({
										method: 'POST',
										url: 'http://api.cydhch.com/api/UpLoadFile/UpLoadPic/',
										headers: {
											'Content-Type': undefined
										},
										data: params,
										transformRequest: function(data, headersGetter) {
											var formData = new FormData();
											angular.forEach(data, function(value, key) {
												formData.append(key, value);
											});

											var headers = headersGetter();
											delete headers['Content-Type'];

											return formData;
										}
									})
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0) {
											console.log(rt);
											lyer.msg(rt.Msg, function() {
												$scope.pic = rt.Data;
												$scope.locpic=$scope.host+rt.Data;
												
												 $scope.ablebtn=true;
												//$state.reload()
											});
										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
							}
						}
								//付款
							$scope.PlayPay = function() {
								var params = {
									schemeid: playInfo.get()[0].SchemeId,
									pic:$scope.pic
								}
								//确认无误,付款订单
								//确认无误,创建订单
								API.qtInt('/api/yqsPlay/PlayPay/', params)
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0) {
											console.log(rt);
											$state.reload()
					
										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
							
							}
						
						
					}
			

			};
		}])
		//购物车
		.directive('cartDirective', [function() {
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: 'views/directive/cartDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {

				}
			};
		}])
		//购物车
		.directive('loadingDirective', [function() {
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: 'views/directive/loadingDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
					$scope.loading = true;
					$scope.nomore = false;
					$scope.no = false;
				}
			};
		}]);

})(window, angular);