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
		
		if (callback !== undefined) {
			BM.e(callback);	
		}
	},
	addCategoryToList : function(category, callback) {
		var me = this;
		var itemTample = me.ddItemTemplate(category.name, category.intId);
		BM.Templater.Categories.ddCategoryHolder().append(itemTample);
		
		if (callback !== undefined) {
			BM.e(callback);		
		}	
	},
	bindHandlers : function() {
		$('.sort-categories').on('click', function(event) {
			var item = $(this);
			var active = item.hasClass('active');
			var toolbar = $('.categories-toolbar');
			
			if (active) {
				toolbar.animate({
					'marginTop' : 0
				}, 300, 'linear');
			} else {
				toolbar.animate({
					'marginTop' : '50px'
				}, 300, 'linear');				
			}
		});
	},
	init : function() {
		var me = this;
		
		me.listCategories(function() {
			
		});
		me.bindHandlers();
	}
};
