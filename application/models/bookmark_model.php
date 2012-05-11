<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Bookmark_model extends CI_Model {
	
	private $userId = null;
	
	function __construct() {
		parent::__construct();
		$this->userId = $this->session->userdata('id');	
	}
	
	/**
	 * Get bookmark
	 * 
	 * @access public
	 * @param integer id
	 * @return bookmark
	 */
	public function getBookmark($id) {
		//$userId = $this->session->userdata('id');
		$query = $this
					->db
					->select('id, folderId, tagsId, typeId, noteId, name, description, url, image')
					->where('userId', $this->userId)
					->where('deleted', 0)
					->limit(1)
					->get('bookmarks');
		
		return $query->row();		
	}
	/**
	 * Get bookmarks
	 * 
	 * @access public
	 * @param none
	 * @return categories list
	 */
	public function getAllBookmarks() {
		$query = $this
					->db
					->select('id, folderId, tags, typeId, noteId, name, description, url, image')
					->where('userId', $this->userId)
					->where('deleted', 0)
					->get('bookmarks');
		
		return $query->result_array();		
	}
	/**
	 * method for adding bookmark from the app UI
	 */
	public function quickAddBookmark($name, $url, $folderId, $tags) {
		$newBookmark = array('userId' => $this->userId, 'name' => $name, 
							 'url' => $url, 'folderId' => $folderId, 'tags' => $tags);
		
		$action = $this
					->db
					->insert('bookmarks', $newBookmark);
					
		if($action) {
			$this->load->model('tag_model','',TRUE);
						
			$returnId = array('id' => $this->db->insert_id());			
			
			$tags = explode(",",$this->post('tags'));
			$count = count($tags);
			
			for ($i = 0; $i < $count; $i++) {
				$tag = $this
						->tag_model
						->createTag($tags[i]);
				if ($tag) {
					$this
						->tag_model
						->tagBookmark($tag, $action);
				}
			}			

			return $returnId;
		} else {
			return FALSE;
		}					
		
	}
	/**
	 * Create bookmark
	 * 
	 * @access public
	 * @param bookmark entity
	 * @return bool
	 */
	public function createBookmark($name, $description, $url, $image, $typeId, $folderId, $tagsId, $noteId) {
		$newBookmark = array('name' => $name, 'userId' => $this->userId, 'description' => $description, 
							 'url' => $url, 'image' => $image, 'typeId' => $typeId,
							 'folderId' => $folderId, 'noteId' => $noteId);
		$action = $this
					->db
					->insert('bookmarks', $newBookmark);
		
		if($action) {
			$returnId = array('id' => $this->db->insert_id());
			return $returnId;
		} else {
			return FALSE;
		}			
	}
	
	/**
	 * Delete bookmark
	 * 
	 * @access public
	 * @param integer bookmarkId
	 * @return bool
	 */
	public function deleteBookmark($bId) {
		$newData = array('deleted', 1);
		
		$action = $this
					->db
					->where('id', $bId)
					->where('userId', $this->userId)
					->where('deleted', 0)
					->update('bookmarks', $newData);
		
		if($action) {
			return TRUE;	
		} else {
			return FALSE;
		}
	}
	
	/**
	 * Check bookmarks url for duplicate entries -- current user
	 * 
	 * @access public
	 * @param string name, integer userId
	 * @return bool
	 */	
	 public function checkBookmarkUrl($url) {
		$query = $this
					->db
					->select('id')
					->where('userId', $this->userId)
					->where('url', $url)
					->limit(1)
					->get('bookmarks');
					
		if ($query->num_rows() > 0) {
			return FALSE;
		}			
		
		return TRUE;	 	
	 }
}