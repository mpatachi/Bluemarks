<?php defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model {

	private $userId = null;
	
	function __construct() {
		parent::__construct();
		$this->userId = $this->session->userdata('id');	
	}	
	/**
	 * Get user
	 * 
	 * @access public
	 * @param userId integer
	 * @return user entity
	 */
	public function getUser($id) {
		$query = $this
					->db
					->select('id, first_name, last_name, username, email')
					->where('id', $id)
					->limit(1)
					->get('users');
		
		return $query->row();
	}
	
	public function changePassword($password) {
		$this->load->library('mylogin');
		$newPassword = $this->mylogin->changePassword($password);	
		$new = array('password' => $newPassword);
		
		$query = $this
					->db
					->where('id', $this->userId)
					->update('users', $new);
		if ($query) {
			return TRUE;
		} else {
			return FALSE;
		}
	}
	
	public function checkPassword($password) {
		$this->load->library('mylogin');
		$newPassword = $this->mylogin->changePassword($password);			
		$query = $this
					->db
					->where('id', $this->userId)
					->where('password', $newPassword)
					->limit(1)
					->get('users');
		
		if ($query->num_rows() > 0) {
			return TRUE;
		}			
		
		return FALSE;
	}
}
