vehicle.controller('vehicleListController',
    [
        '$scope',
        'common.commonService',
        'vehicle.vehicleService',
        function(
            $scope,
            commonService,
            vehicleService
        ) {
            $scope.page_state = {
                filters:{
                    limit: 20,
                },
                current_page: 1,
            };
            $scope.searchVehicles = function(){
                var params = commonService.constructURLParams($scope.page_state.filters);
                vehicleService.modelListPromise(params)
                .then(function(response){
                    if(response){
                        $scope.vehicle_list = response.results;
                        $scope.page_state.count = response.count;
                    }
                });
            };
            $scope.searchFirstVehicles = function(){
                $scope.page_state.current_page = 1;
                $scope.page_state.filters.offset = 0;
                $scope.searchVehicles();
            };
            $scope.searchFirstVehicles();

            $scope.page_state.current_page = 1;
            $scope.page_state.filters.offset = 0;
            $scope.pageChanged = function(page) {
                console.log('page num:',page);
                if(page > 1){
                    $scope.page_state.filters.offset = (page - 1) * 20;
                }
                else{
                    $scope.page_state.filters.offset = 0;
                }
                $scope.searchVehicles();
            };
        }
    ]
)
.controller('vehicleDetailController',
    [
        '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$timeout',
        'common.commonService',
        'vehicle.vehicleService',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $timeout,
            commonService,
            vehicleService
        ) {
            $scope.page_state = {

            };
            var vehicle_id = $stateParams.vehicle_id;
            vehicleService.modelDetailPromise(vehicle_id)
            .then(function(response){
                $scope.vehicle = response;
            });

            $scope.updateVehicle = function(){
                vehicleService.updateModelPromise(vehicle_id,$scope.vehicle)
                .then(function(response){
                    if(response){
                        commonService.responseModal('200');
                    }
                },function(error){
                    commonService.responseModal(error.status);
                });
            };

            var deleted = false;
            $scope.deleteModel = function(){
                deleted = false;
                $rootScope.openModal('modal-basic',
                    '是否删除该产品模型？',
                    '删除产品模型',
                    '确认删除',
                    '放弃',
                    'delete-confirm'
                );
                $('#modal-ok-button').click(function() {
                    $('#modal-ok-button').unbind();
                    $('body').addClass('modal-open');
                    if($('#modal-ok-button').hasClass('delete-confirm')){
                        if(!deleted){
                            $timeout(function(){
                                vehicleService.deleteModelPromise(vehicle_id)
                                .then(function(response){
                                    $('#modal-basic').on('hidden.bs.modal', function () {
                                        $('body').addClass('modal-open');
                                    });
                                    $rootScope.openModal('modal-confirm','删除成功','操作提示','','','delete-confirm');
                                    $('#modal-confirm-button').click(function() {
                                        $('#modal-confirm-button').unbind();
                                        if($('#modal-confirm-button').hasClass('delete-confirm')){
                                            $state.go('menu.content.vehicle.list');
                                        }
                                    });
                                },function(error){
                                    $rootScope.openModal('modal-confirm','请求出错，错误代码：' + error.status,'操作提示');
                                });
                            });
                        }
                    }
                    deleted = true;
                });

            };


        }
    ]
)
.controller('newModelController',
    [
        '$scope',
        '$state',
        '$stateParams',
        'common.commonService',
        'vehicle.vehicleService',
        function(
            $scope,
            $state,
            $stateParams,
            commonService,
            vehicleService
        ) {
            $scope.vehicle = {};

            $scope.page_state = {
                brand_filters: {
                    limit: 1000,
                    level: 0,
                    brand_name: null
                },
                trix_filters: {
                    limit: 1000,
                    level: 1,
                    brand_name: null
                }
            };
            $scope.searchBrand = function(){
                var params = commonService.constructURLParams($scope.page_state.brand_filters);
                vehicleService.brandListPromise(params)
                .then(function(response){
                    if(response){
                        $scope.brand_list = response.results;
                        $scope.selectBrand(0);
                    }
                });
            };
            $scope.searchBrand();

            $scope.selectBrand = function(index){
                $scope.selected_brand_index = index;
                var selected_brand_id = $scope.brand_list[index].id;
                $scope.searchTrix(selected_brand_id);
            };

            $scope.searchTrix = function(brand_id){
                $scope.page_state.trix_filters.superior__id = brand_id;
                var params = commonService.constructURLParams($scope.page_state.trix_filters);
                vehicleService.brandListPromise(params)
                .then(function(response){
                    if(response){
                        $scope.trix_list = response.results;
                        $scope.selectTrix(0);
                    }
                });
            };

            $scope.selectTrix = function(index){
                $scope.selected_trix_index = index;
                $scope.vehicle.trix = $scope.trix_list[$scope.selected_trix_index].id;
            };


            $scope.createVehicle = function(){
                vehicleService.createModelPromise($scope.vehicle)
                .then(function(response){
                    if(response){
                        commonService.responseModal('200');
                        $('#modal-confirm-button').click(function() {
                            $('#modal-confirm-button').unbind();
                            $state.go('menu.content.vehicle.detail',{vehicle_id:response.id});
                        });
                    }
                },function(error){
                    commonService.responseModal(error.status);
                });
            };


        }
    ]
);
