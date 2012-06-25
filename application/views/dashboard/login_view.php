<div class='container'>
	<h1>Login</h1>
	<?php echo form_open('dashboard/login');?>
	<p>
		<?php
			echo form_label("Username:", 'username');
			echo form_input('username', set_value('username'), 'id="username"');
		?>
	</p>
	<p>
		<?php
			echo form_label("Password:", 'password');
			echo form_password('password', '', 'id="password"');
		?>
	</p>
	<p>
		<?php
			echo form_submit('submit', 'Login');
		?>
	</p>
	<?php echo form_close(); ?>
</div>