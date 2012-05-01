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
	addBookmark : function(name, url, directoryId, categoriesId, typeId, callback) {
		var params = {
			name : name,
			url : url,
			directoryId : directoryId,
			categoriesId : categoriesId,
			typeId : typeId
		};
		
		BM.p('bookmarks/add', function(response) {
			if (response.status === 'ok') {
				
			} else {
				
			}
		}, params);
	},
	init : function() {
		var me = this;
		me.getBookmarks(function() {
			BM.Bookmarks.View.init();
		});
	}
};
