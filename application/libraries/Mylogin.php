<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Mylogin {
	var $CI;
	var $user_table = 'users';
	
	/**
	 * Encrypt password
	 * 
	 * @access local
	 * @param string
	 * @return string
	 */
	protected function encryptPassword($password) {
		//A simple hashing for now	
		$encryptedPassword = sha1($password);
		
		return $encryptedPassword;
	}
	
	/**
	 * Login and set session data
	 * 
	 * @access public
	 * @param username string
	 * @param password string
	 * @return bool
	 */
	public function login($username = '', $password = '') {
		$this->CI =& get_instance();
		
		//Check for empty parameters
		if ($username == '' OR $password == '') {
			return FALSE;
		}
		
		//Check if user is already logged in
		if ($this->CI->session->userdata('username') == $username) {
			return TRUE;
		}
		
		$encryptedPassword = $this->encryptPassword($password);
		//Select from database
		$query = $this
					->CI
					->db
					->select('id, first_name, last_name, username, email')
					->where('username', $username)
					->where('password', $encryptedPassword)
					->limit('1')
					->get($this->user_table);
					
		if( $query->num_rows > 0 ) {
			$row = $query->row();
			
			//Destroy the old session
			$this->CI->session->sess_destroy();
			
			//Create a new session
			$this->CI->session->sess_create();
			
			//Set session data
			$this->CI->session->set_userdata($row);
			
			//Set logged_in to TRUE
			$this->CI->session->set_userdata(array('logged_in' => TRUE));
			
			//The login was successful
			return TRUE;
		} else {
			//Login unsuccessful
			return FALSE;
		}
	}
	
	/**
	 * Logout user
	 * 
	 * @access public
	 * @return void
	 */
	public function logout() {
		$this->CI =& get_instance();
		
		//unset relevant session data
		$this->CI->session->unset_userdata(array('username' => '','first_name' => '', 'last_name' => '', 'id' => '', 'email' => '', 'logged_in' => FALSE));
		
		//Destroy session
		$this->CI->session->sess_destroy();
	}
	
	/**
	 * Check to see if user is logged in
	 * @access public
	 * @return bool
	 */
	public function is_logged_in() {
		$this->CI =& get_instance();
		
		return $this->CI->session->userdata('logged_in');
	}
}

