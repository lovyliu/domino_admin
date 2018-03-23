upload.controller('uploadController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    'common.commonService',
    'upload.uploadService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        commonService,
        uploadService
    ) {
        $scope.page_state = {
            filters: {
                limit: 20,
            },
            valid: null
        };
        $scope.resetUpload = function(){
            $scope.data_list = null;
            $scope.page_state.upload_type = null;
            $scope.table_title = null;
        };

        $scope.page_state.upload_type = $stateParams.upload_type || null;


        $scope.changeUploadType = function(){
            $scope.data_list = null;
            if($scope.page_state.upload_type){
                uploadService.getTableTitlePromise($scope.page_state.upload_type)
                .then(function(response){
                    if(response.code == 0){
                        $scope.table_title = response.result;
                    }
                });
            }
        };
        $scope.changeUploadType();

        $scope.$watch('page_state.file',function(new_value,old_value){
            if(new_value){
                console.log(new_value);
                $scope.page_state.valid = true;
                uploadService.uploadPromise(new_value,$scope.page_state.upload_type)
                .then(function(response){
                    console.log(response);
                    $scope.page_state.uploading = false;
                    $scope.data_list = response.result.data;
                    $scope.data_id = response.result.data_id;
                    angular.forEach($scope.data_list,function(data){
                        if(Object.keys(data.error).length){
                            $scope.page_state.valid = false;
                        }
                    });
                },function(error){
                    commonService.errorModal(error.status);
                });
            }
        });


        $scope.saveUpload = function(){
            uploadService.saveUploadPromise('?data_id=' + $scope.data_id,$scope.page_state.upload_type)
            .then(function(response){
                if(response.code == 0){
                    $rootScope.openModal('modal-confirm','保存成功', '操作提示');
                    $scope.resetUpload();
                }
                else{
                    $rootScope.openModal('modal-confirm','数据导入失败，请重新尝试', '操作提示');
                }
            },function(error){
                commonService.responseModal(error.status);
            });
        };

    }
])
;
