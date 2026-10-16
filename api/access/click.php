<?php
    require_once('settings.php');    
    require_once('request.php');
    
    function transaction_param($invoices_id) {
        return "kp" . sprintf("%06d", $invoices_id);
    }

    function createInvoice($phone, $amount, $merchant_trans_id) {
        global $service_id;

        $params = [
            'service_id' => $service_id,
            'amount' => $amount,
            //'phone_number' => $phone,
            'merchant_trans_id' => $merchant_trans_id
        ];

        return executeHttpRequest('invoice/create', $params);
    }

    function invoiceStatus($invoice_id) {
        global $service_id;
        return executeHttpRequest("invoice/status/$service_id/$invoice_id");
    }

    function paymentStatus($merchant_trans_id, $dt) {
        global $service_id;
        return executeHttpRequest("payment/status_by_mti/$service_id/$merchant_trans_id/$dt");
    }

    //var_dump(createInvoice('+__KP_TEST_PHONE_7__', '100.00', 'kp123541234'));
    /*{
        "error_code":0,
        "error_note":"",
        "invoice_id":170619873,
        "eps_id":"0064"
    }*/
    /*{
        "error_code":0,
        "error_note":"",
        "invoice_id":170620432,
        "eps_id":"0064"
    }*/
    /* kp123541234 {
        "error_code":0,
        "error_note":"",
        "invoice_id":170620823,
        "eps_id":"0064"
    }*/
    /* kp123541234 {
        "error_code":0,
        "error_note":"",
        "invoice_id":170620850,
        "eps_id":"0064"
    }*/
    //var_dump(invoiceStatus(170620823));
    /*{
        "error_code":0,
        "error_note":"",
        "status":0,
        "status_note":"",
        "payment_id":null
    }*/
    //var_dump(paymentStatus("kp123541234"));