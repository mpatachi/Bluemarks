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
	init : function() {
		var me = this;
		me.getCategories(function() {
			console.log(BM.Storage.g().categories);
		});
	}
};
