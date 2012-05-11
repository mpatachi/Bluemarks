<?php defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';

class Bookmarks extends REST_Controller
{
	function __construct() {
		parent::__construct();
		$this->load->model('bookmark_model','',TRUE);
	}
	
	function list_get($id) {
		$bookmark = $this
						->bookmark_model
						->getBookmark($id);
						
		if($bookmark) {
			$this->response(array('status' => 'ok', 'data' => $bookmark), 200); // 200 being the HTTP response code
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t find the bookmark!'), 200);
		}
	}
	
	function list_all_post() {
		$bookmarks = $this
						->bookmark_model
						->getAllBookmarks();
		
		if($bookmarks) {
			$this->response(array('status' => 'ok', 'data' => $bookmarks), 200); // 200 being the HTTP response code
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t find any bookmarks!'), 200);
		}
	}
	
	function add_post() {
		$checkUrl = $this
					->bookmark_model
					->checkBookmarkUrl($this->post('url'));
					
		if ($checkUrl) {
			$this->load->helper('get_title');
			$name = getTitle($this->post('url'));

			$bookmark = $this
						->bookmark_model
						->quickAddBookmark($name, 
										   $this->post('url'), 
										   $this->post('folderId'), 
										   $this->post('tags'));
			
			if (FALSE != $bookmark) {
				$this->response(array('status' => 'ok', 'msg' => 'Bookmark created successfuly.', 'data' => $bookmark), 200);
			} else {
				$this->response(array('status' => 'error', 'msg' => 'Couldn\'t create bookmark.'), 200);
			}									
		} else {
			$this->response(array('status' => 'error', 'msg' => 'This bookmark url already exists.'), 200);
		}
	}
	
	function update_post($id, $name, $description, $url, $image, $typeId, $directoryId, $noteId) {
		$checkUrl = $this
								->bookmark_model
								->checkBookmarkUrl($url);
		if($checkUrl) {
			$action = $this
						->bookmark_model
						->updateBookmark($id, $name, $description, $url, $image, $typeId, $directoryId, $noteId);
			
			if($action) {
				$this->response(array('status' => 'ok', 'msg' => 'Bookmark updated successfuly.'), 200);
			} else {
				$this->response(array('status' => 'error', 'msg' => 'Couldn\'t update bookmark.'), 404);
			}			
		} else {
			$this->response(array('status' => 'error', 'msg' => 'This bookmark url already exists.'), 404);
		}			
	}
		
	function delete_post($id) {
		$action = $this
					->bookmark_model
					->deleteBookmark($id);
		
		if($action) {
			$this->response(array('status' => 'ok', 'msg' => 'Bookmark deleted successfuly.'), 200);
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t delete bookmark.'), 404);
		}
	}
}