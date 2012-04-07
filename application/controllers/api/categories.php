<?php defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';

class Categories extends REST_Controller
{
	function __construct() {
		parent::__construct();
		$this->load->model('category_model','',TRUE);
	}
	
	function list_get($id) {
		$category = $this
						->category_model
						->getCategory($id);
						
		if($category) {
			$this->response(array('status' => 'ok', 'data' => $category), 200); // 200 being the HTTP response code
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t find the directory!'), 404);
		}
	}
	
	function list_all_post() {
		$categories = $this
						->category_model
						->getAllCategories();

		if($categories) {
			$this->response(array('status' => 'ok', 'data' => $categories), 200); // 200 being the HTTP response code
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t find any categories!'), 200);
		}
	}
	
	function add_post($name) {
		$checkName = $this
					->category_model
					->checkCategoryName($name);
					
		if($checkName) {
			$category = $this
						->category_model
						->createCategory($name);
			
			if($category) {
				$this->response(array('status' => 'ok', 'msg' => 'Category created successfuly.'), 200);
			} else {
				$this->response(array('status' => 'error', 'msg' => 'Couldn\'t create category.'), 404);
			}									
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Category name already exists.'), 404);
		}
	}
	
	function update_post($id, $name) {
		$checkName = $this
					->category_model
					->checkCategoryName($name);
		if($checkName) {
			$action = $this
						->category_model
						->updateCategory($id, $name);
			
			if($action) {
				$this->response(array('status' => 'ok', 'msg' => 'Category updated successfuly.'), 200);
			} else {
				$this->response(array('status' => 'error', 'msg' => 'Couldn\'t update category.'), 404);
			}			
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Category name already exists.'), 404);
		}			
	}
		
	function delete_post($id) {
		$action = $this
					->category_model
					->deleteCategory($id);
		
		if($action) {
			$this->response(array('status' => 'ok', 'msg' => 'Category deleted successfuly.'), 200);
		} else {
			$this->response(array('status' => 'error', 'msg' => 'Couldn\'t delete category.'), 404);
		}
	}
}