<?php defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';

class Folders extends REST_Controller
{
	function __construct() {
		parent::__construct();
		$this->load->model('folder_model','',TRUE);
	}
	
	function list_post() {
		$folder = $this
						->folder_model
						->getFolder($this->post('id'));
						
		if($folder) {
			$this->response(array('status' => 'ok', 'data' => $folder), 200); // 200 being the HTTP response code
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t find the folder!'), 200);
		}
	}
	
	function list_all_post() {
		$folders = $this
						->folder_model
						->getAllFolders();
		
		if($folders) {
			$this->response(array('status' => 'ok', 'data' => $folders), 200); // 200 being the HTTP response code
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t find any folders!'), 200);
		}
	}
	
	function add_post() {
		$isFolderAvailanle = $this
									->folder_model
									->checkFolderName($this->post('name'));
		if ($isFolderAvailanle) {
			$action = $this
					->folder_model
					->createFolder($this->post('name'), $this->post('parentId'));
					
			if (FALSE != $action) {
				$this->response(array('status' => 'ok', 'msg' => 'Folder created successfuly.', 'data' => $action), 200);
			} else {
				$this->response(array('status' => 'error', 'msg' => 'Couldn\'t add folder.'), 200);
			}
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t add folder folder name already exists.'), 200);
		}
	}
	
	function update_post($id, $name, $parentId) {
		//should check if folder name exists in the database for that parentId
		$action = $this
					->folder_model
					->createFolder($name, $parentId);
					
		if($action) {
			$this->response(array('status' => 'ok', 'msg' => 'Folder updated successfuly.'), 200);
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t update folder.'), 404);
		}		
	}
		
	function delete_post($id) {
		$action = $this
					->folder_model
					->deleteFolder($id);
		
		if($action) {
			$this->response(array('status' => 'ok', 'msg' => 'Folder deleted successfuly.'), 200);
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t delete folder.'), 404);
		}		
	}
}