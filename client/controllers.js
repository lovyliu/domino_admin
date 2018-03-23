client.controller('clientListController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    '$timeout',
    'common.commonService',
    'client.clientService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        $timeout,
        commonService,
        clientService
    ) {
        console.log('client')
        $scope.page_state = {
            filters: {
                limit: 20,
            }
        };
        commonService.get_province()
        .then(function(response){
            if(response){
                $scope.province_list = response.results;
                    console.log($scope.province_list)
            }
        });
        $scope.$watch('page_state.filters.reg_addr__province',function(new_value,old_value){
            if(!new_value){
                $scope.city_list = [];
            }
            else{
                if(new_value != old_value){
                    var selected_province_id = commonService.filter_area_id($scope.province_list,new_value);
                    commonService.get_city_district(selected_province_id)
                    .then(function(response){
                        if (response) {
                            console.log(response);
                            $scope.city_list = response.results;
                        }
                    });
                }
            }
        });
        $scope.$watch('page_state.filters.reg_addr__city',function(new_value,old_value){
            if(!new_value){
                $scope.district_list = [];
            }
            else{
                if(new_value != old_value){
                    var selected_city_id = commonService.filter_area_id($scope.city_list,new_value);
                    commonService.get_city_district(selected_city_id)
                    .then(function(response){
                        if (response) {
                            console.log(response);
                            $scope.district_list = response.results;
                        }
                    });
                }
            }
        });

        $scope.searchClients = function(){
            var params = commonService.constructURLParams($scope.page_state.filters);
            console.log(params);
            clientService.listPromise(params)
            .then(function(response){
                if(response){
                    $scope.client_list = response.results;
                    $scope.page_state.count = response.count;
                }
            });
        };
        $scope.searchFirstClients = function(){
            $scope.page_state.current_page = 1;
            $scope.page_state.filters.offset = 0;
            $scope.searchClients();
        };
        $scope.searchFirstClients();

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
            $scope.searchClients();
        };

        $scope.goDetail = function(client_id){
            $state.go('menu.content.client.detail',{client_id:client_id});
        };

        var delete_client = false;
        $scope.deleteMultipleClient = function(){
            delete_client = false;
            $rootScope.openModal('modal-basic',
                '是否删除选中客户？',
                '删除员工',
                '确认删除',
                '放弃',
                'delete-confirm'
            );
            $('#modal-ok-button').click(function() {
                $('#modal-ok-button').unbind();
                $('body').addClass('modal-open');
                if($('#modal-ok-button').hasClass('delete-confirm')){
                    if(!delete_client){
                        $timeout(function(){
                            angular.forEach($scope.client_list,function(client){
                                if(client.selected){
                                    clientService.deleteClientPromise(client.id)
                                    .then(function(response){
                                        $scope.searchClients();
                                    },function(error){
                                        $rootScope.openModal('modal-confirm','删除客户【' + client.name + '】失败。错误代码：' + error.status,'操作提示');
                                    });
                                }
                            });
                        });
                    }
                }
                delete_client = true;
            });

        };

        $scope.selectAllClient = function(){
            angular.forEach($scope.client_list,function(client){
                client.selected = $scope.page_state.select_all;
            });
        };

    }
])
// .controller('newClientController', [
//     '$scope',
//     '$rootScope',
//     '$state',
//     '$stateParams',
//     '$window',
//     'common.commonService',
//     'dealer.dealerService',
//     'client.clientService',
//     function(
//         $scope,
//         $rootScope,
//         $state,
//         $stateParams,
//         $window,
//         commonService,
//         dealerService,
//         clientService
//     ) {
//         $scope.createClient = function(){
//             clientService.createClientPromise($scope.post_data)
//             .then(function(response){
//                 console.log(response);
//                 commonService.responseModal(response.status);
//                 $('#modal-confirm-button').click(function() {
//                     $('#modal-confirm-button').unbind();
//                     $state.go('menu.content.client.detail',{client_id:response.data.id});
//                 });
//             },function(error){
//                 console.log(error);
//                 commonService.responseModal(error.status,error.data);
//             });
//         };
//         // dealerService.listPromise()
//         // .then(function(response))
//     }
// ])
.controller('clientDetailController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$window',
    '$timeout',
    '$filter',
    'common.commonService',
    'applications.applicationsService',
    'client.clientService',
    function(
        $scope,
        $rootScope,
        $state,
        $stateParams,
        $window,
        $timeout,
        $filter,
        commonService,
        applicationsService,
        clientService
    ) {
        var client_id = $stateParams.client_id;
        var default_state = {
            image_item_list: {},
            application_filters:{
                limit: 20,
                offset: 0,
                client__clt_id: client_id
            },
            show_more_image: {},
            client_info: {
                // lender_basic_0: true,
                // lender_driving_lic_0: true,
                // lender_job_0: true,
                // lender_house_0: true,
                // lender_contact_0: true,
                // lender_marriage: true
            },
            contact_filters: {
                limit: 16,
                offset: 0
            },
            sms_phone_filters: {},
            sms_message_filters: {},
            contact_net_filters: {},
            ubt_pv_count_filters:{
                st: new Date().getFullYear() + '-01',
                ed: new Date().getFullYear() + '-12',
            },
            ubt_pv_count_hour_filters:{
                st: $filter('date')(new Date(),'yyyy-MM-dd'),
                ed: $filter('date')(new Date(),'yyyy-MM-dd')
            },
            ubt_pv_list_filters:{
                st: $filter('date')(new Date(),'yyyy-MM-dd 00:00:00'),
                ed: $filter('date')(new Date(new Date().getTime() + 24*60*60*1000),'yyyy-MM-dd 00:00:00')
            },
            calendar_chart: true,
            line_chart: true,
            pv_chart: true,
            calendar_num: 50
        };
        $scope.page_state = angular.copy(default_state);
        $scope.resetFilters = function(){
            $scope.page_state.ubt_pv_count_filters = angular.copy(default_state.ubt_pv_count_filters);
            $scope.page_state.ubt_pv_count_hour_filters = angular.copy(default_state.ubt_pv_count_hour_filters);
            $scope.page_state.ubt_pv_list_filters = angular.copy(default_state.ubt_pv_list_filters);
            $scope.sms_phone_list = null;
            $scope.sms_message_list = null;
            $scope.contact_list = null;
        };
        $scope.now = new Date().toString();
        moment.locale('zh-cn');

        clientService.detailPromise(client_id)
        .then(function(response){
            console.log(response);
            if(response){
                $scope.client = response;
            }
        });

        $scope.changeTab = function(tab){
            $scope.tab = tab;
            $scope.page_state.loading = false;
            $scope.page_state.sms_message_filters.mobile = null;
            $scope.page_state.sms_message_filters.imei = null;
            $scope.page_state.sms_message_filters.phone = null;
            if(tab == 'image'){
                $scope.page_state.loading = true;
                clientService.clientImgListPromise(client_id)
                .then(function(response){
                    $scope.page_state.loading = false;
                    $scope.image_list = response.result;
                    angular.forEach($scope.image_list,function(list,list_index){
                        $scope.changeImageTab(list_index,0);
                    });
                },function(error){
                    $scope.page_state.loading = false;
                });
            }
            else if(tab == 'application'){
                $scope.searchApplication();
            }
            else if(tab == 'contact' || tab == 'net'){
                $scope.getImeiList();
            }
            else if(tab == 'message'){
                $scope.getSmsImeiList();
            }
            else if(tab == 'ubt'){
                $scope.getUbtImeiList();
            }
        };
        $scope.changeTab('basic');

        //basic
        $scope.openPanel = function(length){
            for(i = 0;i < length; i ++){
                $scope.page_state['panel_' + $scope.sub_tab + '_' + i] = true;
                $scope.page_state.client_info[$scope.sub_tab+'_basic_'+i] = true;
                $scope.page_state.client_info[$scope.sub_tab+'_driving_lic_'+i] = true;
                $scope.page_state.client_info[$scope.sub_tab+'_job_'+i] = true;
                $scope.page_state.client_info[$scope.sub_tab+'_house_'+i] = true;
                $scope.page_state.client_info[$scope.sub_tab+'_contact_'+i] = true;
                $scope.page_state.client_info[$scope.sub_tab+'_marriage_'+i] = true;
            }
        };
        $scope.changeSubTab = function(sub_tab){
            $scope.sub_tab = sub_tab;
            if(sub_tab != 'lender'){
                angular.forEach($scope.client[sub_tab],function(client){
                    clientService.detailPromise(client.others_id)
                    .then(function(response){
                        client.content = response;
                    });
                });
                $scope.openPanel($scope.client[sub_tab].length);
            }
            else{
                $scope.openPanel(1);
            }
        };
        $scope.changeSubTab('lender');

        $scope.href = location.href.indexOf('collapse') != -1 ?
            location.href.split('#collapse')[0] : location.href;




        //image
        $scope.changeImageTab = function(list_index,item_index){
            $scope.page_state.image_item_list[list_index] = $scope.image_list[list_index].value[item_index].value;
        };
        $scope.showMoreImage = function(list_index,bool){
            $scope.page_state.show_more_image[list_index] = bool;
        };

        //application
        $scope.searchApplication = function(){
            $scope.page_state.loading = true;
            var params = commonService.constructURLParams($scope.page_state.application_filters);
            applicationsService.listPromise(params)
            .then(function(response){
                $scope.application_list = response.results;
                $scope.page_state.application_count = response.count;
                $scope.page_state.loading = false;
            },function(error){
                $scope.page_state.loading = false;
            });
        };
        $scope.page_state.application_current_page = 1;
        $scope.page_state.application_filters.offset = 0;
        $scope.applicationPageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.page_state.application_filters.offset = (page - 1) * 20;
            }
            else{
                $scope.page_state.application_filters.offset = 0;
            }
            $scope.searchApplication();
        };

        //info
        // var dom = document.getElementById("container");
        // var myChart = echarts.init(dom);
        // var app = {};
        // option = null;
        var dataBJ = [
            [80,80,70,60,90,60]
        ];

        var dataGZ = [
            [70,50,40,70,60,68]
        ];

        var dataSH = [
            [60,70,90,50,45,50]
        ];

        var lineStyle = {
            normal: {
                width: 0,
                // opacity: 0.5
            }
        };
        $scope.$watch('tab',function(value){
            if(value == 'info' || value == 'net'){
                $timeout(function () {
                    $scope.changeTab(value);
                });
            }
        })


        $scope.config = {
            // backgroundColor: '#161627',
            // title: {
            //     text: '综合画像（含关联人）',
            //     left: 'center',
            //     textStyle: {
            //         color: '#4A4A4A'
            //     }
            // },
            legend: {
                bottom: 5,
                data: ['客户本人画像', '客户配偶画像', '客户担保人画像'],
                itemGap: 20,
                textStyle: {
                    color: '#4A4A4A',
                    fontSize: 14
                },
                selectedMode: 'multiple',
                // orient: 'vertical'
            },
            // visualMap: {
            //     show: true,
            //     min: 0,
            //     max: 20,
            //     dimension: 6,
            //     inRange: {
            //         colorLightness: [0.5, 0.8]
            //     }
            // },
            radar: {
                indicator: [
                    {name: '个人基本信息', max: 100},
                    {name: '第三方机构', max: 100},
                    {name: '工作稳定性', max: 100},
                    {name: '居住稳定性', max: 100},
                    {name: '经济能力', max: 100},
                    {name: '车辆匹配', max: 100}
                ],
                shape: 'polygon',
                // splitNumber: 5,
                name: {
                    textStyle: {
                        color: '#4A4A4A'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#D3D3D3'
                    }
                },
                splitArea: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#D3D3D3'
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#333',
                    showMinLabel: false
                }
            },
            series: [
                {
                    name: '客户本人画像',
                    type: 'radar',
                    lineStyle: lineStyle,
                    data: dataBJ,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: 'rgb(229, 128, 90)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 1,
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 1, color: 'rgba(229, 128, 90,0.7)' // 0% 处的颜色
                                }, {
                                    offset: 0, color: 'rgba(229, 128, 90,0.1)' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    }
                },
                {
                    name: '客户配偶画像',
                    type: 'radar',
                    lineStyle: lineStyle,
                    data: dataSH,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: 'rgb(158, 227, 247)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 1,
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 1, color: 'rgba(158, 227, 247,0.7)' // 0% 处的颜色
                                }, {
                                    offset: 0, color: 'rgba(158, 227, 247,0.1)' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }

                    }
                },
                {
                    name: '客户担保人画像',
                    type: 'radar',
                    lineStyle: lineStyle,
                    data: dataGZ,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: 'rgb(196, 232, 112)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 1,
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 1, color: 'rgba(196, 232, 112,0.7)' // 0% 处的颜色
                                }, {
                                    offset: 0, color: 'rgba(196, 232, 112,0.1)' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        },

                    }
                }
            ]
        };;

        //contact
        $scope.getImeiList = function(){
            $scope.page_state.loading = true;
            clientService.clientImeiListPromise('?mobile=' + $scope.client.mobile)
            .then(function(response){
                if(response && response.length){
                    $scope.imei_list = response;
                    $scope.changeDevice(response[0],0);
                    $scope.page_state.loading = false;
                }
            },function(error){
                $scope.page_state.loading = false;
            });
        };
        $scope.getSmsImeiList = function(){
            $scope.page_state.loading = true;
            clientService.smsImeiListPromise('?mobile=' + $scope.client.mobile)
            .then(function(response){
                if(response && response.length){
                    $scope.message_imei_list = response;
                    $scope.changeDevice(response[0]);
                    $scope.page_state.loading = false;
                }
            },function(error){
                $scope.page_state.loading = false;
            });
        };
        $scope.getUbtImeiList = function(){
            $scope.page_state.loading = true;
            clientService.ubtImeiListPromise('?mobile=' + $scope.client.mobile)
            .then(function(response){
                if(response && response.length){
                    $scope.ubt_imei_list = response;
                    $scope.changeDevice(response[0],0);
                    $scope.page_state.loading = false;
                }
            },function(error){
                $scope.page_state.loading = false;
            });
        };
        $scope.changeDevice = function(device,index){
            $scope.page_state.device = device;
            $scope.page_state.imei = device.imei;
            if($scope.tab == 'contact'){
                $scope.searchContact();
            }
            else if($scope.tab == 'net'){
                // $scope.net_config = null;
                $scope.page_state.device_index = index;
                $scope.toggleCase(1);
            }
            else if($scope.tab == 'message'){
                $scope.getSmsPhoneList();
            }
            else if($scope.tab == 'ubt'){
                $scope.ubtPvCount();
                $scope.page_state.device_index = index;
            }
        };
        $scope.searchContact = function(){
            $scope.page_state.loading = true;
            var post_data = angular.copy($scope.page_state.contact_filters);
            post_data.mobile = $scope.client.mobile;
            post_data.imei = $scope.page_state.imei;
            clientService.clientContactListPromise(post_data)
            .then(function(response){
                console.log(response);
                $scope.page_state.contact_count = response.count;
                $scope.contact_list = response.contact_list;
                $scope.page_state.loading = false;
            },function(error){
                $scope.page_state.loading = false;
            });
        };
        $scope.page_state.contact_current_page = 1;
        $scope.page_state.contact_filters.offset = 0;
        $scope.contactPageChanged = function(page) {
            console.log('page num:',page);
            if(page > 1){
                $scope.page_state.contact_filters.offset = (page - 1) * 16;
            }
            else{
                $scope.page_state.contact_filters.offset = 0;
            }
            $scope.searchContact();
        };

        $scope.net_config = [];
        $scope.toggleCase = function(index){
            $scope.page_state.contact_net_filters.case = index;
            $scope.net_config[$scope.page_state.device_index] = null;
            $scope.getContactNet();
        };
        $scope.getContactNet = function(){
            // $scope.client.mobile = '18662513062';
            $scope.page_state.contact_net_filters.mobile = $scope.client.mobile;
            $scope.page_state.contact_net_filters.imei = $scope.page_state.imei;
            var params = commonService.constructURLParams($scope.page_state.contact_net_filters);
            clientService.clientContactNetPromise(params)
            .then(function(response){
                var categories = [];
                for (var i = 0; i < 9; i++) {
                    categories[i] = {
                        name: '类目' + i
                    };
                }
                response.nodes.forEach(function (node) {
                    node.name = node.name || node.dlr_nm;
                    node.itemStyle = null;
                    node.attributes = node.attributes || {};
                    if(node.type == 'client'){
                        node.value = 20;
                        node.symbolSize = 10;
                        node.category = node.attributes.modularity_class = 1;
                        if(node.main== 1){
                            node.category = node.attributes.modularity_class = 0;
                            node.name += '(客户本人)';
                        }
                    }
                    else if(node.type == 'dealer'){
                        node.value = 30;
                        node.symbolSize = 20;
                        node.category = node.attributes.modularity_class = 2;
                    }
                    else if(node.type == 'employee'){
                        node.value = 20;
                        node.symbolSize = 10;
                        node.category = node.attributes.modularity_class = 3;
                    }
                    else{
                        node.value = 20;
                        node.symbolSize = 10;
                        node.category = node.attributes.modularity_class = 4;
                    }
                    node.x = node.y = null;
                    node.draggable = true;
                });
                response.edges.forEach(function (link) {
                    link.label = {
                        normal: {
                            show: true,
                            formatter: function(value){
                                return value.data.relation;
                            }
                        }
                    };
                    link.source = response.nodes.indexOf($filter("filter")(response.nodes, {id: link.source})[0]);
                    link.target = response.nodes.indexOf($filter("filter")(response.nodes, {id: link.target})[0]);
                });
                $scope.net_config[$scope.page_state.device_index] = {
                    tooltip: {
                        formatter: function(data){
                            // console.log(data);
                            if(data.dataType == 'node'){
                                if(data.data.type == 'client'){
                                    return data.data.name + ' ' + data.data.mobile;
                                }
                                else if(data.data.type == 'dealer'){
                                    return data.data.dlr_id + ' ' + data.data.name;
                                }
                                else if(data.data.type == 'employee'){
                                    return data.data.name + '(dfim) ' + data.data.mobile;
                                }
                                else{
                                    return data.data.name;
                                }
                            }
                            else if(data.dataType == 'edge'){
                                return data.data.relation;
                            }

                        }
                    },
                    legend: [{
                        // selectedMode: 'single',
                        data: response.edges.map(function (a) {
                            //console.log(a)
                            return a.relation;
                        })
                    }],
                    animation: false,
                    edgeSymbolSize: 20,
                    series : [
                        {
                            name: '关联人网络',
                            type: 'graph',
                            layout: 'force',
                            data: response.nodes,
                            links: response.edges,
                            categories: categories,
                            roam: true,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right'
                                }
                            },
                            force: {
                                repulsion: 100
                            },
                            edgeSymbol: ['none','arrow'],
                            // focusNodeAdjacency: true
                        }
                    ]
                };
                console.log($scope.net_config)
            },function(error){
                // $scope.page_state.loading = false;
            });
        }

        $scope.getSmsPhoneList = function(){
            $scope.page_state.loading = true;
            $scope.page_state.sms_phone_filters.mobile = $scope.client.mobile;
            $scope.page_state.sms_phone_filters.imei = $scope.page_state.imei;
            var params = commonService.constructURLParams($scope.page_state.sms_phone_filters);
            clientService.smsPhoneListPromise(params)
            .then(function(response){
                if(response.length){
                    $scope.sms_phone_list = response;
                    $scope.getSmsMessageList(response[0].phone);
                }
                else{
                    $scope.sms_phone_list = null;
                    $scope.sms_message_list = null;
                }
                $scope.page_state.loading = false;
            },function(error){
                $scope.page_state.loading = false;
            });
        };
        $scope.getSmsMessageList = function(phone){
            $scope.page_state.loading = true;
            $scope.page_state.sms_message_filters.mobile = $scope.client.mobile;
            $scope.page_state.sms_message_filters.imei = $scope.page_state.imei;
            $scope.page_state.sms_message_filters.phone = phone;
            var params = commonService.constructURLParams($scope.page_state.sms_message_filters);
            clientService.smsMsgListPromise(params)
            .then(function(response){
                $scope.sms_message_list = response;
                $scope.page_state.loading = false;
            },function(error){
                $scope.page_state.loading = false;
            });
        };

        $scope.ubtPvCount = function(){
            $scope.calendar_config = null;
            $scope.page_state.loading = true;
            $scope.page_state.ubt_pv_count_filters.mobile = $scope.client.mobile;
            $scope.page_state.ubt_pv_count_filters.imei = $scope.page_state.imei;
            var filters = angular.copy($scope.page_state.ubt_pv_count_filters);
            if(filters.st || filters.ed){
                filters.st = filters.st || $filter('date')(new Date(),'yyyy-MM');
                filters.ed = filters.ed || $filter('date')(new Date(),'yyyy-MM');
            }
            var params = commonService.constructURLParams(filters);
            clientService.ubtPvCountPromise(params)
            .then(function(response){
                $scope.page_state.loading = false;
                var data = {
                    normal: [],
                    today:[]
                };
                function formatData(raw_data) {
                    for (var i = 0; i < raw_data.length; i ++) {
                        data.normal.push([
                            echarts.format.formatTime('yyyy-MM-dd', raw_data[i].date),
                            raw_data[i].count
                        ]);
                        var today = new Date();
                        if(new Date(raw_data[i].date).getFullYear() == today.getFullYear() &&
                            new Date(raw_data[i].date).getMonth() == today.getMonth() &&
                            new Date(raw_data[i].date).getDate() == today.getDate()){
                            data.today[0] = [
                                echarts.format.formatTime('yyyy-MM-dd', raw_data[i].date),
                                raw_data[i].count
                            ]
                        }
                    }
                    console.log(data)
                    return data;
                };

                $scope.data = formatData(response);

                $scope.page_state.calendar_num = 50;
                $scope.calendar_config = setOption($scope.data);

                $scope.showDateGraph();
            },function(error){
                $scope.page_state.loading = false;
            });
        };

        function setOption(data){
            return {
                backgroundColor: '#fff',
                title: {
                    top: 30,
                    text: '2017年用户UBT数据(行为密度)',
                    left: 'left',
                    textStyle: {
                        color: '#333'
                    }
                },
                tooltip : {
                    trigger: 'item'
                },
                legend: {
                    top: '30',
                    right: '100',
                    data:['正常','今天'],
                    textStyle: {
                        color: '#666'
                    }
                },
                calendar: {
                    top: 100,
                    left: 'center',
                    width: '92%',
                    range: [
                        $scope.page_state.ubt_pv_count_filters.st,
                        fullDay($scope.page_state.ubt_pv_count_filters.ed)
                    ],
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#DADBDD',
                            width: 3,
                            type: 'solid'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#fff',
                            borderWidth: 1,
                            borderColor: '#DADBDD'
                        }
                    },
                    yearLabel: {
                        show: false
                    },
                    dayLabel: {
                        firstDay: 1,
                        nameMap: 'cn',
                        color: '#666'
                    },
                    monthLabel: {
                        nameMap: 'cn'
                    }
                },
                series : [
                    {
                        name: '正常',
                        type: 'scatter',
                        coordinateSystem: 'calendar',
                        data: data.normal,
                        symbolSize: function (val) {
                            return val[1] / $scope.page_state.calendar_num;
                        },
                        itemStyle: {
                            normal: {
                                color: '#06B7A3'
                            }
                        }
                    },{
                        name: '今天',
                        type: 'scatter',
                        coordinateSystem: 'calendar',
                        data: data.today,
                        symbolSize: function (val) {
                            return val[1] / $scope.page_state.calendar_num;
                        },
                        itemStyle: {
                            normal: {
                                color: '#FF5657'
                            }
                        },
                        zlevel: 1
                    }
                ]
            };
        };

        $scope.$watch('page_state.calendar_num',function(new_value,old_value){
            if(new_value != old_value){
                $timeout(function(){
                    $scope.calendar_config = setOption($scope.data);
                    var myChart = echarts.init(document.getElementById('calender-chart'+$scope.page_state.device_index));
                    myChart.setOption($scope.calendar_config);
                });

            }
        });

        function fullDay(date){
            var year = date.split('-')[0];
            var month = date.split('-')[1];
            var day;
            if(month == '02'){
                if(year % 4 == 0 || year % 4 != 0 && year % 400 == 0){
                    day = '29';
                }
                else{
                    day = '28';
                }
            }
            else{
                switch (month) {
                    case '04': day = '30'
                        break;
                    case '06': day = '30'
                        break;
                    case '09': day = '30'
                        break;
                    case '11': day = '30'
                        break;
                    default: day = '31'
                        break;
                }
            }
            return date + '-' + day;
        };

        $scope.showDateGraph = function(date){
            $scope.getUbtPvList(date);
            $scope.getPvCountHours(date);
        };
        $scope.getPvCountHours = function(date){
            // $scope.page_state.loading = true;
            $scope.line_config = null;
            $scope.page_state.ubt_pv_count_hour_filters.mobile = $scope.client.mobile;
            $scope.page_state.ubt_pv_count_hour_filters.imei = $scope.page_state.imei;
            if(date){
                $scope.page_state.ubt_pv_count_hour_filters.st = date;
                $scope.page_state.ubt_pv_count_hour_filters.ed = date;
            }
            var filters = angular.copy($scope.page_state.ubt_pv_count_hour_filters);
            filters.st = filters.st + ' 00:00:00';
            filters.ed = filters.ed + ' 23:59:59';
            if(filters.st || filters.ed){
                filters.st = filters.st || $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                filters.ed = filters.ed || $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
            }
            var params = commonService.constructURLParams(filters);
            clientService.ubtPvCountHourPromise(params)
            .then(function(response){
                // $scope.page_state.loading = false;
                console.log(response)
                var data = [];
                function formatData(raw_data) {
                    for (var i = 0; i < raw_data.length; i ++) {
                        console.log(raw_data[i])
                        data.push([
                            echarts.format.formatTime('yyyy-MM-dd hh:mm:ss', raw_data[i].date),
                            raw_data[i].count
                        ]);
                    }
                    return data;
                };
                data = formatData(response);

                $scope.line_config = {
                    title: {
                        text: '日次'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        data: data.map(function (item) {
                            return item[0];
                        })
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        }
                    },
                    toolbox: {
                        left: 'center',
                        feature: {
                            // dataZoom: {
                            //     yAxisIndex: 'none'
                            // },
                            // restore: {},
                            // saveAsImage: {}
                        }
                    },
                    dataZoom: [{
                        startValue: '2017-07-01 00:00:00'
                    }, {
                        type: 'inside'
                    }],
                    visualMap: {
                        top: 10,
                        right: 10,
                        pieces: [{
                            gt: 0,
                            lte: 50,
                            color: '#096'
                        }, {
                            gt: 50,
                            lte: 100,
                            color: '#ffde33'
                        }, {
                            gt: 100,
                            lte: 150,
                            color: '#ff9933'
                        }, {
                            gt: 150,
                            lte: 200,
                            color: '#cc0033'
                        }, {
                            gt: 200,
                            lte: 300,
                            color: '#660099'
                        }, {
                            gt: 300,
                            color: '#7e0023'
                        }],
                        outOfRange: {
                            color: '#999'
                        }
                    },
                    series: {
                        name: '日次',
                        type: 'line',
                        data: data.map(function (item) {
                            return item[1];
                        }),
                        markLine: {
                            silent: true,
                            data: [{
                                yAxis: 50
                            }, {
                                yAxis: 100
                            }, {
                                yAxis: 150
                            }, {
                                yAxis: 200
                            }, {
                                yAxis: 300
                            }]
                        }
                    }
                };
            },function(error){
                // $scope.page_state.loading = false;
            });
        };
        $scope.getUbtPvList = function(date){
            console.log(date)
            // $scope.page_state.loading = true;
            $scope.page_state.ubt_pv_list_filters.mobile = $scope.client.mobile;
            $scope.page_state.ubt_pv_list_filters.imei = $scope.page_state.imei;
            if(date){
                $scope.page_state.ubt_pv_list_filters.st = $filter('date')(new Date(date),'yyyy-MM-dd 00:00:00');
                $scope.page_state.ubt_pv_list_filters.ed = $filter('date')(new Date(new Date(date).getTime() + 24*60*60*1000),'yyyy-MM-dd 00:00:00');
            }
            var filters = angular.copy($scope.page_state.ubt_pv_list_filters);
            if(filters.st || filters.ed){
                filters.st = filters.st || $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                filters.ed = filters.ed || $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
            }
            var params = commonService.constructURLParams(filters);
            clientService.ubtPvListPromise(params)
            .then(function(response){
                $scope.ubt_pv_list = response;
                // $scope.page_state.loading = false;
            },function(error){
                // $scope.page_state.loading = false;
            });
        };


    }
])
;
