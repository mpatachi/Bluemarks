<!DOCTYPE html>

<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>My page</title>
	<link rel="stylesheet" type="text/css" href="<?php echo site_url('resources/css/bootstrap.css'); ?>">
	<link rel="stylesheet" type="text/css" href="<?php echo site_url('resources/css/bootstrap-responsive.css'); ?>">
	<link rel="stylesheet" type="text/css" href="<?php echo site_url('resources/css/app.css'); ?>">	
	<script type="text/javascript" src="<?php echo site_url('resources/js/jquery-1.7.1.min.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo site_url('resources/js/bootstrap.min.js'); ?>"></script>	
	<script type="text/javascript" src="<?php echo site_url('resources/js/underscore.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo site_url('resources/js/app-all.js'); ?>"></script>	
</head>
<body>
	<div class='main-app-container'>
		<div class="top-toolbar-fixed">
			<div class='toolbar-inner'>
				<div class='container'>
					<!-- top toolbar -->
					<ul class='toolbar top-toolbar'>
						<!-- logo -->
						<li class="branding">
							<div class='logo'></div>
						</li>
						<!-- end logo -->
						<li>
							<div class='form-inline toolbar-item'>
								<div class="control-group">
								    <div class="controls">
											<div class="input-prepend input-append main-action-bar">
												<button class="btn main-bookmark-action" type="button" data-toggle="button"><i class='icon-bookmark'></i></button><input class="span4 main-action-bar-input" size="16" type="text"><button class="btn main-action-executor" type="button"><i class='icon-search'></i></button>
											</div>
									</div>
								</div>							
							</div>
						</li>
						<li class='sort-group'>
							<div class="toolbar-item">
							  <button class="btn sort-tags" data-toggle="button"><i class='icon-tags'></i></button>
							  <button class="btn share-all" data-toggle="button"><i class='icon-share-alt'></i></button>
							  <button class="btn open-all" data-toggle="button"><i class='icon-eye-open'></i></button>
							</div>							
						</li>						
						<!-- end type buttons -->
						<li class='account-info right dropdown"'>
							<div class="btn-group account-group toolbar-item">
								<a class="toolbar-text current-user" data-toggle="dropdown" href="#acccount-info"><span class="username">robert@yahoo.com</span><b class="caret"></b></a>
								<ul class="dropdown-menu">
								      <li><a href="#">Action</a></li>
								      <li><a href="#">Another action</a></li>
								      <li><a href="#">Something else here</a></li>
								      <li class="divider"></li>
								      <li><a href="#">Separated link</a></li>
								</ul>							
							</div>						
						</li>
					</ul>
					<!-- end top toolbar -->			
				</div>
			</div>
		</div>
		<!-- main content -->
		<div class='main-content'>
			<div class='left-content'>
				<div class='left-sidebar'>
					<div class="folders-holder-header">Folders:</div>
					<div class="separator no-select"></div>
					<div class="sidebar-item folders-breadcum-holder">
						<!-- folders breadcum -->
						<i class='icon-chevron-left folders-breadcum-navigation' node-target=''></i>
					</div>
					<div class="folders-list-holder" active-node='-1'>
						<!-- folders list -->
					</div>
					<div class='sidebar-item'>
						<a href='#' class='add-folder-shortcut-btn'>new folder</a>
						<input class="span2 add-new-folder" size="16" type="text" placeholder="type name...">
					</div>
					<div class="folders-group btn-group dropup">
					  	<button class="btn dropdown-toggle" data-toggle='dropdown'><i class='icon-cog'></i></button>
						<ul class="folder-action-group dropdown-menu">
							<li><a href='#add-folder-modal' class='folder-action' role='show-add-folder-modal' data-toggle="modal"><i class='icon-plus'></i> add folder</a></li>
							<li><a href='#' class='folder-action' role='edit-folder'><i class='icon-pencil'></i> edit folder</a></li>
						</ul>	
					</div>					
				</div>
			</div><!-- end left content -->
			<div class='right-content'>
				<div class='tags-toolbar'>
					<ul class='toolbar'>
						<li>
							<div class="btn-group toolbar-item">
								<button class="btn dropdown-toggle" data-toggle='dropdown'><i class='icon-tags'></i></button>
							  	<ul class='dropdown-menu tags-dropdown'>
							  	</ul>
							</div>
						</li>
						<!-- end type buttons -->
						<li>
							<ul class="tags-group toolbar-item">

							</ul>						
						</li>
						<li>
							<a href='#' class='apply-tag-btn'>filter by tag</a>
							<input class="span2 apply-tag-input" size="16" type="text" placeholder="type tag...">							
						</li>
						<li class='right'>
							<div class="btn-group toolbar-item">
								<button class="btn dropdown-toggle" data-toggle='dropdown'><i class='icon-cog'></i></button>
		  						<ul class='dropdown-menu tags-options-dropdown'>
		  							<li><a href='#add-tag-modal' class='tag-action' role='show-add-tag-modal' data-toggle="modal">add tag</a></li>
		  							<li><a href='#' class='tag-action'>edit tag</a></li>
							  	</ul>
						  	</div>
						</li>
					</ul>					
				</div>				
				<div class='wall'>
					<ul class='thumbnails bookmarks-list'>				
					</ul>
				</div>
			</div> <!-- end right content -->
		</div> <!-- end main content -->
	</div> <!-- end mai app content -->
	<div class="modal fade" id="add-folder-modal">
  		<div class="modal-header">
	    	<a class="close" data-dismiss="modal">×</a>
	    	<h3>Add folder</h3>
	  	</div>
  		<div class="modal-body">
  			<div class='control-group modal-name-group'>
	    		<label>folder name</label>
  				<input type="text" class="span3 modal-folder-name" placeholder="Type something…">
  				<span class='help-inline help-message'></span>
  			</div>
  			<div class='control-group modal-parent-group'>
  				<label>folder parent</label>
  				<select class='span3 modal-parent-selector' role='modal-parent-selector'>
  					<option value='null'>no parent...</option>
  				</select>
  				<span class='help-inline help-message'></span>
  			</div>
	  	</div>
	  	<div class="modal-footer">
	    	<a href="#" class="btn" data-dismiss="modal">close</a>
	    	<a href="#" class="btn btn-primary modal-folder-add">add</a>
	  	</div>
	</div><!-- end add folder modal -->	
	<div class="modal fade" id="add-tag-modal">
  		<div class="modal-header">
	    	<a class="close" data-dismiss="modal">×</a>
	    	<h3>Add tag</h3>
	  	</div>
  		<div class="modal-body">
  			<div class='control-group modal-name-group'>
	    		<label>tag name</label>
  				<input type="text" class="span3 modal-tag-name" placeholder="Type something…">
  				<span class='help-inline help-message'></span>
  			</div>
	  	</div>
	  	<div class="modal-footer">
	    	<a href="#" class="btn" data-dismiss="modal">close</a>
	    	<a href="#" class="btn btn-primary modal-tag-add">add</a>
	  	</div>
	</div>
</body>
</html>