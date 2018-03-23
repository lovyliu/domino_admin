department.controller('departmentListController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    'common.commonService',
    'staff.staffService',
    'department.departmentService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        commonService,
        staffService,
        departmentService
    ) {
        $scope.page_state = {
            filters: {
                limit: 20,
                ordering: '',
            }
        };
        staffService.listPromise('?limit=1000')
        .then(function(response){
            $scope.page_state.staff_list = response.results;
        });

        $scope.searchDepartments = function(){
            var params = commonService.constructURLParams($scope.page_state.filters);
            console.log(params);
            departmentService.listPromise(params)
            .then(function(response){
                console.log(response);
                if(response){
                    $scope.departments = response.results;
                    console.log($scope.departments)
                    $scope.page_state.count = response.count;
                }
            });
        };
        $scope.searchFirstDepartments = function(){
            $scope.page_state.current_page = 1;
            $scope.page_state.filters.offset = 0;
            $scope.searchDepartments();
        };
        $scope.searchFirstDepartments();

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
            $scope.searchDepartments();
        };

    }
])
.controller('newDepartmentController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    'common.commonService',
    'department.departmentService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        commonService,
        departmentService
    ) {
        $scope.post_data = {};

        $scope.createDepartment = function() {
            departmentService.createDepartmentPromise($scope.post_data)
            .then(function(response){
                console.log(response);
                if(response){
                    $rootScope.openModal('modal-confirm','新建部门成功','操作提示');
                    $('#modal-confirm-button').click(function() {
                        $('#modal-confirm-button').unbind();
                        $state.go('menu.content.department.detail',{department_id:response.id});
                    });
                }
            },function(error){
                $rootScope.openModal('modal-confirm','新建部门失败','操作提示');
            });
        };
    }
])
.controller('departmentDetailController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$timeout',
    '$window',
    'common.commonService',
    'staff.staffService',
    'bank.bankService',
    'protoRate.protoRateService',
    'staff.staffService',
    'vehicle.vehicleService',
    'department.departmentService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $timeout,
        $window,
        commonService,
        staffService,
        bankService,
        protoRateService,
        staffService,
        vehicleService,
        departmentService
    ) {
        var department_id = $scope.department_id = $stateParams.department_id;
        $scope.staff_status = commonService.staff_status();
        $scope.staff_relation_filters = {
            limit: 20,
            offset: 0
        };
        $scope.now = new Date().toString();
        $scope.post_data = {};

        departmentService.detailPromise(department_id)
        .then(function(detail_response){
            if(detail_response){
                $scope.department = detail_response;
                $scope.post_data = detail_response;
            }
        });


        var deleted_department = false;
        $scope.deleteDepartment = function(){
            deleted_department = false;
            $rootScope.openModal('modal-basic',
                '是否删除该部门？',
                '删除部门',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!deleted_department){
                        $timeout(function(){
                            departmentService.deleteDepartmentPromise(department_id)
                            .then(function(response){
                                $('#modal-basic').on('hidden.bs.modal', function () {
                                    $('body').addClass('modal-open');
                                });
                                $rootScope.openModal('modal-confirm','删除成功','操作提示','','','delete-confirm');
                                $('#modal-confirm-button').click(function() {
                                    $('#modal-confirm-button').unbind();
                                    if($('#modal-confirm-button').hasClass('delete-confirm')){
                                        $state.go('menu.content.department.list');
                                    }
                                });
                            },function(error){
                                $rootScope.openModal('modal-confirm','请求出错，错误代码：' + error.status,'操作提示');
                            });
                        });
                    }
                }
                deleted_department = true;
            });

        };

        // position
        $scope.department_position_filters = {
            limit: 20,
            offset: 0
        };
        $scope.searchDepartmentPosition = function(){
            $scope.department_position_filters.department__id = department_id;
            var params = commonService.constructURLParams($scope.department_position_filters);
            departmentService.positionListPromise(params)
            .then(function(response){
                $scope.department_position_count = response.count;
                $scope.department_position_list = response.results;
            });
        };

        $scope.addPosition = function(){
            var post_data = {
                department: department_id,
                position: $scope.new_position.position,
                status: 'A'
            };
            departmentService.createPositionPromise(post_data)
            .then(function(response){
                console.log(response)
                if(response){
                    $rootScope.openModal('modal-confirm','创建成功','操作提示');
                    $scope.searchDepartmentPosition();
                }
            },function(error){
                commonService.responseModal(error.status,error.data);
            });
        };

        $scope.savePosition = function(position){
            var post_data = {
                department: position.department,
                position: position.position,
                status: position.status
            };
            departmentService.updatePositionPromise(position.id,post_data)
            .then(function(response){
                if(response){
                    $rootScope.openModal('modal-confirm','更新成功','操作提示');
                    $scope.searchDepartmentPosition();
                }
            },function(error){
                commonService.responseModal(error.status,error.data);
            });
        }

        $scope.selectAllPosition = function(){
            if($scope.department_position_list.length){
                angular.forEach($scope.department_position_list,function(position){
                    position.selected = $scope.selected_all_position;
                });
            }
        };
        var deleted_position = false;
        $scope.deletePosition = function(){
            deleted_position = false;
            $rootScope.openModal('modal-basic',
                '是否在当前部门中删除选中职位？',
                '删除职位',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!deleted_position){
                        $timeout(function(){
                            if($scope.department_position_list.length){
                                angular.forEach($scope.department_position_list,function(position){
                                    if(position.selected){
                                        departmentService.deletePositionPromise(position.id)
                                        .then(function(response){
                                            $scope.searchDepartmentPosition();
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
                deleted_position = true;
            });

        };

        $scope.department_position_current_page = 1;
        $scope.department_position_filters.offset = 0;
        $scope.departmentPositionPageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.department_position_filters.offset = (page - 1) * 20;
            }
            else{
                $scope.department_position_filters.offset = 0;
            }
            $scope.searchDepartmentPosition();
        };




        // staff
        $scope.staff_filters = {
            limit: 5,
            offset: 0
        };
        $scope.searchStaff = function(){
            var params = commonService.constructURLParams($scope.staff_filters);
            staffService.listPromise(params)
            .then(function(response){
                $scope.staff_list = response.results;
                $scope.staff_count = response.count;
                if(response.results){
                    angular.forEach($scope.staff_list,function(staff){
                        staff.department = department_id;
                        if($scope.staff_roles && $scope.staff_roles.length){
                            staff.position = $scope.staff_roles[0].id;
                        }
                        staff.status = 'A';
                    });
                }
            });
        };
        $scope.selectStaff = function(index){
            var staff = $scope.staff_list[index];
            if(staff.selected){
                var filter = {
                    department__id: department_id,
                    staff__id: staff.id,
                    position: staff.position,
                    status: staff.status
                };
                var params = commonService.constructURLParams(filter);
                departmentService.departmentStaffRelationPromise(params)
                .then(function(response){
                    if(response.count){
                        $scope.staff_list[index].selected = false;
                        $rootScope.openModal('modal-confirm','该关系已存在，请重新选择','操作提示');
                    }
                });
            }
        };
        $scope.selectAllStaff = function(){
            if($scope.staff_list.length){
                angular.forEach($scope.staff_list,function(staff){
                    staff.selected = $scope.selected_all_staff;
                });
            }
        };
        $scope.createStaffRelation = function(){
            if($scope.staff_list.length){
                angular.forEach($scope.staff_list,function(staff){
                    if(staff.selected){
                        var post_data = {
                            department: department_id,
                            staff: staff.id,
                            position: staff.position,
                            status: staff.status
                        };
                        departmentService.createDepartmentStaffRelationPromise(post_data)
                        .then(function(response){
                            if(response){
                                $scope.searchStaffRelation();
                                staff.selected = false;
                            }
                        },function(error){
                            commonService.responseModal(error.status,error.data);
                        });
                    }
                });
            }
        };

        $scope.selectAllStaffRelation = function(){
            if($scope.staff_relation_list.length){
                angular.forEach($scope.staff_relation_list,function(relation){
                    relation.selected = $scope.selected_all_staff_relation;
                });
            }
        };
        var deleted_staff = false;
        $scope.deleteStaffRelation = function(){
            deleted_staff = false;
            $rootScope.openModal('modal-basic',
                '是否在当前部门中删除选中员工？',
                '删除员工',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!deleted_staff){
                        $timeout(function(){
                            if($scope.staff_relation_list.length){
                                // var failed_list = [];
                                angular.forEach($scope.staff_relation_list,function(relation){
                                    if(relation.selected){
                                        departmentService.deleteDepartmentStaffRelationPromise(relation.id)
                                        .then(function(response){
                                            $scope.searchStaffRelation();
                                            staff.selected = false;
                                        },function(error){
                                            // failed_list.push(staff);
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
                deleted_staff = true;
            });

        };


        $scope.staff_current_page = 1;

        $scope.staffPageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.staff_filters.offset = 5*(page-1);
            }
            else{
                $scope.staff_filters.offset = 0;
            }
            $scope.searchStaff();
        };

        // staff relation

        $scope.searchStaffRelation = function(){
            $scope.staff_relation_filters.department__id = department_id;
            var params = commonService.constructURLParams($scope.staff_relation_filters);
            departmentService.departmentStaffRelationPromise(params)
            .then(function(response){
                $scope.staff_relation_list = response.results;
                $scope.staff_relation_count = response.count;
            });
        };

        $scope.updateStaffRelation = function(relation){
            var post_data = {
                status: relation.status,
                position: relation.position,
                department: relation.department,
                staff: relation.staff
            };
            departmentService.updateDepartmentStaffRelationPromise(relation.id,post_data)
            .then(function(response){
                if(response){
                    $rootScope.openModal('modal-confirm','更新成功','操作提示');
                }
            },function(error){
                commonService.responseModal(error.status,error.data);
            });
        };

        $scope.staff_relation_current_page = 1;

        $scope.staffRelationPageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.staff_relation_filters.offset = 20*(page-1);
            }
            else{
                $scope.staff_relation_filters.offset = 0;
            }
            $scope.searchStaffRelation();
        };


        $scope.changeTab = function(tab){
            $scope.tab = tab;
            console.log($scope.tab)
            if(tab == 'staff'){
                departmentService.positionListPromise('?limit=100&department__id=' + department_id)
                .then(function(response){
                    $scope.staff_roles = response.results;
                    $scope.searchStaff();
                    $scope.searchStaffRelation();
                });
            }
            else if(tab == 'position'){
                $scope.searchDepartmentPosition();
            }
        };
        $scope.changeTab('basic');

    }
])
