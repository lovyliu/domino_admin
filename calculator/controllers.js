calculator.controller('calculatorController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    'common.commonService',
    'calculator.calculatorService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        commonService,
        calculatorService
    ) {
        // calculatePromise
        $scope.page_state = {
            filters: {

            }
        };

        $scope.page_state.upload_type = $stateParams.upload_type || null;

        $scope.calculate = function(){
            var params = commonService.constructURLParams($scope.page_state.filters);
            calculatorService.calculatePromise(params)
            .then(function(response){
                console.log(response);
                if(response){
                    $scope.calculated_data = response;
                }
                else{
                    $rootScope.openModal('modal-confirm','计算失败，请重新尝试', '操作提示');
                }
            },function(error){
                commonService.responseModal(error.status);
            });
        };
        $scope.resetCaculator = function(){
            angular.forEach($scope.page_state.filters,function(key,value){
                value = null;
            });
            $scope.calculated_data = null;
        };

    }
])
;
