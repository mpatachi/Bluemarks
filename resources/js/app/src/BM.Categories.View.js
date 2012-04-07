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
		
		_(storage.categories).each(function(obj) {
			var itemTample = me.ddItemTemplate(obj.name, obj.id);
			BM.Templater.Categories.ddCategoryHolder().append(itemTample);
		});
		
		BM.e(callback);
	},
	init : function() {
		var me = this;
		
		me.listCategories(function() {
			
		});
	}
};
