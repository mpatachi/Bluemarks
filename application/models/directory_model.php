<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Directory_model extends CI_Model {
		
	private $userId = null;
	
	function __construct() {
		parent::__construct();
		$this->userId = $this->session->userdata('id');	
	}
	
	/**
	 * Get directory
	 * 
	 * @access public
	 * @param dirId
	 * @return directory entity
	 */
	public function getDirectory($dirId) {
		$query = $this
					->db
					->select('id, name, parentId')
					->where('userId', $this->userId)
					->where('id', $dirId)
					->where('deleted', 0)
					->limit(1)
					->get('directories');
		
		return $query->row();
	}
	
	/**
	 * Get directories
	 * 
	 * @access public
	 * @param
	 * @return directories list
	 */
	public function getAllDirectories() {
		$query = $this
					->db
					->select('id, name, parentId')
					->where('userId', $this->userId)
					->where('deleted', 0)
					->get('directories');
					
		return $query->result_array();
	}
	
	/**
	 * Create directory
	 * 
	 * @access public
	 * @param directory
	 * @return success
	 */
	public function createDirectory($name, $parentId) {
		//$isDirectoryAvailable = $this->checkDirectoryName($name);
		$newDirectory = array('name' => $name, 'parentId' => $parentId, 'userId' => $userId);
		$action = $this
					->db
					->insert('directories', $newDirectory);
		
		if($action) {
			return TRUE;
		} else {
			return FALSE;
		}
	}
	
	/**
	 * Delete directory
	 * TODO : check with recursivity if directory has child elements and move them up with one level
	 * @access public
	 * @param directory id
	 * @return success
	 */
	public function deleteDirectory($dirId) {
		$newData = array('deleted', 1);
		
		$query = $this
					->db
					->where('id', $dirId)					
					->where('userId', $userId)
					->where('deleted', 0)
					->update('directories', $newData);
	}
	
	/**
	 * Check directory name
	 * TODO : check if the directory name exists for that parent element {if the directory has a parent}
	 * @access public
	 * @param direcotry name
	 * @return bool
	 */	
	public function checkDirectoryName($name) {
		$query = $this
					->db
					->select('id')
					->where('userId', $userId)
					->where('LOWER(name)=', strtolower($name))
					->limit(1)
					->get('directories');
					
		return $query->row() == 0;
	}
}
