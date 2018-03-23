var dealer = angular.module('dealer',['api']);

dealer.service('dealer.dealerService',
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
            var url = api.dealer.list() + params;
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
            var url = api.dealer.detail(dlr_id);
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.createDealerPromise = function(data){
            var defer = $q.defer();
            var url = api.dealer.list();
            $http.post(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.updateDealerPromise = function(dealer_id,data){
            var defer = $q.defer();
            var url = api.dealer.detail(dealer_id);
            $http.put(url,data)
            .then(function(response){
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.patchDealerPromise = function(dealer_id,data){
            var defer = $q.defer();
            var url = api.dealer.detail(dealer_id);
            $http.patch(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.deleteDealerPromise = function(dealer_id){
            var defer = $q.defer();
            var url = api.dealer.detail(dealer_id);
            $http.delete(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.staffListPromise = function(){
            var defer = $q.defer();
            var url = api.dealer.staff_list();
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.brandListPromise = function(param){
            var defer = $q.defer();
            var url = param ? api.dealer.brand_list() + param : api.dealer.brand_list();
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.trixListPromise = function(brand_id,param){
            var defer = $q.defer();
            var url = param ? api.dealer.trix_list(brand_id) + param : api.dealer.trix_list(brand_id);
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.modelListPromise = function(trix_id){
            var defer = $q.defer();
            var url = api.dealer.model_list(trix_id);
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.filterTrixListPromise = function(id_list){
            var defer = $q.defer();
            var url = api.dealer.filter_trix_list(id_list);
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.dealerEmployeeRelationPromise = function(params){
            var defer = $q.defer();
            var url = api.dealer.dealer_employee_relation() + params || '';
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.createDealerEmployeeRelationPromise = function(data){
            var defer = $q.defer();
            var url = api.dealer.dealer_employee_relation();
            $http.post(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.updateDealerEmployeeRelationPromise = function(ship_id,data){
            var defer = $q.defer();
            var url = api.dealer.dealer_employee_relation_detail(ship_id);
            $http.put(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.deleteDealerEmployeeRelationPromise = function(relation_id){
            var defer = $q.defer();
            var url = api.dealer.dealer_employee_relation_detail(relation_id);
            $http.delete(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.dealerProtoRateRelationPromise = function(params){
            var defer = $q.defer();
            var url = api.dealer.dealer_proto_rate_relation() + params || '';
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.createDealerProtoRateRelationPromise = function(data){
            var defer = $q.defer();
            var url = api.dealer.dealer_proto_rate_relation();
            $http.post(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.patchDealerProtoRateRelationPromise = function(ship_id,data){
            var defer = $q.defer();
            var url = api.dealer.dealer_proto_rate_relation_detail(ship_id);
            $http.patch(url,data)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.dealerPlateListPromise = function(dealer_id,params){
            var defer = $q.defer();
            var params = params || '';
            var url = api.dealer.dealer_plate(dealer_id) + params;
            $http.get(url)
            .then(function(response){
                defer.resolve(response.data);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
        this.updateDealerPlatePromise = function(dealer_id,data){
            var defer = $q.defer();
            var url = api.dealer.dealer_plate(dealer_id);
            $http({
                method: 'PUT',
                url: url,
                data: data
            })
            .then(function(response){
                defer.resolve(response);
            },function(error){
                defer.reject(error);
            });
            return defer.promise;
        };
    }
]);
