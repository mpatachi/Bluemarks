/**
 * @author Robert
 */

BM.Bookmarks.View = {
	listBookmarks : function(callback) {
		var storage = BM.Storage.g();
		var t = BM.Templater.Bookmarks;
		_(storage.bookmarks).each(function(obj, key) {
			var bookmark = obj.bookmark.proxy;
			// var catName = "";
			// _(bookmark.categoriesId).each(function(cat) {
				// var r = storage.getCategory(cat);
				// catName += " " + r.category.name;
			// });
			var itemTemplate = t.bookmarkTemplate(key, bookmark.url, bookmark.folderId, bookmark.tagsId, bookmark.typeId);
			t.bookmarksList().append(itemTemplate); 
		});
		
		BM.e(callback);
	},
	showBookmarks : function(filter, callback) {
		var t = BM.Templater.Bookmarks;
		t.bookmarksList().empty();
		var storage = BM.Storage.g();
		
		_(storage.bookmarks).each(function(obj, key) {
			var bookmark = obj.bookmark;
			
		});
		
	},
	init : function() {
		var me = this;
		
		me.listBookmarks(function() {
//			console.log('done listing bookmarks');
		});
	}
};
