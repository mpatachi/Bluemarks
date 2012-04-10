/**
 * @author Robert
 */

BM.Bookmarks.View = {
	listBookmarks : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		var t = BM.Templater.Bookmarks;
		_(storage.bookmarks).each(function(obj, key) {
			var catName = "";
			_(obj.bookmark.categoriesId).each(function(cat) {
				var r = storage.getCategory(cat);
				catName += " " + r.category.name;
			});
			var itemTemplate = t.bookmarkTemplate(key, obj.bookmark.url, catName);
//			console.log(itemTemplate);
//			console.log(t.bookmarksList());
			t.bookmarksList().append(itemTemplate); 
		});
		
		BM.e(callback);
	},
	init : function() {
		var me = this;
		
		me.listBookmarks(function() {
//			console.log('done listing bookmarks');
		});
	}
};
