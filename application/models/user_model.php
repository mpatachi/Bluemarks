<?php defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model {
	
	/**
	 * Get user
	 * 
	 * @access public
	 * @param userId integer
	 * @return user entity
	 */
	public function getUser($userId) {
		$query = $this
					->db
					->select('id, first_name, last_name, username, email')
					->where('id', $userId)
					->limit(1)
					->get('users');
		
		return $query->row();
	}
}
