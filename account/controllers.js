account.controller('loginController',[
    '$scope',
    '$rootScope',
    '$state',
    '$window',
    '$http',
    'localStorageService',
    'common.commonService',
    'account.accountService',
    function(
        $scope,
        $rootScope,
        $state,
        $window,
        $http,
        localStorageService,
        commonService,
        accountService
    ){
        $scope.data = {};
        $scope.login = function(){
            // console.log($scope.data.username && $scope.data.password);
            if($scope.data.username && $scope.data.password){
                accountService.loginPromise({
                    username: $scope.data.username,
                    password: $scope.data.password,
                    dtype: '3'
                })
                .then(function(response){
                    if(response.code == 0){
                        var state = accountService.getNextState();
                        var params = accountService.getNextParams();
                        localStorageService.set('token',response.data.token);
                        localStorageService.set('username',$scope.data.username);
                        accountService.getVisibilityPromise()
                        .then(function(response){
                            console.log(response);
                            // $rootScope.access_list = response.result;
                            localStorageService.set('access_list',response.result.toString());
                            $state.go(state,params);
                        },function(error){
                            $state.go(state,params);
                        });
                    }
                    else{
                        $window.alert('登录失败');
                    }
                });
            }
            else{
                $window.alert('请输入正确的用户名和密码');
            }
        }

        // $scope.pressEnter = function(event){
        //     console.log(event.which);
        // }

    }
])
.directive('pressEnter', function () {
    return {
        restrict: 'A',
        scope: {
            login: '&pressEnter'
        },
        link: function (scope, element, attrs) {
            element[0].focus();
            element.bind("keydown", function (event) {
                // console.log('press key')
                if(event.which === 13) {
                    scope.login();
                    event.preventDefault();
                }
            });
        }

    };
})
