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
				</div>
			</div>
		</div>
		<!-- main content -->
		<div class='main-content'>
			<div class='left-content'>
				<div class='left-sidebar'>
					<div class="directories-group btn-group">
					  <button class="btn">directories</button>
					  <button class="btn"><i class='icon-plus'></i></button>
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
			</div>
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
					
				</div>
			</div>
		</div>
	</div>
</body>
</html>