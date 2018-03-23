common.directive('autoCalculate',function() {
    return {
        restrict: 'A',
        scope: {
            name: '@',
            inputValue: '=',
            postData: '=',
            bankRate: '@'
        },
        link: function(scope,element,attrs){
            element.bind('blur',function(){
                // console.log('blur');
                if(scope.inputValue){
                    // var new_data = Math.round(scope.inputValue/100)*100;
                    var new_data = Math.round(scope.inputValue);
                    scope.$apply(function(){
                        scope.inputValue = scope.name != 'nper' ? new_data : scope.inputValue;
                        scope.postData[scope.name] = scope.inputValue;
                        if(scope.name=='vehicle_down_payment'&&scope.inputValue&&scope.postData.vehicle_price){
                            scope.postData.vehicle_loan_amt = scope.postData.vehicle_price - scope.inputValue;
                            scope.postData.vehicle_down_payment_percent = (scope.inputValue/scope.postData.vehicle_price).toFixed(4);
                        }
                        else if(scope.name=='vehicle_loan_amt'&&scope.inputValue&&scope.postData.vehicle_price){
                            scope.postData.vehicle_down_payment = scope.postData.vehicle_price - scope.inputValue;
                            scope.postData.vehicle_down_payment_percent = (scope.postData.vehicle_down_payment/scope.postData.vehicle_price).toFixed(4);
                        }
                        if(scope.postData.vehicle_loan_amt||scope.postData.other_fee||scope.postData.management_fee){
                            scope.postData.loan_amt = Number(scope.postData.vehicle_loan_amt) + Number(scope.postData.other_fee) + Number(scope.postData.management_fee);
                            if(scope.postData.loan_amt&&scope.postData.rate&&scope.bankRate){
                                scope.postData.principal_interest = parseInt(Math.round(scope.postData.loan_amt*(1+Number(scope.postData.rate))/(1+Number(scope.bankRate))/100)*100*(1+Number(scope.bankRate)));
                                scope.postData.principal_ex = Math.round(scope.postData.loan_amt*(1+Number(scope.postData.rate))/(1+Number(scope.bankRate))/100)*100;
                                console.log('loan_amt: ',scope.postData.loan_amt);
                                console.log('贷款总额 * (1+产品费率）: ' , scope.postData.loan_amt*(1+Number(scope.postData.rate)));
                                console.log('round: ',Math.round(scope.postData.loan_amt*(1+Number(scope.postData.rate))/(1+Number(scope.bankRate))/100));
                                console.log('principal_interest:',scope.postData.principal_interest)
                                scope.postData.monthly_payment = Math.round(scope.postData.principal_interest/scope.postData.nper);
                            }
                        }

                    });
                }
            })
        }
    }
})
.directive('goRight', function() {
    return {
        restrict: 'E',
        template: '<i class="fa fa-arrow-right"></i>',
        replace: true,
        scope: {
            original: '@',
            goesTo: '='
        },
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                // console.log(scope.original,scope.goesTo);
                scope.$apply(function() {
                    scope.goesTo = parseFloat(scope
                        .original);
                });
                element[0].parentElement.parentElement.querySelector(
                    '.plan-input').focus();
                element[0].parentElement.parentElement.querySelector(
                    '.plan-input').blur();
            });
        }
    }
})
.directive('rotate', ['$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            scope: {
                direction: '@',
                rotateDeg: '='
            },
            controller: function($scope, $element, $attrs) {
                $element.bind('click', function() {
                    if ($scope.direction == 'left') {
                        $scope.$apply(function() {
                            $scope.rotateDeg -= 90;
                        });
                    } else {
                        $scope.$apply(function() {
                            $scope.rotateDeg += 90;
                        });
                    }
                    var image_obj = document.querySelector(
                        '.image-item.active').querySelector(
                        'img');
                    image_obj.style.transform = 'rotate(' +
                        $scope.rotateDeg +
                        'deg)';
                    image_obj.style.webkitTransform =
                        'rotate(' + $scope.rotateDeg +
                        'deg)';
                });
            }
        }
    }
])
.directive('rotateModal', ['$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            scope: {
                direction: '@',
                rotateDeg: '=',
                zoomLevel: '='
            },
            controller: function($scope, $element, $attrs) {
                $element.bind('click', function($event) {
                    if ($scope.direction == 'left') {
                        $scope.$apply(function() {
                            $scope.rotateDeg -= 90;
                        });
                    } else {
                        $scope.$apply(function() {
                            $scope.rotateDeg += 90;
                        });
                    }
                    var image_obj = document.querySelector(
                        '.backdrop').querySelector(
                        'img');
                    image_obj.style.transform =
                        'rotate(' + $scope.rotateDeg + 'deg)' +
                        ' scale(' + $scope.zoomLevel + ')';
                    image_obj.style.webkitTransform =
                        'rotate(' + $scope.rotateDeg +'deg)' +
                        ' scale(' + $scope.zoomLevel + ')';
                    $event.stopPropagation();
                    $event.preventDefault();
                });
            }
        }
    }
])
.directive('zoom', ['$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            scope: {
                direction: '@',
                rotateDeg: '=',
                zoomLevel: '='
            },
            controller: function($scope, $element, $attrs) {
                $element.bind('click', function($event) {
                    if ($scope.direction == 'in') {
                        $scope.$apply(function() {
                            $scope.zoomLevel += 0.2;
                        });
                    } else {
                        if($scope.zoomLevel > 0.4){
                            $scope.$apply(function() {
                                $scope.zoomLevel -= 0.2;
                            });
                        }
                    }
                    var image_obj = document.querySelector(
                        '.backdrop').querySelector(
                        'img');
                    image_obj.style.transform =
                        'rotate(' + $scope.rotateDeg + 'deg)' +
                        ' scale(' + $scope.zoomLevel + ')';
                    image_obj.style.webkitTransform =
                        'rotate(' + $scope.rotateDeg +'deg)' +
                        ' scale(' + $scope.zoomLevel + ')';
                    $event.stopPropagation();
                    $event.preventDefault();
                });
            }
        }
    }
])
.directive("fileread", [function() {
    return {
        scope: {
            fileread: "="
        },
        link: function(scope, element, attributes) {
            element.bind("change", function(changeEvent) {
                scope.$apply(function() {
                    scope.fileread =
                        changeEvent.target.files[
                            0];
                });
            });
            scope.$on('$destory', function() {
                element.unbind("change");
            });
        }
    }
}])
.directive("imageModal", ['$rootScope',function($rootScope) {
    return {
        scope: {
            src: "@"
        },
        link: function(scope, element, attributes) {
            element.bind("click", function(changeEvent) {
                scope.$apply(function() {
                    $rootScope.show_image_modal = true;
                    $rootScope.image_modal_src = scope.src;
                });
            });
            scope.$on('$destory', function() {
                element.unbind("click");
            });
        }
    }
}])

.directive('yjChart',['$timeout',function($timeout){
    return {
        restrict: 'C',
        scope: {
            eoption: '=',
            forceRender: '=',
            callback: '&',
            tab: '=',
            selectedDate: '@'
        },
        link: function (scope, elem, attrs) {
            // directive is called once for each chart
            var myChart = echarts.init(elem[0]);

            // listen to option changes
            if (scope.eoption) {
                scope.$watch(scope.eoption, function() {
                    // var option = scope.$eval(scope.eoption);
                    if (angular.isObject(scope.eoption)) {
                        myChart.setOption(scope.eoption);
                    }
                }, true); // deep watch
            }
            window.addEventListener('resize', chartResize);

            scope.$watch(function () {
                return elem[0].offsetWidth;
            }, function(newVal, oldVal) {
               if(newVal){
                   chartResize();
               }
            });

            scope.$on('$destory', function() {
                window.removeEventListener('resize', chartResize);
            });
            function chartResize() {
                myChart.resize();
            };

            if(attrs.id.indexOf('calender-chart') != -1){
                // var calender_chart = elem[0];
                console.log(myChart)
                myChart.on('click', function (params) {
                    console.log('click')
                    console.log(params.data);
                    scope.$apply(function(){
                        scope.callback({date:params.data[0]});
                    });

                });
            }
        }
    }
}]);
