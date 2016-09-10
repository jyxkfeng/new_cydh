(function(window, angular) {
	angular.module('app')
		//首页
		.controller('indexCtrl', ['$scope','$state','$rootScope','$cookieStore', 'API', 'lyer', 'userInfo', 'countDown', 'isBindCard', function($scope,$state,$rootScope,$cookieStore, API, lyer, userInfo, countDown, isBindCard) {
			$rootScope.body_class = "index_bg";
			console.log($rootScope.isLogin);
			$scope.footerShow = true;
			$rootScope.IsBindBank = false;
			$scope.titleShow = true;
			$scope.tipShow = false;

			$scope.swiper = function() {
				var mySwiper = new Swiper('.swiper-container', {
					autoplay: 3000, //可选选项，自动滑动
					pagination: '.swiper-pagination',
				})
			}
			$scope.swiper();

			if($rootScope.isLogin) {
				setInterval(function() {
					//	api/yqsAssistant/Assistant/?id=1
					console.log(userInfo.get());
					var params = {
						'id': userInfo.get().UId
					};
					//秘书提醒功能
					API.qtInt('/api/yqsAssistant/Assistant/', params)
						.success(function(rt) {
							rt = angular.fromJson(rt)
							if(rt.Code == 0) {
								$scope.tipShow = true;
								console.log('$scope.tipShow=' + $scope.tipShow);
								
								$scope.data = rt.Data;
								//$scope.$apply(); //重置
							} else {
								return false;
							}
						});
				}, 30000)
			}

			//未登录 跳转到 登陆页

			if(!$rootScope.isLogin) {
				$state.go('login');
				console.log($rootScope.isLogin);
				return false;
			}
			//判断用户是否绑定
			API.qtInt('/api/yqsuser/Refresh/',{uid:userInfo.get().UId})
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0) {
											$scope.userInfo=angular.extend({},rt.Data);
											$cookieStore.remove('userInfo');
											userInfo.set($scope.userInfo);
											console.log(rt);
											  if(!userInfo.get().IsBindBank){
											  	console.log("去绑定银行卡");
												$state.go('bankcard');
											  }
												
											
											
											
										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
			
		
			
			// console.log(API);
			var bannerParams = {
					action: 2005,
					params: angular.toJson({
						btype: 0
					})
				}
			
				//首页轮播图
							API.qtInt('/api/yqsAssistant/Protal/',{})
								.success(function(rt){
									
									rt = angular.fromJson(rt)
									// console.log(rt);
									if(rt.Code == 0){
										$scope.banner = rt.Data;
										$scope.host=$rootScope.host;
				
										setTimeout(function(){
											var mySwiper = new Swiper('.swiper-container', {
												autoplay: 3000,//可选选项，自动滑动
												pagination : '.swiper-pagination',
											})
										},50);
									}
								});

		}])
		//注册
		.controller('registerCtrl', ['$scope','$state', '$rootScope', 'API', 'lyer', 'md5','$stateParams', function($scope,$state, $rootScope, API, lyer, md5,$stateParams) {
			$rootScope.body_class = "login_bg";
			$scope.titleShow = true;
			$scope.params = {};
			$scope.isRegister = false;
			$scope.params.reference = $stateParams.ReferenceRealName;
		    $scope.params.referencetel = $stateParams.ReferenceTel;
			$scope.zhuce = function() {

				console.log('register');
				console.log($scope.params)
				if($scope.registerForm.name.$error.required || $scope.registerForm.pwd.$error.required || $scope.registerForm.tel.$error.required || $scope.registerForm.reference.$error.required ) {
					lyer.msg('不能为空');
					return false;
				}
				if($scope.params.pwd != $scope.params.repwd) {
					lyer.msg('两次密码不一致');
					return false;
				} else if($scope.registerForm.name.$error.pattern || $scope.registerForm.pwd.$error.pattern || $scope.registerForm.tel.$error.pattern || $scope.registerForm.reference.$error.pattern ) {
					lyer.msg('请正确输入');
					return false;
				}

				$scope.isRegister = true;

				$scope.params.pwd = md5.createHash($scope.params.pwd + 'Q56GtyNkop97H334TtyturfgErvvv98r' || '');
				$scope.params.repwd = md5.createHash($scope.params.repwd + 'Q56GtyNkop97H334TtyturfgErvvv98r' || '');

				var params = angular.extend({}, $scope.params);

				//提交表单注册 ;
				API.qtInt('/api/yqsuser/Register/', params)
					.success(function(rt) {
						rt = angular.fromJson(rt)
						if(rt.Code == 0) {

							$scope.data = rt.Data;
							lyer.msg('注册成功', function() {
								$state.go('login');
								
							});

						} else {
							lyer.msg('注册格式有误，请先检查');
							return false;
						}
					});

			}

		}])
		//登陆
		.controller('loginCtrl', ['$scope','$state','$rootScope', 'API', 'lyer', 'userInfo', 'md5', function($scope,$state, $rootScope, API, lyer, userInfo, md5) {
			$rootScope.body_class = "login_bg";
			$scope.titleShow = true;
			console.log('login');
			var params = {};
			$scope.login = function() {

				if($scope.loginForm.name.$error.required) {
					lyer.msg('请输入手机号码');
					return false;
				} else if($scope.loginForm.name.$error.pattern) {
					lyer.msg('请输入正确的手机号码');
					return false;
				}
				params.name=$scope.params.name;
				params.pwd = md5.createHash($scope.params.pwd + 'Q56GtyNkop97H334TtyturfgErvvv98r' || '');
				//var params = angular.extend({}, params);
				//提交表单登陆 ;
				API.qtInt('/api/yqsuser/Login/', params)
					.success(function(rt) {
						rt = angular.fromJson(rt)

						if(rt.Code == 0) {

							$scope.data = rt.Data;
							userInfo.set(rt.Data);
							$state.go('index');
						} else {
							lyer.msg(rt.Msg);
						}
					});

			}

		}])
		//绑定银行卡
		.controller('bankcardCtrl', ['$scope','$state', '$rootScope', 'API', 'lyer', 'userInfo', 'md5', function($scope, $state,$rootScope, API, lyer, userInfo, md5) {
			$rootScope.body_class = "login_bg";
			$scope.titleShow = true;
			$scope.params = {};
			$scope.isbindcard = false;
		
			$scope.bindCard = function() {

				console.log('bindCard');
				console.log(userInfo.get().UId);
				if($scope.registerForm.realname.$error.required || $scope.registerForm.cardid.$error.required || $scope.registerForm.cardtype.$error.required || $scope.registerForm.cardaddress.$error.required || $scope.registerForm.alipayid.$error.required) {
					lyer.msg('不能为空');
					return false;
				} else if($scope.registerForm.realname.$error.pattern || $scope.registerForm.cardid.$error.pattern || $scope.registerForm.cardtype.$error.pattern || $scope.registerForm.cardaddress.$error.pattern || $scope.registerForm.alipayid.$error.pattern) {
					lyer.msg('请正确输入');
					return false;
				}

				//$scope.isbindcard=false;
				var params = angular.extend({
					'uid': userInfo.get().UId
				}, $scope.params);
				console.log(params);
				//提交银行卡绑定 ;
				API.qtInt('/api/yqsuser/BandCard/', params)
					.success(function(rt) {
						rt = angular.fromJson(rt)
						if(rt.Code == 0) {

							$scope.data = rt.Data;
							　userInfo.set(rt.Data);
							lyer.msg('绑定成功',function(){
								$state.go('index');
							});
							
						} else {
							lyer.msg(rt.Msg);
							return false;
						}
					});

			}

		}])

	//游戏选择
	.controller('gamelistCtrl', ['$scope', '$rootScope', '$state', 'lyer', 'unlogin','API', function($scope, $rootScope, $state, lyer, unlogin,API) {
		// unlogin($scope);
		$rootScope.body_class = "gamelist_bg";
		console.log($rootScope.isLogin);
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.tipShow = false;
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		}
		$scope.guize=function(){
			$state.go('guize');
		}
	}])

	.controller('myhomeCtrl', ['$scope', '$rootScope', '$state','$cookieStore', 'lyer','userInfo','$http','API',function($scope, $rootScope, $state,$cookieStore, lyer,userInfo,$http,API) {
		$rootScope.body_class = "myhone_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.tjshow=false;
		$scope.host='http://api.cydhch.com';
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		}
		
				//体现前先进行查询
			API.qtInt('/api/yqsuser/Refresh/',{uid:userInfo.get().UId})
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0) {
											$scope.userInfo=angular.extend({},rt.Data);
											$cookieStore.remove('userInfo');
											userInfo.set($scope.userInfo);
											console.log(rt);
										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
		$scope.userInfo=userInfo.get();
		var imgface=$scope.host+userInfo.get().UFace;
		$scope.imgface=userInfo.get().UFace!=''?imgface:'images/user_bg.jpg';
		
		$scope.tjlink=function(){
			$scope.tjshow=!$scope.tjshow;
			$scope.tjlinkurl='cydhch.com/index.html#/register/'+$scope.userInfo.Name
		}
		$scope.tjlink2=function(){
			lyer.msg('cydhch.com/index.html#/register/'+$scope.userInfo.Name);
			}
		$scope.qianbao_link=function(){
			$state.go('qianbao');
		}
		$scope.tixianlist=function(){
			$state.go('tixianlist');
		}
		$scope.myorderlist=function(){
			$state.go('orderlist');
		}
		$scope.mydetail=function(i){
			//1 契约书 2奖券 3团队
			
			$state.go('mydetail',{type:i});
			
		}
		$scope.logout = function() {
				$cookieStore.remove('userInfo');
				$cookieStore.remove('playInfo');
				$rootScope.isLogin = false;
				$state.go('login');
			}
		$scope.upfaceimg=function(){
			document.querySelector('#localfile').click();
			
			$scope.fileNameChanged = function(sender) {
							
							if(!sender.value.match(/.jpg|.jpeg|.gif|.png|.bmp/i)) {
								console.log('图片格式无效！');
								return false;
							}
							if(sender.files && sender.files[0]) { //这里面就是chrome和ff可以兼容的了 
								var params = {
									imgface: sender.files[0]
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
											
												$scope.pic = rt.Data;
												$scope.locpic=$scope.host+rt.Data;
												
													API.qtInt('/api/yqsuser/BandFace/', {uid:userInfo.get().UId,ufacename:$scope.pic})
													.success(function(rt) {
														rt = angular.fromJson(rt)
														if(rt.Code == 0) {
															lyer.msg('绑定头像成功!',function(){
																$scope.imgface=$scope.locpic;
																$scope.$apply();
																$state.go('myhome');
															});
														} else {
															lyer.msg(rt.Msg);
															return false;
															
														}
													});
												
				
												
												
											
										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
							}
						}
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		}
		
	}])

	.controller('kfCtrl', ['$scope', '$rootScope','userInfo', 'API','$state', 'lyer', 'unlogin', function($scope, $rootScope,userInfo,API, $state, lyer, unlogin) {
		// unlogin($scope);
		$rootScope.body_class = "kf_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.type=1;
		$scope.MyQuestion;
		$scope.username="";
		$scope.tel="";
		
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} 
		$scope.typeSelect=function(type){
			$scope.type=type;	
		}
		$scope.sbQuestion=function(){
			var params={
				uid:userInfo.get().UId,
				tel:$scope.tel,
				name:$scope.username,
				type:$scope.type,
				question:$scope.MyQuestion
			}
			//api/yqsAssistant/NewQuestion/?uid=1&tel=18112617821&name=test1&type=1&question=怎么注册？
			API.qtInt('/api/yqsAssistant/NewQuestion/', params)
					.success(function(rt) {
						rt = angular.fromJson(rt)
						if(rt.Code == 0) {
							lyer.msg(rt.Msg,function(){
									
							});
							$scope.tel='';
									$scope.username='';
									$scope.type='1';
									$scope.MyQuestion='';	
						} else {
							lyer.msg(rt.Msg);
							return false;
							
						}
					});
			
			
		}
		
	}])

	.controller('chuantongCtrl', ['$scope', '$rootScope', 'API', 'userInfo','playInfo', '$state', 'lyer', 'unlogin', 'RefreshUserInfo','$cookieStore',function($scope, $rootScope, API,userInfo,playInfo, $state, lyer, unlogin,RefreshUserInfo,$cookieStore) {
		$rootScope.body_class = "ct_game_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.gzdialog = false;
		var params;
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} else {
			   //刷新用户信息
				userid={'uid':userInfo.get().UId}
				API.qtInt('/api/yqsuser/Refresh/', userid)
					.success(function(rt) {
						rt = angular.fromJson(rt)
						if(rt.Code == 0) {
							$scope.userInfo=angular.extend({},rt.Data);
							$cookieStore.remove('userInfo');
							userInfo.set($scope.userInfo);
							console.log(userInfo.get())
							$scope.open=1; //层级 显示
							$scope.PlayCollection=$scope.userInfo.PlayCollection;
							$scope.PlayStage=$scope.userInfo.PlayStage;
							$scope.PlayStatus=$scope.userInfo.PlayStatus;
							if($scope.PlayStatus==100){
								if($scope.PlayCollection==1&&$scope.PlayStage==3){
									$scope.open=2;
								}
								else if($scope.PlayCollection==2||$scope.PlayCollection==3){
									$scope.open=3
								}
								else if($scope.PlayCollection==1&&$scope.PlayStage<3){
									$scope.open=1;
								}
								
							}
							else{
								$scope.open=$scope.PlayCollection; 
								}
						
						}
						
						else {
							return false;
						}
					});
		}
		$scope.playGame = function(PlayCollection, PlayStage) {
				
					if(PlayCollection==1&&PlayStage==1){
						
						//playcollection=0,playstage=0或者playcollection=1,playstage=1，playstatus<100,或者playcollection=3，playstatus=100
						if(($scope.PlayCollection==0&&$scope.PlayStage==0)||($scope.PlayCollection==1&&$scope.PlayStage==1&&$scope.PlayStatus<100)||($scope.PlayCollection==3&&$scope.PlayStatus==100)){
							$state.go('touzilist',{
								Playid:1,
								PlayCollection:1,
								PlayStage:1
							})	
						}
						else{
								lyer.msg('您还不能玩当前关,或者已经玩过');
							}
					}
					if(PlayCollection==1&&PlayStage==2){
						
						//playcollection=1,playstage=1，playstatus=100,
						//或者playcollection=1,playstage=2,playstatus<100
						if(($scope.PlayCollection==1&&$scope.PlayStage==1&&$scope.PlayStatus==100)||($scope.PlayCollection==1&&$scope.PlayStage==2&&$scope.PlayStatus<100)){
							$state.go('touzilist',{
								Playid:1,
								PlayCollection:1,
								PlayStage:2
							})	
							
						}
						else{
								lyer.msg('您还不能玩当前关,或者已经玩过');
							}	
					}
					if(PlayCollection==1&&PlayStage==3){
						
						//playcollection=1,playstage=2，playstatus=100,或者playcollection=1,playstage=3,playstatus<100都可以玩

						if(($scope.PlayCollection==1&&$scope.PlayStage==2&&$scope.PlayStatus==100)||($scope.PlayCollection==1&&$scope.PlayStage==3&&$scope.PlayStatus<100)){
							$state.go('touzilist',{
								Playid:1,
								PlayCollection:1,
								PlayStage:3
							})	
						}
						else{
							lyer.msg('您还不能玩当前关,或者已经玩过');
						}
						
					}
					if(PlayCollection==2){
						
						//playcollection=1,playstage=3，playstatus=100,或者playcollection=2，playstatus<100
						if(($scope.PlayCollection==1&&$scope.PlayStage==3&&$scope.PlayStatus==100)||($scope.PlayCollection==2)){
							$state.go('touzilist',{
								Playid:1,
								PlayCollection:2,
								PlayStage:PlayStage
							})	
						}
						else{
							lyer.msg('您还不能玩当前关或者本阶段还有游戏未结束');
						}
					}
					if(PlayCollection==3){
			
						//playcollection=2,playstatus=100,或者playcollection=3，playstatus<100
						if(($scope.PlayCollection==2&&$scope.PlayStatus==100)||($scope.PlayCollection==3)){
							$state.go('touzilist',{
								Playid:1,
								PlayCollection:3,
								PlayStage:PlayStage
							})	
							
						}
						else{
							lyer.msg('您还不能玩当前关或者本阶段还有游戏未结束');
						}
					}
		}

	
	}])

	.controller('ziyouCtrl', ['$scope', '$rootScope', '$state', 'lyer', function($scope, $rootScope, $state, lyer) {
		// unlogin($scope);
		$rootScope.body_class = "ct_game_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		
		
		$scope.playGame = function(PlayCollection, PlayStage) {
			$state.go('touzilist',{
						Playid:2,
						PlayCollection:PlayCollection,
						PlayStage:PlayStage
					})
		}


	}])
	
	//体现
	.controller('tixianCtrl', ['$scope', '$rootScope','API', 'userInfo', '$state', 'lyer', '$stateParams', function($scope, $rootScope,API, userInfo,$state, lyer,$stateParams) {
		// unlogin($scope);
		$rootScope.body_class = "tixian_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.userInfo=userInfo.get();
		$scope.uid=$scope.userInfo.UId;
		
		//体现前先进行查询
			API.qtInt('/api/yqsfund/fundspeed/',{uid:$scope.uid})
									.success(function(rt) {
										rt = angular.fromJson(rt)
										$scope.userInfo=angular.extend({},rt.Data);
											console.log(rt);
											
										
									});
		$scope.tixian= function() {
			var params= {
						uid:$scope.uid,
						money:$scope.txmoney
					}
				
			if((!!$scope.txmoney)&&($scope.txmoney<=$scope.userInfo.Money)){
				if($scope.txmoney%100!=0){
					lyer.msg('必须是100的整数!')
					return false;
				}
				console.log('true');
					API.qtInt('/api/yqsfund/fund/',params)
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0&&rt.Data.Data.length>0) {
											lyer.msg(rt.Msg,function(){
												$state.go('qianbao');
											});
										} else {
											lyer.msg(rt.Msg,function(){
												$state.go('qianbao');
											});
											return false;
										}
									});
			}
			else{
				lyer.msg('出错啦,请检查您的可用余额');
			}
			console.log(params);
		}
		
	


	}])
	//提现列表
	.controller('tixianlistCtrl', ['$scope', '$rootScope','API', 'userInfo', '$state', 'lyer', '$stateParams', function($scope, $rootScope,API, userInfo,$state, lyer,$stateParams) {
		$rootScope.body_class = "order_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} 
		$scope.userInfo=userInfo.get();
		$scope.uid=$scope.userInfo.UId;
		//进行查询
			API.qtInt('/api/yqsfund/AllFund/',{uid:$scope.uid})
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0) {
											$scope.userInfo=angular.extend({},rt.Data);
											if(rt.Data.Data.length==0){
												lyer.msg('暂时还没有提现记录!');
												
											}
											
											console.log(rt);
										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
		
		$scope.tixiandetail=function(i){
			console.log(i);
			$state.go('tixiandetail',{
				fundId:i
			});
			
		}
		
	}])
	
		//提现详情
	.controller('tixiandetailCtrl', ['$scope', '$rootScope','API', 'userInfo', '$state', 'lyer', '$stateParams','$cookieStore', function($scope, $rootScope,API, userInfo,$state, lyer,$stateParams,$cookieStore) {
		$rootScope.body_class = "order_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} 
		$scope.userInfo=userInfo.get();
		$scope.uid=$scope.userInfo.UId;
		$scope.fundid = $stateParams.fundId;
		//进行查询
			API.qtInt('/api/yqsfund/fundspeed/',{fundid:$scope.fundid})
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0) {
											$scope.userInfo=angular.extend({},rt.Data);
											$scope.host=$rootScope.host;
											
											console.log(rt);
										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
		$scope.querySK=function(uid,fundid){
			console.log(uid);
			console.log(fundid);
			//确认收款
			API.qtInt('/api/yqsfund/FundConform/',{uid:uid,fundid:fundid})
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0) {
											$scope.userInfo=angular.extend({},rt.Data);
											$cookieStore.remove('userInfo');
											userInfo.set($scope.userInfo);
											lyer.msg(rt.Msg,function(){
												$state.go('tixianlist');												
											})
											
											console.log(rt);
										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
			
		}
	
		
	}])
	
	//投资前判断
	
	.controller('touzilistCtrl', ['$scope', '$rootScope', 'API', 'userInfo','playInfo', '$state', 'lyer', '$stateParams','$cookieStore',function($scope, $rootScope, API, userInfo, playInfo,$state, lyer, $stateParams,$cookieStore) {
		// unlogin($scope);
		
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} 
		
		$rootScope.body_class = "order_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.warming=false;
		$scope.upload_PicUrl=false;
		$scope.cancel_btn=false;
		$scope.PlayCollection = $stateParams.PlayCollection;
		$scope.PlayStage = $stateParams.PlayStage;
		$scope.Playid=$stateParams.Playid;
		console.log('$scope.PlayCollection'+$scope.PlayCollection);
		console.log('$scope.PlayStage'+$scope.PlayStage);
		
		//进入游戏查询游戏进度
			var params = {
				'uid': userInfo.get().UId,
				'playid':$scope.Playid,
				'playcollection': $scope.PlayCollection,
				'playstage': $scope.PlayStage
			};
		API.qtInt('/api/yqsPlay/PlaySpeed/', params)
			.success(function(rt) {
				rt = angular.fromJson(rt);				
				if(rt.Code == 0&&(rt.Data.Data.length>0)){
					$scope.userInfo=angular.extend({},rt.Data);
					$cookieStore.remove('userInfo');
					userInfo.set($scope.userInfo);
					$scope.playInfo=$scope.userInfo.Data[0];
					$cookieStore.remove('playInfo');
					playInfo.set($scope.playInfo);
					console.log($scope.playInfo);
					$scope.status=$scope.playInfo.PlayStatus;
					$state.go('touzilist');	
				} 
				else {
					//未查询到游戏进度,新建游戏
					$scope.status=-1;
					$scope.playInfo=angular.extend({},rt.Data);
					$cookieStore.remove('playInfo');
					playInfo.set($scope.playInfo);
					console.log($scope.playInfo);
					$state.go('newtouzi',{
								Playid:$scope.Playid,
								PlayCollection:$scope.PlayCollection,
								PlayStage:$scope.PlayStage
						})	
					}				
			});
			$scope.opendetail=function(OrderType,PlayCollection,PlayId,PlayStage,SchemeId){
			console.log(OrderType);
			console.log(PlayCollection);
			console.log(PlayId);
			console.log(PlayStage);
			console.log(SchemeId);
			if(OrderType==3){
				$state.go('tixiandetail',{
				fundId:OrderId
				});
			}
			else{
				$state.go('touzi',{
						Playid:PlayId,
						PlayCollection:PlayCollection,
						PlayStage:PlayStage,
						SchemeId:SchemeId
					})
			}
		}
			
			
	}])
	
	
	//投资
	.controller('touziCtrl', ['$scope', '$rootScope', 'API', 'userInfo','playInfo', '$state', 'lyer', '$stateParams','$cookieStore',function($scope, $rootScope, API, userInfo, playInfo,$state, lyer, $stateParams,$cookieStore) {
		// unlogin($scope);
		
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} 
		
		$rootScope.body_class = "touzi_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.warming=false;
		$scope.upload_PicUrl=false;
		$scope.cancel_btn=false;
		
		
		$scope.PlayCollection = $stateParams.PlayCollection;
		$scope.PlayStage = $stateParams.PlayStage;
		$scope.Playid=$stateParams.Playid;
		$scope.SchemeId=$stateParams.SchemeId
		console.log('$scope.PlayCollection'+$scope.PlayCollection);
		console.log('$scope.PlayStage'+$scope.PlayStage);
		
		//进入游戏查询游戏进度
			var params = {
				
				SchemeId: $scope.SchemeId
				
			};
		API.qtInt('/api/yqsPlay/PlaySpeed/', params)
			.success(function(rt) {
				rt = angular.fromJson(rt);				
				if(rt.Code == 0) {
					//查询得到游戏进度
					
					$scope.userInfo=angular.extend({},rt.Data);
					$cookieStore.remove('userInfo');
					userInfo.set($scope.userInfo);
					$scope.playInfo=$scope.userInfo.Data[0];
					$cookieStore.remove('playInfo');
					playInfo.set($scope.playInfo);
					console.log($scope.playInfo);
					$scope.status=$scope.playInfo.PlayStatus;
					setInterval(function(){
						var now = new Date(); 
						$scope.playInfo.MatchTime=$scope.playInfo.MatchTime.replace(/\-/g,'/');
						//游戏开始时间
						$scope.playInfo.EndTime=$scope.playInfo.EndTime.replace(/\-/g,'/');
//						游戏结束时间
						var endDate = new Date($scope.playInfo.EndTime).getTime() -now.getTime(); 

						var fkendtime = new Date($scope.playInfo.MatchTime).getTime()- now.getTime()+(1000*60*60*24);
						
						$scope.EndTime=getTMS(endDate);
						$scope.fkendtime=getTMS(fkendtime);

					   function getTMS(time){
					   	var leftsecond=time/1000
					   	var day1=Math.floor(leftsecond/(60*60*24)); 
						var hour=Math.floor((leftsecond-day1*24*60*60)/3600); 
						var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60); 
						var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60); 
						var hour=hour+day1*24;
						
						if(leftsecond<=0){
							return "超时";
						}
						else{
							return hour+":"+minute+":"+second;
						}
					   	
					   }
						
						//var day1=parseInt(leftsecond/(24*60*60*6)); 
						
						
						$scope.$apply();
					},1000)
					
					
				} 
			});
			
		  $scope.buildNewGame=function(){
		  	$scope.warming=true;
		  	
		  }
		  $scope.buildOrder=function(){
		  	var params = {
				'uid': userInfo.get().UId,
				'playid':$scope.Playid,
				'playcollection': $scope.PlayCollection,
				'playstage': $scope.PlayStage
			};
			//确认无误,创建订单
			API.qtInt('/api/yqsPlay/Play/', params)
				.success(function(rt) {
					rt = angular.fromJson(rt)
					if(rt.Code == 0) {
						lyer.msg(rt.Msg,function(){
							$state.reload()
						})
						console.log(rt);
						

					} else {
						lyer.msg(rt.Msg);
						return false;
					}
				});
			
			$scope.warming=false;
		  }
		  $scope.cacel_build=function(){
		  	//反悔,取消创建订单
		  	$scope.warming=false;
		  }
		
		 //0 新方案     50 以匹配    70 付款上传成功     100 已完成

	}])
	

	.controller('newtouziCtrl', ['$scope', '$rootScope', 'API', 'userInfo','playInfo', '$state', 'lyer', '$stateParams','$cookieStore',function($scope, $rootScope, API, userInfo, playInfo,$state, lyer, $stateParams,$cookieStore) {
		// unlogin($scope);
		
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} 
		
		$rootScope.body_class = "touzi_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.warming=false;
		$scope.upload_PicUrl=false;
		$scope.cancel_btn=false;
		
		
		$scope.PlayCollection = $stateParams.PlayCollection;
		$scope.PlayStage = $stateParams.PlayStage;
		$scope.Playid=$stateParams.Playid;
		console.log('$scope.PlayCollection'+$scope.PlayCollection);
		console.log('$scope.PlayStage'+$scope.PlayStage);
		
		//进入游戏查询游戏进度
			var params = {
				'uid': userInfo.get().UId,
				'playid':$scope.Playid,
				'playcollection': $scope.PlayCollection,
				'playstage': $scope.PlayStage
			};
		API.qtInt('/api/yqsPlay/PlaySpeed/', params)
			.success(function(rt) {
				rt = angular.fromJson(rt);				
				if(rt.Code == 0) {
					//查询得到游戏进度
					
					$scope.userInfo=angular.extend({},rt.Data);
					$cookieStore.remove('userInfo');
					userInfo.set($scope.userInfo);
					
				} 			
			});
			
		  $scope.buildNewGame=function(){
		  	$scope.warming=true;
		  	
		  }
		  $scope.buildOrder=function(){
		  	var params = {
				'uid': userInfo.get().UId,
				'playid':$scope.Playid,
				'playcollection': $scope.PlayCollection,
				'playstage': $scope.PlayStage
			};
			//确认无误,创建订单
			API.qtInt('/api/yqsPlay/Play/', params)
				.success(function(rt) {
					rt = angular.fromJson(rt)
					if(rt.Code == 0) {
						lyer.msg(rt.Msg,function(){
							$state.go('touzilist',{
								Playid:$scope.Playid,
								PlayCollection:$scope.PlayCollection,
								PlayStage:$scope.PlayStage
						})	
						})
						console.log(rt);
						

					} else {
						lyer.msg(rt.Msg);
						return false;
					}
				});
			
			$scope.warming=false;
		  }
		  $scope.cacel_build=function(){
		  	//反悔,取消创建订单
		  	$scope.warming=false;
		  }	

	}])
	
	//订单列表
	.controller('orderlistCtrl', ['$scope', '$rootScope','API', 'userInfo', '$state', 'lyer', '$stateParams', function($scope, $rootScope,API, userInfo,$state, lyer,$stateParams) {
		$rootScope.body_class = "order_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.query2=0;
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} 
		$scope.userInfo=userInfo.get();
		$scope.uid=$scope.userInfo.UId;
		//进行查询
			API.qtInt('/api/yqsuser/MyOrder/',{uid:$scope.uid})
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0) {
											$scope.userInfo=angular.extend({},rt.Data);
											
											$scope.order ='OrderId';
											if(rt.Data.Data.length==0){
												lyer.msg('暂无订单信息!');
											}
											
											console.log(rt);
											
										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
		$scope.querylink=function(str1,str2){
			$scope.query=str1;
			$scope.query2=str2;
			console.log($scope.query)
		}

		$scope.opendetail=function(OrderType,PlayCollection,PlayId,PlayStage,SchemeId){
			console.log(OrderType);
			console.log(PlayCollection);
			console.log(PlayId);
			console.log(PlayStage);
			console.log(SchemeId);
			if(OrderType==3){
				$state.go('tixiandetail',{
				fundId:OrderId
				});
			}
			else{
				$state.go('touzi',{
						Playid:PlayId,
						PlayCollection:PlayCollection,
						PlayStage:PlayStage,
						SchemeId:SchemeId
					})
			}
		}
	}])
	
	.controller('qianbaoCtrl', ['$scope', '$rootScope','API', 'userInfo', '$state', 'lyer', '$stateParams','$cookieStore', function($scope, $rootScope,API, userInfo,$state, lyer,$stateParams,$cookieStore) {
		// unlogin($scope);
		$rootScope.body_class = "qianbao_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} 
		$scope.userInfo=userInfo.get();
		$scope.uid=$scope.userInfo.UId;
		//体现前先进行查询
			API.qtInt('/api/yqsuser/Refresh/',{uid:$scope.uid})
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0) {
											$scope.userInfo=angular.extend({},rt.Data);
											$cookieStore.remove('userInfo');
											userInfo.set($scope.userInfo);
											console.log(rt);
										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
		$scope.gotixian=function(){
			$state.go('tixian');
		}
		
		$scope.tixianlist=function(){
			$state.go('tixianlist');
		}


	}])
	
	//个人详情
	.controller('mydetailCtrl', ['$scope', '$rootScope', '$state','userInfo', 'API', 'lyer', '$cookieStore','$stateParams',function($scope, $rootScope, $state,userInfo, API, lyer, $cookieStore,$stateParams) {
				$rootScope.body_class = "qianbao_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} 
			$scope.type = $stateParams.type;
			
			console.log($scope.type);
			$scope.userInfo=userInfo.get();
			$scope.uid=$scope.userInfo.UId;
			API.qtInt('/api/yqsuser/Refresh/',{uid:$scope.uid})
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0) {
											$scope.userInfo=angular.extend({},rt.Data);
											$cookieStore.remove('userInfo');
											userInfo.set($scope.userInfo);
											console.log(rt);
											
											
											
											
											
										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
		if($scope.type==3){
			API.qtInt('/api/yqsuser/Myteam/',{uid:$scope.uid})
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0) {
											$scope.TeamInfo=angular.extend({},rt.Data);
											console.log(rt);

										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
		}
		$scope.showmyteam=function(i){
			$scope.showteamnum=i;
			console.log(i);
		}
	
		}])

		.controller('yqsCtrl', ['$scope', '$rootScope', '$state', 'API', 'lyer', '$base64', 'userInfo', function($scope, $rootScope, $state, API, lyer, $base64, userInfo) {
			$rootScope.body_class = "yqs_bg";
			$scope.footerShow = true;
			$scope.titleShow = true;
			$scope.gamestart=false;
			if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
			} 
			layer.open({
				    content: '欢迎来到摇钱树,进去游戏需要消耗1张抽奖券!点击OK开启游戏'
				    ,btn: ['好的', '不要']
				    ,yes: function(index){
				      layer.close(index);
				      $scope.gamestart=true;
				    }
				    ,no:function(){
				    	$state.go('index');
				    }
				  });
			
			$scope.startGame=function(){
				
					API.qtInt('/api/yqslottery/Lottery/',{uid:userInfo.get().UId})
									.success(function(rt) {
										rt = angular.fromJson(rt)
										if(rt.Code == 0) {
											$scope.LotteryInfo=angular.extend({},rt.Data);
											console.log(rt);
											lyer.msg(rt.Msg+'您获得了'+rt.Data.Data[0].Desc,function(){
												$state.go('index');
											});
											

										} else {
											lyer.msg(rt.Msg);
											return false;
										}
									});
				
				
				
			}
	
	
		}])
	
	

	//规则
	.controller('guizeCtrl', ['$scope','$rootScope', function($scope,$rootScope) {
		$rootScope.body_class = "login_bgbg";
		$scope.footerShow = true;
		$scope.titleShow = true;
	}])

	.controller('otherCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
		$scope.userid = $stateParams.userid;
		if(angular.isUndefined($scope.userid)) {
			$state.go('index');
			return false;
		}
		// console.log()
	}])

})(window, angular);