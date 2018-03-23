var account = angular.module('account',
    [
        'api',
    ]
);
account.service('account.accountService',
    [
        '$http',
        '$q',
        'api',
        'localStorageService',
        function(
            $http,
            $q,
            api,
            localStorageService
        ){
            this.loginPromise = function(params){
                var defer = $q.defer();
                var url = api.account.login();
                $http.post(url,params)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.logoutPromise = function(){
                var defer = $q.defer();
                var url = api.account.login();
                $http.delete(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.checkUserPromise = function(){
                var defer = $q.defer();
                var url = api.account.checkUser();
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getVisibilityPromise = function(){
                var defer = $q.defer();
                var url = api.account.visibility();
                $http.get(url)
                .then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error);
                });
                return defer.promise;
            };
            this.getAccount = function(){
                return localStorageService.get('has_sccount');
            };
            this.state = null;
            this.params = null;
            this.setNextState = function(state){
                this.state = state;
            };
            this.getNextState = function(){
                return this.state;
            };
            this.setNextParams = function(params){
                this.params = params;
            };
            this.getNextParams = function(){
                return this.params;
            };
        }
    ]
);
