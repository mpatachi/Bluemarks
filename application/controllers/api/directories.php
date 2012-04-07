<?php defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';

class Directories extends REST_Controller
{
	function __construct() {
		parent::__construct();
		$this->load->model('directory_model','',TRUE);
	}
	
	function list_post() {
		$directory = $this
						->directory_model
						->getDirectory($this->post('id'));
						
		if($directory) {
			$this->response(array('status' => 'ok', 'data' => $directory), 200); // 200 being the HTTP response code
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t find the directory!'), 200);
		}
	}
	
	function list_all_post() {
		$directories = $this
						->directory_model
						->getAllDirectories();
		
		if($directories) {
			$this->response(array('status' => 'ok', 'data' => $directories), 200); // 200 being the HTTP response code
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t find any directories!'), 200);
		}
	}
	
	function add_post($name, $parentId) {
		//should check if directory name exists in the database for that parentId	
		$action = $this
					->directory_model
					->createDirectory($name, $parentId);
					
		if($action) {
			$this->response(array('status' => 'ok', 'msg' => 'Directory created successfuly.'), 200);
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t add directory.'), 404);
		}
	}
	
	function update_post($id, $name, $parentId) {
		//should check if directory name exists in the database for that parentId
		$action = $this
					->directory_model
					->createDirectory($name, $parentId);
					
		if($action) {
			$this->response(array('status' => 'ok', 'msg' => 'Directory updated successfuly.'), 200);
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t update directory.'), 404);
		}		
	}
		
	function delete_post($id) {
		$action = $this
					->directory_model
					->deleteDirectory($id);
		
		if($action) {
			$this->response(array('status' => 'ok', 'msg' => 'Directory deleted successfuly.'), 200);
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t delete directory.'), 404);
		}		
	}
}