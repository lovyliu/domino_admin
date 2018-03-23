var department = angular.module('department',['api']);

department.service('department.departmentService',
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
            var url = api.department.list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.detailPromise = function(dlr_id){
            var defer = $q.defer();
            var url = api.department.detail(dlr_id);
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.createDepartmentPromise = function(data){
            var defer = $q.defer();
            var url = api.department.list();
            $http.post(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.updateDepartmentPromise = function(department_id,data){
            var defer = $q.defer();
            var url = api.department.detail(department_id);
            $http.put(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.patchDepartmentPromise = function(department_id,data){
            var defer = $q.defer();
            var url = api.department.detail(department_id);
            $http.patch(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.deleteDepartmentPromise = function(department_id){
            var defer = $q.defer();
            var url = api.department.detail(department_id);
            $http.delete(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.departmentStaffRelationPromise = function(params){
            var defer = $q.defer();
            var url = api.department.department_staff_relation() + params || '';
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.departmentStaffRelationDetailPromise = function(relation_id){
            var defer = $q.defer();
            var url = api.department.department_staff_relation_detail(relation_id);
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.createDepartmentStaffRelationPromise = function(data){
            var defer = $q.defer();
            var url = api.department.department_staff_relation();
            $http.post(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.updateDepartmentStaffRelationPromise = function(ship_id,data){
            var defer = $q.defer();
            var url = api.department.department_staff_relation_detail(ship_id);
            $http.put(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.deleteDepartmentStaffRelationPromise = function(relation_id){
            var defer = $q.defer();
            var url = api.department.department_staff_relation_detail(relation_id);
            $http.delete(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.positionListPromise = function(params){
            var defer = $q.defer();
            var params = params || '';
            var url = api.department.position_list() + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.createPositionPromise = function(data){
            var defer = $q.defer();
            var url = api.department.position_list();
            $http.post(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.updatePositionPromise = function(position_id,data){
            var defer = $q.defer();
            var url = api.department.position_detail(position_id);
            $http.put(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.deletePositionPromise = function(position_id){
            var defer = $q.defer();
            var url = api.department.position_detail(position_id);
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
