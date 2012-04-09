/**
 * @author Robert
 */

BM.Categories.View = {
	ddItemTemplate : function(name, id) {
		var it = $("<li><a href='#' category-id='" + id + "'>" + name + "</a></li>");
		
		return it;
	},
	listCategories : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		_(storage.categories).each(function(obj, key) {
			var itemTample = me.ddItemTemplate(obj.category.name, key);
			BM.Templater.Categories.ddCategoryHolder().append(itemTample);
		});
		
		BM.e(callback);
	},
	bindHandlers : function() {
		
	},
	init : function() {
		var me = this;
		
		me.listCategories(function() {
			
		});
	}
};
