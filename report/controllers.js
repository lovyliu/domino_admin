report.controller('reportListController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    '$timeout',
    'common.commonService',
    'report.reportService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        $timeout,
        commonService,
        reportService
    ) {
        $scope.page_state = {
            filters: {
                // limit: 20,
            }
        };

        // $scope.searchReports = function(){
        //     var params = commonService.constructURLParams($scope.page_state.filters);
        //     console.log(params);
        //     reportService.listPromise(params)
        //     .then(function(response){
        //         console.log(response);
        //         if(response){
        //             $scope.reports = response.results;
        //             $scope.page_state.count = response.count;
        //         }
        //     });
        // };
        // $scope.searchFirstReports = function(){
        //     $scope.page_state.filters.offset = 0;
        //     $scope.searchReports();
        // };
        // $scope.searchReports();
        //
        // $scope.page_state.current_page = 1;
        // $scope.page_state.filters.offset = 0;
        // $scope.pageChanged = function(page) {
        //     console.log('page num:',page);
        //     if(page > 1){
        //         $scope.page_state.filters.offset = (page - 1) * 20;
        //     }
        //     else{
        //         $scope.page_state.filters.offset = 0;
        //     }
        //     $scope.searchReports();
        // };


    }
])
.controller('reportDetailController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    '$timeout',
    'common.commonService',
    'report.reportService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        $timeout,
        commonService,
        reportService
    ) {
        $scope.page_state = {
            filters: {
                limit: 20,
                offset: 0
            }
        };
        $scope.now = new Date().toString();

        $scope.searchReports = function(){
            var filters = angular.copy($scope.page_state.filters);
            if(filters.app_id && filters.app_id.indexOf(',') != -1){
                filters.app_id__in = angular.copy(filters.app_id);
                delete filters.app_id;
            }
            if(filters.clt_nm && filters.clt_nm.indexOf(',') != -1){
                filters.clt_nm__in = angular.copy(filters.clt_nm);
                delete filters.clt_nm;
            }
            if(filters.mobile && filters.mobile.indexOf(',') != -1){
                filters.mobile__in = angular.copy(filters.mobile);
                delete filters.mobile;
            }
            if(filters.id_no && filters.id_no.indexOf(',') != -1){
                filters.id_no__in = angular.copy(filters.id_no);
                delete filters.id_no;
            }
            var params = commonService.constructURLParams(filters);
            console.log(params);
            reportService.detailListPromise(params)
            .then(function(response){
                console.log(response);
                if(response){
                    $scope.reports = response.results;
                    $scope.fields = response.fields;
                    $scope.page_state.count = response.count;
                }
            });
        };
        $scope.searchFirstReports = function(){
            $scope.page_state.current_page = 1;
            $scope.page_state.filters.offset = 0;
            $scope.searchReports();
        };
        // $scope.searchReports();

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
            $scope.searchReports();
        };

        $scope.exportFile = function(){
            var params = commonService.constructURLParams($scope.page_state.filters);
            console.log(params);
            var link = reportService.exportFileLink(params);
            $window.open(link);
        };




    }
])
;
