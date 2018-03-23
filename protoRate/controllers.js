protoRate.controller('protoRateListController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$timeout',
    'common.commonService',
    'protoRate.protoRateService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $timeout,
        commonService,
        protoRateService
    ) {
        $scope.page_state = {
            filters: {
                limit: 20,
            }
        };
        var post_data = {
            effect_36: true,
            effect_24: true
        };
        $scope.post_data = angular.copy(post_data);

        function getProtoRateList(){
            var params = commonService.constructURLParams($scope.page_state.filters);
            protoRateService.listPromise(params)
            .then(function(response){
                // console.log(response);
                if(response){
                    $scope.proto_rate_list = response.results;
                    $scope.page_state.count = response.count;
                }
            });
        };
        getProtoRateList();


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
            getProtoRateList();
        };

        $scope.$watchGroup(
            [
                'post_data.interest_rate',
                'post_data.dealer_rate_24',
                'post_data.dealer_rate_36'
            ],function (new_value,old_value) {
                if(new_value[0] && new_value[1] && new_value[0] != old_value[0] && new_value[1] != old_value[1]){
                    console.log('calculate 2 years rate');
                }
                if(new_value[0] && new_value[2] && new_value[0] != old_value[0] && new_value[2] != old_value[2]){
                    console.log('calculate 3 years rate');
                }
                else{
                    $scope.post_data.rate_24 = null;
                    $scope.post_data.rate_36 = null;
                    $scope.post_data.million_coefficient_24 = null;
                    $scope.post_data.million_coefficient_36 = null;
                }
            }
        );

        $scope.autoCalculate = function(){
            if($scope.post_data.interest_rate){
                protoRateService.autoCalculatePromise($scope.post_data.interest_rate)
                .then(function(response){
                    console.log(response);
                    if(response.code == 0){
                        $scope.post_data.rate_24 = response.results.rate_24;
                        $scope.post_data.rate_36 = response.results.rate_36;
                        $scope.post_data.million_coefficient_24 = response.results.million_coefficient_24;
                        $scope.post_data.million_coefficient_36 = response.results.million_coefficient_36;
                    }
                });
            }
        };

        $scope.createProtoRate = function(){
            protoRateService.createProtoRatePromise($scope.post_data)
            .then(function(response){
                if(response){
                    commonService.responseModal('200');
                    getProtoRateList();
                    $scope.post_data = angular.copy(post_data);
                }
            },function(error){
                commonService.responseModal(error.status);
            });
        };

        var deleted = false;
        $scope.deleteMultipleProtoRate = function(){
            deleted = false;
            $rootScope.openModal('modal-basic',
                '是否删除该选中产品模型？',
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
                            angular.forEach($scope.proto_rate_list,function(proto_rate){
                                if(proto_rate.selected){
                                    protoRateService.deleteProtoRatePromise(proto_rate.id)
                                    .then(function(response){
                                        getProtoRateList();
                                    },function(error){
                                        $rootScope.openModal('modal-confirm','删除产品模型【' + proto_rate.name + '】失败。错误代码：' + error.status,'操作提示');
                                    });
                                }
                            });
                        });
                    }
                }
                deleted = true;
            });

        };

        $scope.selectAllProtoRate = function(){
            angular.forEach($scope.proto_rate_list,function(proto_rate){
                proto_rate.selected = $scope.page_state.select_all;
            });
        };

    }
])
.controller('protoRateDetailController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    '$timeout',
    'common.commonService',
    'dealer.dealerService',
    'protoRate.protoRateService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        $timeout,
        commonService,
        dealerService,
        protoRateService
    ) {
        var proto_rate_id = $stateParams.proto_rate_id;
        $scope.post_data = {};
        protoRateService.detailPromise(proto_rate_id)
        .then(function(response){
            console.log(response);
            if(response){
                $scope.post_data = response;
            }
        });

        $scope.autoCalculate = function(){
            if($scope.post_data.interest_rate){
                protoRateService.autoCalculatePromise($scope.post_data.interest_rate)
                .then(function(response){
                    console.log(response);
                    if(response.code == 0){
                        $scope.post_data.rate_24 = response.results.rate_24;
                        $scope.post_data.rate_36 = response.results.rate_36;
                        $scope.post_data.million_coefficient_24 = response.results.million_coefficient_24;
                        $scope.post_data.million_coefficient_36 = response.results.million_coefficient_36;
                    }
                });
            }
        };

        $scope.updateProtoRate = function(){
            protoRateService.updateProtoRatePromise(proto_rate_id,$scope.post_data)
            .then(function(response){
                console.log(response);
                if(response){
                    commonService.responseModal('200');
                }
            },function(error){
                commonService.responseModal(error.status);
            });
        };

        var deleted = false;
        $scope.deleteProtoRate = function(){
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
                            protoRateService.deleteProtoRatePromise(proto_rate_id)
                            .then(function(response){
                                $('#modal-basic').on('hidden.bs.modal', function () {
                                    $('body').addClass('modal-open');
                                });
                                $rootScope.openModal('modal-confirm','删除成功','操作提示','','','delete-confirm');
                                $('#modal-confirm-button').click(function() {
                                    $('#modal-confirm-button').unbind();
                                    if($('#modal-confirm-button').hasClass('delete-confirm')){
                                        $state.go('menu.content.protoRate.list');
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
])
;
