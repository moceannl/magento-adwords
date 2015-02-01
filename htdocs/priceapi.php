<?php
define(MYSQLHOST,'127.0.0.1');
define(MYSQLDB,'magento');
define(MYSQLUSER,'magento');
define(MYSQLPASS,'magento');

define(MAILFROM,'test@example.com');
define(MAILTO,'test@example.com');

$db = mysql_connect(MYSQLHOST, MYSQLUSER, MYSQLPASS);
mysql_select_db(MYSQLDB,$db);
	
$clean_domain = str_replace(array('www.'),'',$_SERVER['SERVER_NAME']);

switch ($clean_domain) {
	case 'YOURDOMAINNAME.COM':
		$site_id = 1; // Fill in the Magento Store ID
	break; 
}

// Get EAN from the URL
$ean = $_GET['ean'];

if (isset($_GET['stockreport'])) {
	mail_it($ean);
	echo "ok";
} else {
	$realresult = mysql_query("SELECT catalog_product_flat_{$site_id}.price, cataloginventory_stock_item.qty 
								FROM catalog_product_flat_{$site_id} 
								# LEFT JOIN cataloginventory_stock_item ON cataloginventory_stock_item.product_id=catalog_product_flat_{$site_id}.entity_id
								WHERE ean = '{$ean}' ");
	$realrecord = mysql_fetch_object($realresult);
	echo number_format($realrecord->price,2);
	echo '|';
	echo round($realrecord->qty,0);
}

 function mail_it($ean) {
	// De headers samenstellen
	$headers	 = 'From: ' . MAILFROM . "\r\n";
	$headers	.= 'Reply-To: ' . MAILFROM . "\r\n";
	$headers	.= 'Return-Path: Mail-Error <' . MAILFROM . '>' . "\r\n";
	$headers	.= 'X-Mailer: PHP/' . phpversion() . "\r\n";
	$headers	.= 'X-Priority: Normal' . "\r\n";
	$headers	.= 'MIME-Version: 1.0' . "\r\n";
	$headers	.= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	mail(MAILTO,'Ean out of stock '.$ean,'<b>Ean out of stock '.$ean.'</b>',$headers);
 }