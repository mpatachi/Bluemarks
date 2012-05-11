/**
 * @author Robert
 */

BM.Bookmarks.View.AddBookmark = {
	modal : BM.Templater.Bookmarks.getAddModal(),
	bindHandlers : function() {
		var me = this;
		var t = BM.Templater.Bookmarks;
		var modal = me.modal;
		var d = $(document);
		
		modal.submit.on('click', function() {
			d.trigger('add-bookmark', [modal.url.val(), modal.folder.val(), modal.tags.val()]);
			
			return false;
		});
	},
	listFolders : function() {
		var storage = BM.Storage.g().folders;
		var modal = this.modal;
		_(storage).each(function(obj) {
			var item = "<option value='" + obj.folder.intId + "'>" + obj.folder.name + "</option>";
			modal.folder.append(item);
		});		
	},
	init : function() {
		var me = this;
		me.listFolders();
		me.bindHandlers();
	}
};
