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
	<script type="text/javascript" src="<?php echo site_url('resources/js/jquery.autocomplete-min.js'); ?>"></script>	
</head>
<body>
	<div id='main-loading' class='loading'>
		<div class='body'>
			<!-- <img src="<?php echo site_url('resources/img/loading.gif'); ?>" /> -->
			<span class='loader'>&nbsp;</span>
			<span class='text'>application is starting...</span>
		</div>
	</div>	
	<div id='app-container' class='main-app-container'>
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
											<div class="input-append searchbar">
												<input class="span4 search-input" size="16" type="text"><button class="btn search-btn" type="button"><i class='icon-search'></i></button>
											</div>
									</div>
								</div>							
							</div>
						</li>
						<li class='sort-group'>
							<div class="toolbar-item">
							  <a href="#add-bookmark-modal" id='add-bookmark' class="btn bookmark-action" data-toggle="modal"><i class='icon-star icon-white'></i></a>								
							  <a href="#" id='sort-tags' class="btn sort-tags" data-toggle="button"><i class='icon-tags icon-white'></i></a>
							  <a href="#" id='share-all' class="btn share-all"><i class='icon-share-alt icon-white'></i></a>
							  <a href="#" id='open-all' class="btn open-all"><i class='icon-eye-open icon-white'></i></a>
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
								      <li><a href="<?php echo site_url('logout'); ?>">Logout</a></li>
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
					<div class="sidebar-item folders-breadcrumb-holder">
						<i class='icon-folder-open icon-white breadcrumb-show-root'></i>
						<div class='breadcrumb-active-folders'></div>
					</div>
					<div class="separator no-select"></div>
					<div class="folders-list-holder" active-node='-1'></div>
					<div class='add-new-folder-holder sidebar-item'>
						<a href='#' class='add-folder-shortcut-btn btn-special'>new folder</a>
						<input class="span2 add-new-folder" size="16" type="text" placeholder="type name...">
					</div>	
				</div>
				<button id='show-more-bookmarks' class='btn'>show more</button>		
			</div><!-- end left content -->
			<div class='right-content'>
				<div class='tags-toolbar'>
					<ul class='toolbar'>
						<li>
							<ul id='active-tags-list' class="tags-group toolbar-item">
							</ul>						
						</li>
						<li>
							<div class="toolbar-item tags-action">
								<a href='#' class='apply-tag-btn btn-special'>filter by tag</a>
								<input class="span2 apply-tag-input" rel="popover" size="16" type="text" placeholder="type tag...">
							</div>
						</li>
					</ul>					
				</div>				
				<div id='wall' class='wall'>
					<ul class='thumbnails bookmarks-list'>				
					</ul>
				</div>
			</div> <!-- end right content -->
		</div> <!-- end main content -->
	</div> <!-- end mai app content -->
	<div class="modal fade" id="add-bookmark-modal">
  		<div class="modal-header">
	    	<a class="close" data-dismiss="modal">×</a>
	    	<h3>Add bookmark</h3>
	  	</div>
  		<div class="modal-body"> 			
  			<div class='control-group modal-url-group'>
	    		<label>bookmark url:</label>
	    		<div class='input-prepend'>
	    			<span class='add-on'><i class='icon-globe'></i></span><!--
  				 --><input type="text" class="span3 modal-bookmark-url" placeholder="Type address…">
	  				<span class='help-inline help-message'></span>
  				</div>
  			</div>
  			<div class='control-group modal-folder-group'>
	    		<label>foldder:</label>
	    		<div class='input-prepend'>
	    			<span class='add-on'><i class='icon-folder-open'></i></span><!--
	  			 --><select class='span3 modal-bookmark-folder'>
	  					<option value='null'>unsorted bookmarks</option>
	  				</select>
  					<span class='help-inline help-message'></span>
  				</div>
  			</div>
  			<div class='control-group modal-tags-group'>
	    		<label>tags:</label>
	    		<div class='input-prepend'>
	    			<span class='add-on'><i class='icon-tags'></i></span><!--
  				 --><input type="text" class="span3 modal-bookmark-tags" placeholder="Type address…">
  					<span class='help-inline help-message'>Separate tags with commas</span>
  				</div>
  			</div>  			  			
	  	</div>
	  	<div class="modal-footer">
	    	<a href="#" class="btn" data-dismiss="modal">close</a>
	    	<a href="#" class="btn btn-primary modal-bookmark-add-confirm">add</a>
	  	</div>
	</div><!-- end add bookmark modal -->
	<script type="text/javascript" src="<?php echo site_url('resources/js/app-all.js'); ?>"></script>
</body>
</html>