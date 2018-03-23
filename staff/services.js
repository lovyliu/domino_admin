var staff = angular.module('staff',['api']);

staff.service('staff.staffService',
[
    '$http',
    '$q',
    'api',
    function(
        $http,
        $q,
        api
    ){
        this.listPromise = function(params){
            var defer = $q.defer();
            var params = params || '';
            var url = api.staff.list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.detailPromise = function(staff_id){
            var defer = $q.defer();
            var url = api.staff.detail(staff_id);
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.createStaffPromise = function(data){
            var defer = $q.defer();
            var url = api.staff.list();
            $http.post(url,data)
            .then(function(response){
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.updateStaffPromise = function(staff_id,data){
            var defer = $q.defer();
            var url = api.staff.detail(staff_id);
            $http.put(url,data)
            .then(function(response){
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.deleteStaffPromise = function(staff_id){
            var defer = $q.defer();
            var url = api.staff.detail(staff_id);
            $http.delete(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };


    }
]);
