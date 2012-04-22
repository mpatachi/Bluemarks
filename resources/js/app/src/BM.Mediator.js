/**
 * @author Robert
 */

BM.Mediator = {
	init : function() {
		BM.Mediator.Directories.provide();
	}
};

BM.Mediator.Directories = {
	provide : function() {
		var d = $(document);
		var directories = BM.Directories;
		var t = BM.Templater;
		var modal = t.Directories.getAddModal();
		var nameGroup = modal.nameGroup;
		var storage = BM.Storage.g();
		var utils = BM.utils;
		
		d.on('add-directory', function(event, name, parentId) {
			directories.addDirectory(name, parentId);
		});
		
		d.on('add-directory-error', function(event, msg) {
			nameGroup.removeClass('success'); 
			nameGroup.addClass('error');
			nameGroup.children('span').text(msg);
		});
		
		d.on('add-directory-success', function(event, msg) {
			nameGroup.removeClass('error');
			nameGroup.addClass('success');
			nameGroup.children('span').text(msg);
		});
		
		modal.el.on('hide', function() {
			modal.name.val('');
			nameGroup.removeClass('error').removeClass('success');
			modal.selector.val(modal.selector.prop('defaultSelected'));
		});
	}
};
