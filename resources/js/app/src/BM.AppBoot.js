/**
 * @author Robert
 * AppBoot.js
 */

BM.AppBoot = {
	user : {},

	getInfo : function() {
		var me = this;		
		var info = BM.p('info/app_boot', function(response) {
			me.user = response.data;
			me.displayUser();
		});
	},
	displayUser : function() {
		var holder = $('.current-user');
		holder.text(this.user.email);
	},
	init : function() {
		var me = this;
		me.getInfo();
		BM.Directories.init();
		BM.Categories.init();
		BM.Bookmarks.init();
		BM.Mediator.init();
	},
	end : function() {
		
	}
};