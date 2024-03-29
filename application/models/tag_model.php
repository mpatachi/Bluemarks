<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Tag_model extends CI_Model {
	
	private $userId = null;
	
	function __construct() {
		parent::__construct();
		$this->userId = $this->session->userdata('id');	
	}

	/**
	 * Get tag
	 * 
	 * @access public
	 * @param tag
	 * @return tag
	 */
	public function getTag($id) {
		//$userId = $this->session->userdata('id');
		$query = $this
					->db
					->select('id, name')
					->where('userId', $userId)
					->where('deleted', 0)
					->limit(1)
					->get('tags');
		
		return $query->row();		
	}
	
	/**
	 * Get Directories
	 * 
	 * @access public
	 * @param none
	 * @return tags list
	 */
	public function getAllTags() {
		$query = $this
					->db
					->select('id, name')
					->where('userId', $this->userId)
					->where('deleted', 0)
					->get('tags');
		
		return $query->result_array();		
	}
	
	/**
	 * Create tag
	 * 
	 * @access public
	 * @param tag entity
	 * @return bool
	 */
	public function createTag($name) {
		$newTag = array('name' => $name, 'userId' => $this->userId);
		$action = $this
					->db
					->insert('tags', $newTag);
		
		if($action) {
			$returnId = array('id' => $this->db->insert_id());
			return $returnId;
		} else {
			return FALSE;
		}	
	}
	
	/**
	 * tag article
	 * @access public
	 * @param int tag_id
	 * @param int bookmark_id
	 * @return null
	 */
	public function tagBookmark($tag_id, $bookmark_id) {
		$newItem = array('tag_id' => $tag_id, 'bookmark_id' => $bookmark_id);
		$action = $this
					->db
					->insert('bookmarks_tagged', $newItem);
	}
	/**
	 * Delete tag
	 * 
	 * @access public
	 * @param tag id
	 * @return bool
	 */
	public function deleteTag($catId) {
		$newData = array('deleted', 1);
		
		$query = $this
					->db
					->where('id', $catId)
					->where('userId', $userId)
					->where('deleted', 0)
					->update('tags', $newData);
	}
	
	/**
	 * Check tag name
	 * 
	 * @access public
	 * @param name
	 * @return bool
	 */	
	 public function checkTagName($name) {
		$query = $this
					->db
					->select('id')
					->where('userId', $this->userId)
					->where('LOWER(name)=', strtolower($name))
					->limit(1)
					->get('tags');
					
		if ($query->num_rows() > 0) {
			$r = $query->result_array();
			return $r[0];
		}
		
		return TRUE; 	
	 }
}