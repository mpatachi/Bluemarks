<div class='centered-box'>
	<h1>Login</h1>
	<?php echo form_open('dashboard/login');?>
	<p>
		<?php
			echo form_label("Username:", 'username');
			echo form_input('username', set_value('username'), 'id="username" placeholder="type your username"');
		?>
		<?php echo form_error('username'); ?>
	</p>
	<p>
		<?php
			echo form_label("Password:", 'password');
			echo form_password('password', '', 'id="password" placeholder="your password please"');
		?>
		<?php echo form_error('password'); ?>
	</p>
	<p>
		<?php
			echo form_submit('submit', 'Log in', 'class="btn btn-success btn-large"');
		?>
		<span>or</span>
		<a href='<?php echo site_url('/signup'); ?>' class="btn btn-large">Sign up</a>
	</p>
	<?php echo form_close(); ?>
</div>