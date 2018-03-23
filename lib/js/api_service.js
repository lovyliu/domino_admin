api.service('api',['api.apiBaseService',function(apiBaseService){
    var api_base = apiBaseService.api_base();
    var zebra_base = apiBaseService.zebra_base();
    this.dashboard = {
        dash_kpi: function(){
            return api_base + 'api/m/rest/dash_kpi/'
        },
        ranking: function(){
            return api_base + 'api/m/rest/kpi/ranking/'
        }
    };
    this.applications = {
        list: function(){
            return api_base + 'api/m/rest/application/'
        },
        detail: function(app_id){
            return api_base + 'api/m/rest/application/' + app_id + '/';
        },
        own_application: function(app_id){
            return api_base + 'api/m/rest/application/' + app_id + '/claim/';
        },
        post_loan_own_application: function(app_id){
            return api_base + 'api/m/rest/application/' + app_id + '/post_loan/claim/';
        },
        cancel: function(app_id){
            return api_base + 'api/m/rest/application/' + app_id + '/cancel/';
        },
        drag_back: function(app_id){
            return api_base + 'api/m/rest/application/' + app_id + '/drag_back/';
        },
        plan: function(app_id){
            return api_base + 'api/m/rest/application/' + app_id + '/approval/financial_plan/'
        },
        uw_credit: function(credit_id){
            return api_base + 'api/m/rest/uw/credit/' + credit_id + '/'
        },
        update_uw_credit: function(app_id,credit_id){
            return api_base + 'api/m/rest/application/' + app_id + '/approval/credit/' + credit_id + '/'
        },
        img_plan: function(plan_id){
            return api_base + 'api/m/rest/uw/img_plan/' + plan_id + '/'
        },
        update_img_plan: function(app_id,category){
            return api_base + 'api/m/rest/application/' + app_id + '/approval/img_plan/' + category + '/'
        },
        update_img_plan_checker: function(app_id,checker_id){
            return api_base + 'api/m/rest/application/' + app_id + '/approval/img_plan_checker/' + checker_id + '/'
        },
        download_img_plan: function(app_id,category){
            return api_base + 'api/m/rest/application/' + app_id + '/download/img_plan/' + category + '/';
        },
        send_email: function(app_id){
            return api_base + 'api/m/rest/application/' + app_id + '/email/';
        },
        rigid_comments: function(){
            return api_base + 'api/m/rest/rigid_comments/';
        },
        choice_config: function(){
            return api_base + 'api/m/choice_config/';
        },
        query_credit: function(app_id){
            return api_base + 'api/m/rest/application/' + app_id + '/apply/credit/';
        },
        loan: function(app_id){
            return api_base + 'api/m/rest/application/' + app_id + '/apply/loan/';
        },
        log: function(app_id){
            return api_base + 'api/m/rest/application/' + app_id + '/logs/';
        },
        post_loan: function(app_id){
            return api_base + 'api/m/rest/application/' + app_id + '/post_loan/';
        },
        create_express: function(app_id,category,where_from,where_to){
            return api_base + 'api/m/rest/application/' + app_id +
            '/post_loan/express/' + category +
            '/' + where_from + '/' + where_to + '/';
        },
        update_express: function(app_id,category,where_from,where_to,express_number){
            return api_base + 'api/m/rest/application/' + app_id +
            '/post_loan/express/project_list/' + category +
            '/' + where_from + '/' + where_to + '/' + express_number + '/';
        },
        uploadExpressImg: function(express_number,label){
            return api_base + 'api/m/rest/express/' + express_number + '/image_list/' + label + '/';
        },
        get_express: function(express_number){
            return api_base + 'api/m/rest/express/' + express_number + '/update/';
        },
        reset_project: function(app_id,category,where_from,where_to){
            return api_base + 'api/m/rest/application/' + app_id +
            '/project_list/' + category +
            '/' + where_from + '/' + where_to + '/';
        },
        post_loan_input_values: function(app_id){
            return api_base + 'api/m/rest/post_loan_input_values/' + app_id + '/';
        },
        note: function(app_id){
            return api_base + 'api/m/rest/mess_note/?application_id=' + app_id;
        },
        create_note: function(id){
            return api_base + 'api/m/rest/mess_note/';
        },
        update_note: function(id){
            return api_base + 'api/m/rest/mess_note/' + id + '/';
        },
        modify_app_detail: function(app_id){
            return api_base + 'api/application/modify_app_detail/?app_id=' + app_id;
            // return 'http://192.168.0.214:8000/api/application/modify_app_detail/?app_id=' + app_id;
        },
        send_back: function(app_id){
            return api_base + 'api/m/rest/application/' + app_id + '/send_back/';
        },
        batch_update: function(){
            return api_base + 'api/m/rest/application/batch/update/'
        }

    };
    this.account = {
        login: function(){
            return api_base + 'api/auth/login/';
        },
        checkUser: function(){
            return api_base + 'api/auth/check_user/';
        },
        visibility: function(){
            return api_base + 'api/m/visibility/'
        }
    };
    this.oss = {
        sts: function(){
            return apiBaseService.oss_sts() + 'token/oss';
        },
        yusion_upload: function(){
            return api_base + 'api/material/upload_yc_client_material/';
        }
    };
    this.dealer = {
        list: function(){
            return api_base + 'api/m/rest/dealer/';
        },
        detail: function(dlr_id){
            return api_base + 'api/m/rest/dealer/' + dlr_id + '/';
        },
        brand_list: function(){
            return api_base + 'api/m/rest/vehicle/brand/?limit=1000&level=0';
        },
        trix_list: function(brand_id){
            return api_base + 'api/m/rest/vehicle/brand/?limit=1000&superior__id=' + brand_id;
        },
        model_list: function(trix_id){
            return api_base + 'api/m/rest/vehicle/model/?limit=1000&trix__id=' + trix_id;
        },
        filter_trix_list: function(id_list){
            return api_base + 'api/m/rest/vehicle/brand/?limit=1000&id_in=' + id_list;
        },
        staff_list: function(){
            return api_base + 'api/m/rest/staff/';
        },
        dealer_employee_relation: function(){
            return api_base + 'api/m/rest/dealer_employee_manage_ship/';
        },
        dealer_employee_relation_detail: function(ship_id){
            return api_base + 'api/m/rest/dealer_employee_manage_ship/' + ship_id + '/';
        },
        dealer_proto_rate_relation: function(){
            return api_base + 'api/m/rest/dealer_proto_rate_ship/';
        },
        dealer_proto_rate_relation_detail: function(ship_id){
            return api_base + 'api/m/rest/dealer_proto_rate_ship/' + ship_id + '/';
        },
        dealer_plate: function(bank_id){
            return api_base + 'api/m/dealer/' + bank_id + '/plate/';
        },
        download_employee_file: function(dealer_id){
            return api_base + 'api/m/down_xlsx/?dtype=employee&dealer__id=' + dealer_id;
        }
    };
    this.employee = {
        list: function(){
            return api_base + 'api/m/rest/employee/';
        },
        detail: function(employee_id){
            return api_base + 'api/m/rest/employee/' + employee_id + '/';
        },
    };
    this.proto_rate = {
        list: function(){
            return api_base + 'api/m/rest/proto_rate/';
        },
        detail: function(proto_rate_id){
            return api_base + 'api/m/rest/proto_rate/' + proto_rate_id + '/';
        },
        auto_calculate_rate: function(interest_rate){
            return api_base + 'api/m/auto_calculate_rate/?interest_rate=' + interest_rate;
        }
    };
    this.bank = {
        list: function(){
            return api_base + 'api/m/rest/bank/';
        },
        detail: function(proto_rate_id){
            return api_base + 'api/m/rest/bank/' + proto_rate_id + '/';
        },
        bank_plate: function(bank_id){
            return api_base + 'api/m/bank/' + bank_id + '/plate/';
        }
    };
    this.area = {
        province: function(){
            return api_base + 'api/m/rest/area/?limit=1000&level=1';
        },
        city_district: function(parent_id){
            return api_base + 'api/m/rest/area/?limit=1000&parent__id=' + parent_id;
        },
        filter_area: function(id_in){
            return api_base + 'api/m/rest/area/?limit=1000&id_in=' + id_in;
        }
    };
    this.upload = {
        dealer_employee: function(){
            return api_base + 'api/m/upload/dealer_employee/';
        },
        employee: function(){
            return api_base + 'api/m/upload/employee/';
        },
        proto_rate: function(){
            return api_base + 'api/m/upload/proto_rate/';
        },
    };
    this.vehicle = {
        brand_list: function(){
            return api_base + 'api/m/rest/vehicle/brand/';
        },
        model_list: function(){
            return api_base + 'api/m/rest/vehicle/model/'
        },
        model_detail: function(vehicle_id){
            return api_base + 'api/m/rest/vehicle/model/' + vehicle_id + '/';
        },
    };
    this.calculator = {
        calculator: function(){
            return api_base + 'api/m/finance_loan/calculator/';
        },
    };
    this.staff = {
        list: function(){
            return api_base + 'api/m/rest/staff/';
        },
        detail: function(staff_id){
            return api_base + 'api/m/rest/staff/' + staff_id + '/';
        },
    };
    this.department = {
        list: function(){
            return api_base + 'api/m/rest/department/';
        },
        detail: function(dpt_id){
            return api_base + 'api/m/rest/department/' + dpt_id + '/';
        },
        department_staff_relation: function(){
            return api_base + 'api/m/rest/department_staff_ship/';
        },
        department_staff_relation_detail: function(ship_id){
            return api_base + 'api/m/rest/department_staff_ship/' + ship_id + '/';
        },
        position_list: function(){
            return api_base + 'api/m/rest/position/';
        },
        position_detail: function(position_id){
            return api_base + 'api/m/rest/position/' + position_id + '/';
        },
        // department_position_relation: function(){
        //     return api_base + 'api/m/rest/department_position_ship/';
        // },
        // department_position_relation_detail: function(ship_id){
        //     return api_base + 'api/m/rest/department_position_ship/' + ship_id + '/';
        // },
    };
    this.client = {
        list: function(){
            return api_base + 'api/m/rest/client/';
        },
        detail: function(client_id){
            return api_base + 'api/m/rest/client/' + client_id + '/';
        },
        img_list: function(client_id){
            return api_base + 'api/m/rest/client/' + client_id + '/img/list/';
        },
        contact_list: function(){
            return 'http://ubt.yusiontech.com:8090/imei_contact_list';
        },
        contact_net: function(){
            return zebra_base + 'neo_case';
        },
        sms_imei_list: function(){
            return zebra_base + 'ubt_imei_list';
        },
        sms_phone_list: function(){
            return zebra_base + 'sms_phone_list';
        },
        sms_msg_list: function(){
            return zebra_base + 'sms_msg_list';
        },
        ubt_imei_list: function(){
            return zebra_base + 'ubt_imei_list';
        },
        ubt_pv_count: function(){
            return zebra_base + 'ubt_pv_count';
        },
        ubt_pv_list: function(){
            return zebra_base + 'ubt_pv_list';
        },
        ubt_pv_count_hour: function(){
            return zebra_base + 'ubt_pv_count_hour';
        },
    };
    this.report = {
        detail_list: function(){
            return zebra_base + 'bi_post_loan';
            // return 'http://192.168.0.203:8090/bi_post_loan';
        },
        export_file: function(staff_id){
            return zebra_base + 'bi_post_loan_down';
            // return 'http://192.168.0.203:8090/bi_post_loan_down';
        }
    };
}])
