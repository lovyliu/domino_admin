staff.controller('staffListController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    '$timeout',
    'common.commonService',
    'staff.staffService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        $timeout,
        commonService,
        staffService
    ) {
        $scope.page_state = {
            filters: {
                limit: 20,
            }
        };
        $scope.now = new Date().toString();

        $scope.searchStaffs = function(){
            var params = commonService.constructURLParams($scope.page_state.filters);
            console.log(params);
            staffService.listPromise(params)
            .then(function(response){
                console.log(response);
                if(response){
                    $scope.staff_list = response.results;
                    $scope.page_state.count = response.count;
                }
            });
        };
        $scope.searchFirstStaffs = function(){
            $scope.page_state.current_page = 1;
            $scope.page_state.filters.offset = 0;
            $scope.searchStaffs();
        };
        $scope.searchFirstStaffs();

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
            $scope.searchStaffs();
        };

        $scope.goDetail = function(staff_id){
            $state.go('menu.content.staff.detail',{staff_id:staff_id});
        };

        var delete_staff = false;
        $scope.deleteMultipleStaff = function(){
            delete_staff = false;
            $rootScope.openModal('modal-basic',
                '是否删除选中员工？',
                '删除员工',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!delete_staff){
                        $timeout(function(){
                            angular.forEach($scope.staff_list,function(staff){
                                if(staff.selected){
                                    staffService.deleteStaffPromise(staff.id)
                                    .then(function(response){
                                        $scope.searchStaffs();
                                    },function(error){
                                        $rootScope.openModal('modal-confirm','删除员工【' + staff.name + '】失败。错误代码：' + error.status,'操作提示');
                                    });
                                }
                            });
                        });
                    }
                }
                delete_staff = true;
            });

        };

        $scope.selectAllStaff = function(){
            angular.forEach($scope.staff_list,function(staff){
                staff.selected = $scope.page_state.select_all;
            });
        };

    }
])
.controller('newStaffController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    'common.commonService',
    'dealer.dealerService',
    'staff.staffService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        commonService,
        dealerService,
        staffService
    ) {
        $scope.createStaff = function(){
            staffService.createStaffPromise($scope.post_data)
            .then(function(response){
                console.log(response);
                commonService.responseModal(response.status);
                $('#modal-confirm-button').click(function() {
                    $('#modal-confirm-button').unbind();
                    $state.go('menu.content.staff.detail',{staff_id:response.data.id});
                });
            },function(error){
                console.log(error);
                commonService.responseModal(error.status,error.data);
            });
        };
        // dealerService.listPromise()
        // .then(function(response))
    }
])
.controller('staffDetailController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    '$timeout',
    'common.commonService',
    'department.departmentService',
    'staff.staffService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        $timeout,
        commonService,
        departmentService,
        staffService
    ) {
        var staff_id = $stateParams.staff_id;

        $scope.post_data = {
            name: null,
            gender: null,
            birthday: null,
            id_number: null,
            mobile: null,
            email: null,
        };
        staffService.detailPromise(staff_id)
        .then(function(response){
            console.log(response);
            if(response){
                $scope.staff = response;
                angular.forEach($scope.post_data,function(value,key){
                    $scope.post_data[key] = response[key];
                });
            }
        });

        $scope.department_staff_filters = {
            limit: 20,
            offset: 0,
        };
        $scope.getDepartmentStaffRelation = function(){
            $scope.department_staff_filters.staff__id = staff_id;
            var params = commonService.constructURLParams($scope.department_staff_filters);
            departmentService.departmentStaffRelationPromise(params)
            .then(function(response){
                $scope.department_staff_count = response.count;
                $scope.department_staff_list = response.results;
            });


        };
        $scope.getDepartmentStaffRelation();


        $scope.updateStaff = function(){
            staffService.updateStaffPromise(staff_id,$scope.post_data)
            .then(function(response){
                console.log(response);
                if(response)
                commonService.responseModal(response.status);
            },function(error){
                commonService.responseModal(error.status);
            });
        };

        var delete_staff = false;
        $scope.deleteStaff = function(){
            delete_staff = false;
            $rootScope.openModal('modal-basic',
                '是否删除该员工？',
                '删除员工',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!delete_staff){
                        $timeout(function(){
                            staffService.deleteStaffPromise(staff_id)
                            .then(function(response){
                                $('#modal-basic').on('hidden.bs.modal', function () {
                                    $('body').addClass('modal-open');
                                });
                                $rootScope.openModal('modal-confirm','删除成功','操作提示','','','delete-confirm');
                                $('#modal-confirm-button').click(function() {
                                    $('#modal-confirm-button').unbind();
                                    if($('#modal-confirm-button').hasClass('delete-confirm')){
                                        $state.go('menu.content.staff.list');
                                    }
                                });
                            },function(error){
                                $rootScope.openModal('modal-confirm','请求出错，错误代码：' + error.status,'操作提示');
                            });
                        });
                    }
                }
                delete_staff = true;
            });

        };

    }
])
.controller('bindDepartmentController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    '$timeout',
    'common.commonService',
    'department.departmentService',
    'staff.staffService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        $timeout,
        commonService,
        departmentService,
        staffService
    ) {
        var staff_id = $scope.staff_id = $stateParams.staff_id;
        $scope.department_staff_relation = {};

        staffService.detailPromise(staff_id)
        .then(function(response){
            if(response){
                $scope.staff = response;
                if($stateParams.relation_id){
                    departmentService.departmentStaffRelationDetailPromise($stateParams.relation_id)
                    .then(function(response){
                        $scope.department_staff_relation = response;
                        $scope.changeDepartment();
                    });
                }
            }
        });


        $scope.changeDepartment = function(){
            var department_id = $scope.department_staff_relation.department;
            if(department_id){
                departmentService.positionListPromise('?limit=100&department__id=' + department_id)
                .then(function(response){
                    $scope.staff_roles = response.results;
                });
                // angular.forEach($scope.department_list,function(department){
                //     if(department.id == $scope.department_staff_relation.department){
                //         $scope.staff_roles = department.position.split(',');
                //     }
                // });
            }
        };

        departmentService.listPromise('?limit=100')
        .then(function(response){
            $scope.department_list = response.results;
        });

        $scope.saveRelation = function(){
            var post_data = {
                staff: staff_id,
                department: $scope.department_staff_relation.department,
                status: $scope.department_staff_relation.status,
                position: $scope.department_staff_relation.position
            };
            if($scope.department_staff_relation.id){
                departmentService.updateDepartmentStaffRelationPromise($scope.department_staff_relation.id,post_data)
                .then(function(response){
                    console.log(response);
                    if(response){
                        commonService.responseModal(200);
                    }
                },function(error){
                    commonService.responseModal(error.status);
                });
            }
            else{
                departmentService.createDepartmentStaffRelationPromise(post_data)
                .then(function(response){
                    console.log(response);
                    if(response){
                        $scope.department_staff_relation = response;
                        commonService.responseModal(201);
                    }
                },function(error){
                    commonService.responseModal(error.status,error.data);
                });
            }

        };

    }
])
;
