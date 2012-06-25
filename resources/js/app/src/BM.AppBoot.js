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
	},
	end : function() {
		
	}
};