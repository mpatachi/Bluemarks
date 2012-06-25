<div class='container'>
	<h1>Sign Up</h1>
	<?php echo form_open('dashboard/login/validate_signup');?>
	<p>
		<?php
			echo form_label("Username:", 'username');
			echo form_input('username', set_value('username'), 'id="username"');
		?>
	</p>
	<p>
		<?php
			echo form_label("Email:", 'email');
			echo form_input('email', set_value('email'), 'id="email"');
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
			echo form_label("Password confirmation:", 'rpassword');
			echo form_password('rpassword', '', 'id="rpassword"');
		?>
	</p>	
	<p>
		<?php
			echo form_submit('submit', 'Create');
		?>
	</p>
	<?php echo form_close(); ?>	
</div>