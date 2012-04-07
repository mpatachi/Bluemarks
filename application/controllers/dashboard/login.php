<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->library('security');
		$this->load->library('session');		
		$this->load->library('mylogin');
	}

	function index()
	{
		if ($this->mylogin->is_logged_in()) {
			redirect('dashboard/mypage');
		}
		$this->load->library('form_validation');
		$this->form_validation->set_rules('username', 'Username', 'required');
		$this->form_validation->set_rules('password', 'Password', 'required|min_length[5]');
		
		if ( $this->form_validation->run() !== FALSE) {
			$res = $this
						->mylogin
						->login(
							$this->input->post('username'), 
							$this->input->post('password')
						);
			
			if ( $res !== FALSE) {
				redirect('dashboard/mypage');
			}
		}

		$this->load->view('dashboard/login_view');
	}
	
	function logout()
	{
		$this->mylogin->logout();
		$this->load->view('dashboard/login_view');
	}
}
