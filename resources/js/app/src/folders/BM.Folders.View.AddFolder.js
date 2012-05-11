/**
 * @author Robert
 * Folders.View.AddFolder.js
 */

BM.Folders.View.AddFolder = {
	modal : function() {
		return $('#add-folder-modal');
	},
	bindHandlers : function() {
		var modal = $('#add-folder-modal');
		var submitBtn = modal.find('.modal-folder-add');
		var nameField = modal.find('.modal-folder-name');
		var selector = modal.find('.modal-parent-selector');
		var d = $(document);
		
		submitBtn.on('click', function() {
			d.trigger('add-folder', [nameField.val(), selector.val()]);
			
			return false;
		});
	},
	listParents : function(callback) {
		var storage = BM.Storage.g().folders;
		var selector = this.modal().find('.modal-parent-selector');

		_(storage).each(function(obj) {
			var item = "<option value='" + obj.folder.intId + "'>" + obj.folder.name + "</option>";
			selector.append(item);
		});
		
		if (callback != undefined) {
			BM.e(callback);
		}
	},
	init : function() {
		var me = this;
		
		me.listParents();
		me.bindHandlers();
	}
};
