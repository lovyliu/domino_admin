var dashboard = angular.module('dashboard',['api']);

dashboard.service('dashboard.dashboardService',
[
    '$http',
    '$q',
    'api',
    function(
        $http,
        $q,
        api
    ){
        this.kpiListPromise = function(params){
            var defer = $q.defer();
            var params = params || '';
            var url = api.dashboard.dash_kpi() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.rankingListPromise = function(params){
            var defer = $q.defer();
            var params = params || '';
            var url = api.dashboard.ranking() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        // this.listPromise = function(params){
        //     var defer = $q.defer();
        //     var params = params || '';
        //     var url = api.dashboard.list() + params;
        //     $http.get(url)
        //     .then(function(response){
        //         defer.resolve(response.data);
        //     },function(error){
        //         defer.reject(error);
        //     });
        //     return defer.promise;
        // };


    }
]);
