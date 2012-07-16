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
		var modal = this.modal;
		var save = modal.find('.modal-bookmark-save-confirm');
		save.on('click', function() {
			var title = modal.find('.modal-bookmark-title').val();
			var folder = modal.find('.modal-bookmark-folder').val();
			var tags = modal.find('.modal-bookmark-tags').val();
			var desc = modal.find('.modal-bookmark-description').val();
			var id = modal.find('.modal-edit-bookmark-id').val();
			var bookmark = BM.Storage.g().bookmarks[id].bookmark;
			bookmark.proxy.name = title;
			bookmark.proxy.tags = tags;
			bookmark.real.description = desc;
		});
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
