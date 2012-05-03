/**
 * @author Robert
 */

BM.Mediator = {};

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
			if (name == '') {
				return;
			}
			categories.addCategory(name);
		});
		/*
		 * displays error message if adding a category fails
		 */
		d.on('add-category-error', function(event, msg) {
			nameGroup.removeClass('success'); 
			nameGroup.addClass('error');
			nameGroup.children('span').text(msg);
		});		
		/**
		 * hide the modal if the category is added with success
		 */
		d.on('add-category-success', function(event, msg) {
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
		/**
		 *  what happens on enter key press on the modal
		 */
		modal.el.on('keypress', function(event) {
			if (event.keyCode !== 13) {
				return;
			}
			d.trigger('add-category', [modal.name.val()]);
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

BM.Mediator.Bookmarks = {
	provide : function() {
		var d = $(document);
		var bookmarks = BM.Bookmarks;
		var sorter = bookmarks.Sorter.g();
		var t = BM.Templater;
		
		d.on('sorter-activate-directory', function(event, directoryId) {
			sorter.activateDirectory(directoryId, function() {
				d.trigger('sort-bookmarks');
			});
		});
		
		d.on('sorter-activate-multiple-directories', function(event, directoryId) {
			var directoriesId = [directoryId];
			var listHolder = $('.list-for-directory-' + directoryId);
			var listItems = listHolder.find('.directory-btn');
			listItems.each(function() {
				var index = parseInt($(this).attr('node-id'), 10);
				directoriesId.push(index);
			});
			
			sorter.activateMultipleDirectory(directoriesId, function() {
				d.trigger('sort-bookmarks');
			});
		});
		
		d.on('sorter-diactivate-multiple-directories', function(event, directoryId) {
			var directoriesId = [directoryId];
			var listHolder = $('.list-for-directory-' + directoryId);
			var listItems = listHolder.find('.directory-btn');
			listItems.each(function() {
				var index = parseInt($(this).attr('node-id'), 10);
				directoriesId.push(index);
			});
			
			sorter.diactivateMultipleDirectory(directoriesId);
		});
		
		d.on('sort-bookmarks', function(event) {
			console.log('sorting bookmarks');
			console.log(sorter.filters);
		});
	}
};

BM.Mediator.init = function() {
		this.Categories.provide();
		this.Directories.provide();
		this.Bookmarks.provide();
};
