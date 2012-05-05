<?php defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';

class Tags extends REST_Controller
{
	function __construct() {
		parent::__construct();
		$this->load->model('tag_model','',TRUE);
	}
	
	function list_post() {
		$tag = $this
						->tag_model
						->getTag($this->post('id'));
						
		if($tag) {
			$this->response(array('status' => 'ok', 'data' => $tag), 200); // 200 being the HTTP response code
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t find the directory!'), 404);
		}
	}
	
	function list_all_post() {
		$tags = $this
						->tag_model
						->getAllTags();

		if($tags) {
			$this->response(array('status' => 'ok', 'data' => $tags), 200); // 200 being the HTTP response code
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t find any tags!'), 200);
		}
	}
	
	function add_post() {
		$isTagAvailable = $this
								->tag_model
								->checkTagName($this->post('name'));
					
		if($isTagAvailable) {
			$action = $this
						->tag_model
						->createTag($this->post('name'));
			
			if(FALSE != $action) {
				$this->response(array('status' => 'ok', 'msg' => 'Tag created successfuly.', 'data' => $action), 200);
			} else {
				$this->response(array('status' => 'error', 'msg' => 'Couldn\'t create tag.'), 200);
			}									
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Tag name already exists.'), 200);
		}
	}
	
	function update_post($id, $name) {
		$checkName = $this
					->tag_model
					->checkTagName($name);
					
		if($checkName) {
			$action = $this
						->tag_model
						->updateTag($id, $name);
			
			if($action) {
				$this->response(array('status' => 'ok', 'msg' => 'Tag updated successfuly.'), 200);
			} else {
				$this->response(array('status' => 'error', 'msg' => 'Couldn\'t update tag.'), 404);
			}			
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Tag name already exists.'), 404);
		}			
	}
		
	function delete_post($id) {
		$action = $this
					->tag_model
					->deleteTag($id);
		
		if($action) {
			$this->response(array('status' => 'ok', 'msg' => 'Tag deleted successfuly.'), 200);
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t delete tag.'), 404);
		}
	}
}