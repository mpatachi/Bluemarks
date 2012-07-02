/**
 * @author Robert
 */

BM.Bookmarks.View.EditBookmark = {
	modal : $('#edit-bookmark-modal'),
	bindHandlers : function() {
		// var me = this;
		// var t = BM.Templater.Bookmarks;
		// var modal = me.modal;
		// var d = $(document);
// 		
		// modal.submit.on('click', function() {
			// d.trigger('add-bookmark', [modal.url.val(), modal.folder.val(), modal.tags.val()]);
// 			
			// return false;
		// });
	},
	listFolders : function() {
		var folders = BM.Storage.g().folders;
		var modal = this.modal;
		var foldersSel = modal.find('.modal-bookmark-folder');
		var html = [foldersSel.html()];	
		_(folders).each(function(obj) {
			var item = "<option value='" + obj.folder.intId + "'>" + obj.folder.name + "</option>";
			html.push(item);
		});
		
		foldersSel.html(html.join(''));
	},
	init : function() {
		var me = this;
		me.listFolders();
		me.bindHandlers();
	}
};
