<?php defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';

class Thumbs extends REST_Controller
{
	function __construct() {
		parent::__construct();
	}

	function save_post() {
		$url = $this->post('url');
		$domain = 'http://192.168.75.128/thumber/thumbs/save';
		$urlString = 'url=' . $url;
		$ch = curl_init($domain);
		$options = array(
			CURLOPT_RETURNTRANSFER => TRUE,
			CURLOPT_POST => TRUE,
			CURLOPT_HEADER => FALSE,
			CURLOPT_POSTFIELDS => $urlString,
		);
		
		curl_setopt_array($ch, $options);
		
		$result = curl_exec($ch);
		if (!empty($result)) {
			// $hsize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
			// $result = substr($result, $hsize);
			curl_close($ch);
			$resDecoded = json_decode($result);
			
			if ($resDecoded) {
				$this->response(array('status' => $resDecoded->status, 'msg' => $resDecoded->msg), 200); // 200 being the HTTP response code
			} 
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Thumbnail service temporary not available'), 200); // 200 being the HTTP response code
		}				
	}		
}