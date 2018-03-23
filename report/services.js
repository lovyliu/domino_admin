var report = angular.module('report',['api']);

report.service('report.reportService',
[
    '$http',
    '$q',
    'api',
    function(
        $http,
        $q,
        api
    ){
        this.detailListPromise = function(params){
            var defer = $q.defer();
            var params = params || '';
            var url = api.report.detail_list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.exportFileLink = function(params){
            var defer = $q.defer();
            var params = params || '';
            var url = api.report.export_file() + params;
            return url;
        };


    }
]);
