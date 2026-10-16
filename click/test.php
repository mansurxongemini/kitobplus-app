<?php
    require_once('settings.php');
    require_once('request.php');

//    $service_id = 70276;

    function createInvoice($phone, $amount, $merchant_trans_id) {
        global $service_id;

        $params = [
            'service_id' => $service_id,
            'amount' => $amount,
            'phone_number' => $phone,
            'merchant_trans_id' => $merchant_trans_id
        ];

        return executeHttpRequest('invoice/create', $params);
    }

    function invoiceStatus($invoice_id) {
        global $service_id;
        return executeHttpRequest("invoice/status/$service_id/$invoice_id");
    }

    function paymentStatusByMTI($merchant_trans_id, $dt) {
        global $service_id;
        return executeHttpRequest("payment/status_by_mti/$service_id/$merchant_trans_id/$dt");
//        return executeHttpRequest("payment/status_by_mti/$service_id/$merchant_trans_id/");
    }

   	function paymentStatus($payment_id) {
        global $service_id;
        return executeHttpRequest("payment/status/$service_id/$payment_id");
    }

	function reversalPayment($payment_id) {
        global $service_id;
        return executeHttpRequest("payment/reversal/$service_id/$payment_id", FALSE, TRUE);
	}

    //var_dump(createInvoice('+998977087331', '100.00', 'kp123541234'));
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
    //var_dump(invoiceStatus(170621695));
    /*{
        "error_code":0,
        "error_note":"",
        "status":0,
        "status_note":"",
        "payment_id":null
    }*/
    //var_dump(paymentStatus("kp123541234"));



	//var_dump(paymentStatus(4243227101));

	//var_dump(reversalPayment(4243227101));

	//var_dump(invoiceStatus(170621695));

//	invoiceStatus(170691036);
	paymentStatusByMTI("kp000008", "2025-07-17");
//	paymentStatusByMTI("kp000008", "17-07-2025");
	paymentStatus(4248888674);
