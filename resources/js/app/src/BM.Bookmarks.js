/**
 * @author Robert
 */

BM.Bookmarks = {
	getBookmarks : function(callback, limit) {
		BM.p('bookmarks/list_all', function(response) {
			if (response.status === 'ok') {
				BM.Storage.g().storeAllBookmarks(response.data);
				BM.e(callback);
			}
		});
	},
	init : function() {
		var me = this;
		me.getBookmarks(function() {
			BM.Bookmarks.View.init();
		});
	}
};
