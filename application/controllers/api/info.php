<?php defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';

class Info extends REST_Controller
{
	function __construct() {
		parent::__construct();
		$this->load->model('user_model','',TRUE);
	}

	/**
	 * For the moment it only returns the current user's information
	 */
	function app_boot_post() {
		$userId = $this->session->userdata('id');
		$user = $this->user_model->getUser($userId);
		if($user)
        {
            $this->response(array('status' => 'ok', 'data' => $user), 200); // 200 being the HTTP response code
        }
        else
        {
           $this->response(array('status' => 'error', 'msg' => 'Couldn\'t find any information!'), 404);
        }
	}
	
	function check_password_post() {
		$pass = $this->post('password');
		$action = $this->user_model->checkPassword($pass);

		if ($action) {
			$this->response(array('status' => 'ok', 'msg' => 'Password correct.'), 200); // 200 being the HTTP response code
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t get password!'), 200); // 200 being the HTTP response code
		}
	}
	
	function change_password_post() {
		$pass = $this->post('password');
		$action = $this->user_model->changePassword($pass);
		
		if ($action) {
			$this->mylogin->logout();
			$this->response(array('status' => 'ok', 'msg' => 'Password changed.'), 200); // 200 being the HTTP response code
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t change password!'), 200); // 200 being the HTTP response code
		}
	}		
}