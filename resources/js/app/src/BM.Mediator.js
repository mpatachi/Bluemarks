/**
 * @author Robert
 */

BM.Mediator = {
	init : function() {
		BM.Mediator.Categories.provide();
		BM.Mediator.Directories.provide();
	}
};
BM.Mediator.Categories = {
	provide : function() {
		var d = $(document);
		var categories = BM.Categories;
		var t = BM.Templater;
		var modal = t.Categories.getAddModal();
		var nameGroup = modal.nameGroup;
		//var storage = BM.Storage.g();
		//var utils = BM.utils;
		
		/**
		 * bind the add category event to the document
		 */
		d.on('add-category', function(event, name) {
			categories.addCategory(name);
		});
		/**
		 * hide the modal if the category is added with success
		 */
		d.on('add-category-success', function(event) {
			modal.el.modal('hide');
		});
		/** fires when the modal is hiding
		 * 
		 */
		modal.el.on('hide', function() {
			modal.name.val('');
			nameGroup.children('span').text('');
			nameGroup.removeClass('error').removeClass('success');
		});
	}
};
BM.Mediator.Directories = {
	provide : function() {
		var d = $(document);
		var directories = BM.Directories;
		var t = BM.Templater;
		var modal = t.Directories.getAddModal();
		var nameGroup = modal.nameGroup;
		//var storage = BM.Storage.g();
		//var utils = BM.utils;
		
		/**
		 * bind the add directory event to the document
		 */
		d.on('add-directory', function(event, name, parentId) {
			if (name == '') {
				return;
			}
			directories.addDirectory(name, parentId);
		});
		/*
		 * displays error message if adding a directory fails
		 */
		d.on('add-directory-error', function(event, msg) {
			nameGroup.removeClass('success'); 
			nameGroup.addClass('error');
			nameGroup.children('span').text(msg);
		});
		/**
		 * hides the add directory modal when the success event is triggered
		 */
		d.on('add-directory-success', function(event, msg) {
			// nameGroup.removeClass('error');
			// nameGroup.addClass('success');
			// nameGroup.children('span').text(msg);
			modal.el.modal('hide');
		});
		/**
		 * resets the add directory modal on hide event
		 */
		modal.el.on('hide', function() {
			modal.name.val('');
			nameGroup.children('span').text('');
			nameGroup.removeClass('error').removeClass('success');
			modal.selector.val(modal.selector.prop('defaultSelected'));
		});
		/**
		 * adds an enter keypress event to the add directory modal 
		 */
		modal.el.on('keypress', function(event) {
			if (event.keyCode !== 13) {
				return;
			}
			d.trigger('add-directory', [modal.name.val(), modal.selector.val()]);
		});
	}
};
