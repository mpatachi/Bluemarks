/**
 * @author Robert
 * Directories.View.AddDirectory.js
 */

BM.Directories.View.AddDirectory = {
	modal : function() {
		return $('#add-directory-modal');
	},
	bindHandlers : function() {
		var modal = $('#add-directory-modal');
		var submitBtn = modal.find('.modal-directory-add');
		var nameField = modal.find('.modal-directory-name');
		var selector = modal.find('.modal-parent-selector');
		var d = $(document);
		
		submitBtn.on('click', function() {
			d.trigger('add-directory', [nameField.val(), selector.val()]);
		});
	},
	listParents : function(callback) {
		var storage = BM.Storage.g().directories;
		var selector = this.modal().find('.modal-parent-selector');

		_(storage).each(function(obj) {
			var item = "<option value='" + obj.directory.intId + "'>" + obj.directory.name + "</option>";
			selector.append(item);
		});
		
		BM.e(callback);
	},
	init : function() {
		var me = this;
		
		me.listParents();
		me.bindHandlers();
	}
};
