<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Folder_model extends CI_Model {
		
	private $userId = null;
	
	function __construct() {
		parent::__construct();
		$this->userId = $this->session->userdata('id');	
	}
	
	/**
	 * Get folder
	 * 
	 * @access public
	 * @param dirId
	 * @return folder entity
	 */
	public function getFolder($dirId) {
		$query = $this
					->db
					->select('id, name, parentId')
					->where('userId', $this->userId)
					->where('id', $dirId)
					->where('deleted', 0)
					->limit(1)
					->get('folders');
		
		return $query->row();
	}
	
	/**
	 * Get folders
	 * 
	 * @access public
	 * @param
	 * @return folders list
	 */
	public function getAllFolders() {
		$query = $this
					->db
					->select('id, name, parentId')
					->where('userId', $this->userId)
					->where('deleted', 0)
					->get('folders');
					
		return $query->result_array();
	}
	
	/**
	 * Create folder
	 * 
	 * @access public
	 * @param folder
	 * @return success
	 */
	public function createFolder($name, $parentId) {
		// $isFolderAvailable = $this->checkFolderName($name);
// 		
		// if ($isFolderAvailable) {	
			// $newFolder = array('name' => $name, 'parentId' => $parentId, 'userId' => $this->userId);
			// $action = $this
						// ->db
						// ->insert('folders', $newFolder);
// 		
			// if($action) {
				// return TRUE;
			// } else {
				// return FALSE;
			// }
		// } else {
			// return FALSE;
		// }s
		if ($parentId == 'null') {
			$newFolder = array('name' => $name, 'userId' => $this->userId);
		} else {
			$newFolder = array('name' => $name, 'parentId' => $parentId, 'userId' => $this->userId);
		}
		
		$action = $this
					->db
					->insert('folders', $newFolder);
	
		if($action) {
			$returnId = array('id' => $this->db->insert_id());
			return $returnId;
		} else {
			return FALSE;
		}
	}
	
	/**
	 * Delete folder
	 * TODO : check with recursivity if folder has child elements and move them up with one level
	 * @access public
	 * @param folder id
	 * @return success
	 */
	public function deleteFolder($dirId) {
		$newData = array('deleted', 1);
		
		$query = $this
					->db
					->where('id', $dirId)					
					->where('userId', $this->userId)
					->where('deleted', 0)
					->update('folders', $newData);
	}
	
	/**
	 * Check folder name
	 * TODO : check if the folder name exists for that parent element {if the folder has a parent}
	 * @access public
	 * @param direcotry name
	 * @return bool
	 */	
	public function checkFolderName($name) {
		$query = $this
					->db
					->select('id')
					->where('userId', $this->userId)
					->where('LOWER(name)=', strtolower($name))
					->limit(1)
					->get('folders');
		
		if ($query->num_rows() > 0) {
			return FALSE;
		}			
		
		return TRUE;
	}
}
