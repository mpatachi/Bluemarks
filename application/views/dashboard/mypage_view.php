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
							<form class='form-inline toolbar-item'>
								<div class="control-group">
								    <div class="controls">
											<div class="input-append">
											<input class="span2" size="16" type="text"><button class="btn" type="button"><i class='icon-search'></i></button>
										</div>
									</div>
								</div>							
							</form>
						</li>
						<!-- type buttons -->
						<li>
							<div class="btn-group toolbar-item">
							  <button class="btn">videos</button>
							  <button class="btn">images</button>
							  <button class="btn">apps</button>
							  <button class="btn">readings</button>
							  <button class="btn">web</button>
							</div>
						</li>
						<!-- end type buttons -->
						<li class='account-info'>
							<div class="account-group toolbar-item">
								<p class="toolbar-text current-user">robert@yahoo.com</p>
								<button type='submit' class='btn'><i class='icon-cog'></i></button>
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
					<div class="directories-group btn-group">
					  	<button class="btn">directories</button>
					  	<button class="btn dropdown-toggle" data-toggle='dropdown'><i class='icon-cog'></i></button>
						<ul class="directory-action-group dropdown-menu">
							<li><a href='#add-directory-modal' class='directory-action' role='add-directory' data-toggle="modal"><i class='icon-plus'></i> add directory</a></li>
							<li><a href='#' class='directory-action' role='edit-directory'><i class='icon-pencil'></i> edit directory</a></li>
						</ul>	
					</div>
					<div class="separator no-select"></div>
					<div class="directories-breadcum-holder">
						<!-- directories breadcum -->
						<i class='icon-chevron-left directories-breadcum-navigation' node-target=''></i>
					</div>
					<div class="directories-list-holder">
						<!-- directories list -->
					</div>
				</div>
			</div><!-- end left content -->
			<div class='right-content'>
				<div class='top-subtoolbar'>
					<ul class='toolbar'>
						<li>
							<div class="btn-group toolbar-item">
							  <button class="btn">categories</button>
							  <button class="btn dropdown-toggle" data-toggle='dropdown'><i class='icon-plus'></i></button>
							  <ul class='dropdown-menu categories-dropdown'>
							  </ul>
							</div>
						</li>
						<!-- end type buttons -->
						<li>
							<ul class="categories-group toolbar-item">
								<li><a href='#startups'>startups</a></li>
								<li><a href='#innovation'>innovation</a></li>
								<li><a href='#communication'>communication</a></li>
								<li><a href='#tech'>tech</a></li>
							</ul>						
						</li>
					</ul>					
				</div>
				<div class='wall'>
					<ul class='thumbnails bookmarks-list'>
<!-- 						<li class='span2'>
							<a href='#' class="thumbnail">
								<img src="../resources/img/160x120.gif" alt="">
								<h5>www.samplepage.com</h5>
							</a>
						</li> -->					
					</ul>
				</div>
			</div> <!-- end right content -->
		</div> <!-- end main content -->
	</div> <!-- end mai app content -->
	<div class="modal fade" id="add-directory-modal">
  		<div class="modal-header">
	    	<a class="close" data-dismiss="modal">×</a>
	    	<h3>Add directory</h3>
	  	</div>
  		<div class="modal-body">
	    	<label>directory name</label>
  			<input type="text" class="span3" placeholder="Type something…">
  			<label>directory parent</label>
  			<select class='span3'>
  				<option>asdadas</option>
  			</select>
  			<span class="help-inline">not requiered</span>
	  	</div>
	  	<div class="modal-footer">
	    	<a href="#" class="btn" data-dismiss="modal">close</a>
	    	<a href="#" class="btn btn-primary">add</a>
	  	</div>
	</div>	
</body>
</html>