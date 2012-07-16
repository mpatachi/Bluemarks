/**
 * @author Robert
 * AppBoot.js
 */

BM.AppBoot = {
	user : {},

	getInfo : function() {
		var me = this;		
		var info = BM.p('info/app_boot', function(response) {
			if (response.status == 'ok') {
				me.user = response.data;
				me.displayUser();
			}			
		});
	},
	// changePassword : function() {
		// var me = this;
		// var pass;
		// $('.modal-user-change-confirm').on('click', function() {
			// var newpass = $('.modal-user-newpassword').val();
			// var repass = $('.modal-user-repassword').val();
			// var curpass = $('.modal-user-curpassword').val();
			// var param = {
				// password : curpass
			// };
// 			
			// BM.p('info/check_password', function(r) {
				// if (r.status == 'ok') {
					// if (newpass != repass) {
						// $('.modal-repassword-group').find('.help-message').text('password does not match');
					// } else {
						// var param2 = {
							// password : newpass
						// };
						// BM.p('info/change_password', function(res) {
							// if (res.status == 'ok') {
								// window.location.reload();
							// }
						// }, param2);
					// }
					// $('.modal-curpassword-group').find('.help-message').text('');
				// } else {
					// $('.modal-curpassword-group').find('.help-message').text('wrong password');
					// newpass.val('');
					// repass.val('');
					// $('.modal-repassword-group').find('.help-message').text('retype password');
				// }
			// }, param);
// 			
			// return false;
		// });
	// },
	displayUser : function() {
		var holder = $('.current-user .username');
		holder.text(this.user.email);
	},
	removeLoading : function() {
		var loading = $('#main-loading'),
			app = $('#app-container'),
			d = $(document);
		d.on('remove-main-loading', function() {
			setTimeout(function() {
				loading.hide();
				app.fadeIn();
			}, 400);
		});
		d.on('change-main-loading', function(event, msg) {
			loading.find('span').html(msg);
		});
	},
	init : function() {
		var me = this;
		me.getInfo();
		me.removeLoading();
		BM.Folders.init();
		BM.Tags.init();
		BM.Bookmarks.init();
		BM.Mediator.init();	
		BM.Searcher.init();
		
		//me.changePassword();				
	},
	end : function() {
		
	}
};