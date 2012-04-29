/**
 * @author Robert
 */

BM.Categories = {
	getCategories : function(callback, limit) {
		BM.p('categories/list_all', function(response) {
			if (response.status === 'ok') {
				BM.Storage.g().storeAllCategories(response.data);
				BM.e(callback);
			}
		});
	},
	addCategory : function(name, callback) {
		var params = {
			name : name
		};
		BM.p('categories/add', function(response) {
			if (response.status === 'ok') {
				var category = {
					id : response.data.id,
					name : name
				};
				var newCategory = BM.Storage.g().storeCategory(category);
				$(document).trigger('add-category-success', [response.msg]);
			} else {
				$(document).trigger('add-category-error', [response.msg]);
			}
		}, params);
	},
	init : function() {
		var me = this;
		me.getCategories(function() {
			BM.Categories.View.init();
		});
	}
};
