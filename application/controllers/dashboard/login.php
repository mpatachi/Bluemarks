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

		$data['main_content'] = 'dashboard/login_view';
		$this->load->view('dashboard/templates/shared', $data);
	}
	
	function signup() {		
		$data['main_content'] = 'dashboard/signup_view';
		$this->load->view('dashboard/templates/shared', $data);
	}
	
	function validate_signup() {
		$this->load->library('form_validation');
		$this->form_validation->set_rules('username', 'Username', 'trim|required|xss_clean');
		$this->form_validation->set_rules('password', 'Password', 'trim|required|min_length[5]');
		$this->form_validation->set_rules('rpassword', 'Password confirmation', 'trim|required|matches[password]');
		$this->form_validation->set_rules('email', 'Email', 'trim|required|valid_email');
		
		if ( $this->form_validation->run() !== FALSE) {
			$action = $this
						->mylogin
						->createUser(
							$this->input->post('username'),
							$this->input->post('email'), 
							$this->input->post('password')
						);
			
			if ( $action !== FALSE) {
				redirect('login');
			}
		}
		
		$data['main_content'] = 'dashboard/signup_view';
		$this->load->view('dashboard/templates/shared', $data);						
	}
	
	function logout()
	{
		$this->mylogin->logout();
		redirect('login');
	}
}
