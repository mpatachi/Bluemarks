<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Category_model extends CI_Model {
	
	private $userId = null;
	
	function __construct() {
		parent::__construct();
		$this->userId = $this->session->userdata('id');	
	}

	/**
	 * Get Category
	 * 
	 * @access public
	 * @param category
	 * @return category
	 */
	public function getCategory($id) {
		//$userId = $this->session->userdata('id');
		$query = $this
					->db
					->select('id, name')
					->where('userId', $userId)
					->where('deleted', 0)
					->limit(1)
					->get('categories');
		
		return $query->row();		
	}
	
	/**
	 * Get Directories
	 * 
	 * @access public
	 * @param none
	 * @return categories list
	 */
	public function getAllCategories() {
		$query = $this
					->db
					->select('id, name')
					->where('userId', $this->userId)
					->where('deleted', 0)
					->get('categories');
		
		return $query->result_array();		
	}
	
	/**
	 * Create category
	 * 
	 * @access public
	 * @param category entity
	 * @return bool
	 */
	public function createCategory($name) {
		$newCategory = array('name' => $name, 'userId' => $this->userId);
		$action = $this
					->db
					->insert('categories', $newCategory);
		
		if($action) {
			$returnId = array('id' => $this->db->insert_id());
			return $returnId;
		} else {
			return FALSE;
		}	
	}
	
	/**
	 * Delete category
	 * 
	 * @access public
	 * @param category id
	 * @return bool
	 */
	public function deleteCategory($catId) {
		$newData = array('deleted', 1);
		
		$query = $this
					->db
					->where('id', $catId)
					->where('userId', $userId)
					->where('deleted', 0)
					->update('categories', $newData);
	}
	
	/**
	 * Check category name
	 * 
	 * @access public
	 * @param name
	 * @return bool
	 */	
	 public function checkCategoryName($name) {
		$query = $this
					->db
					->select('id')
					->where('userId', $this->userId)
					->where('LOWER(name)=', strtolower($name))
					->limit(1)
					->get('categories');
					
		if ($query->num_rows() > 0) {
			return FALSE;
		}
		
		return TRUE; 	
	 }
}