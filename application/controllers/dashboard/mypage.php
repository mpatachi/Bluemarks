<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * 
 */
class Mypage extends CI_Controller {
	
	function __construct() {
		parent::__construct();
		$this->load->library('security');				
		$this->load->library('mylogin');		
	}
	
	public function index() {
		if (!$this->mylogin->is_logged_in()) {
			redirect('dashboard/login');
		} else {
			$this->load->view('dashboard/mypage_view');
		}		
	}
}
