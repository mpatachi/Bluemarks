/**
 * @author Robert
 */

BM.Mediator = {};

BM.Mediator.Tags = {
	provide : function() {
		var d = $(document);
		var tags = BM.Tags;
		var t = BM.Templater;
		//var modal = t.Tags.getAddModal();
		//var nameGroup = modal.nameGroup;
		//var storage = BM.Storage.g();
		//var utils = BM.utils;
		d.on('apply-tag', function(event, name) {
			if (name == '') {
				return;
			}			
		});
		/**
		 * bind the add tag event to the document
		 */
		d.on('add-tag', function(event, name) {
			if (name == '') {
				return;
			}
			tags.addTag(name);
		});
		/*
		 * displays error message if adding a tag fails
		 */
		// d.on('add-tag-error', function(event, msg) {
			// nameGroup.removeClass('success'); 
			// nameGroup.addClass('error');
			// nameGroup.children('span').text(msg);
		// });		
		/**
		 * hide the modal if the tag is added with success
		 */
		d.on('add-tag-success', function(event, msg) {
			tags.View.updateTypeahead();
			d.trigger('hide-tag-popover');
			d.trigger('hide-apply-tag-input');
		});
		/** fires when the modal is hiding
		 * 
		 */
		// modal.el.on('hide', function() {
			// modal.name.val('');
			// nameGroup.children('span').text('');
			// nameGroup.removeClass('error').removeClass('success');
		// });
		/**
		 *  what happens on enter key press on the modal
		 */
		// modal.el.on('keypress', function(event) {
			// if (event.keyCode !== 13) {
				// return;
			// }
			// d.trigger('add-tag', [modal.name.val()]);
		// });		
	}
};
BM.Mediator.Folders = {
	provide : function() {
		var d = $(document);
		var folders = BM.Folders;
		var t = BM.Templater;
		var modal = t.Folders.getAddModal();
		var nameGroup = modal.nameGroup;
		//var storage = BM.Storage.g();
		//var utils = BM.utils;
		
		/**
		 * bind the add folder event to the document
		 */
		d.on('add-folder', function(event, name, parentId) {
			if (name == '') {
				return;
			}
			folders.addFolder(name, parentId);
		});
		/*
		 * displays error message if adding a folder fails
		 */
		d.on('add-folder-error', function(event, msg) {
			nameGroup.removeClass('success'); 
			nameGroup.addClass('error');
			nameGroup.children('span').text(msg);
		});
		/**
		 * hides the add folder modal when the success event is triggered
		 */
		d.on('add-folder-success', function(event, msg) {
			// nameGroup.removeClass('error');
			// nameGroup.addClass('success');
			// nameGroup.children('span').text(msg);
			modal.el.modal('hide');
		});
		/**
		 * resets the add folder modal on hide event
		 */
		modal.el.on('hide', function() {
			modal.name.val('');
			nameGroup.children('span').text('');
			nameGroup.removeClass('error').removeClass('success');
			modal.selector.val(modal.selector.prop('defaultSelected'));
		});
		/**
		 * adds an enter keypress event to the add folder modal 
		 */
		modal.el.on('keypress', function(event) {
			if (event.keyCode !== 13) {
				return;
			}
			d.trigger('add-folder', [modal.name.val(), modal.selector.val()]);
		});
	}
};

BM.Mediator.Bookmarks = {
	provide : function() {
		var d = $(document);
		var bookmarks = BM.Bookmarks;
		var sorter = bookmarks.Sorter.g();
		var t = BM.Templater;
		var addBmActive = false;
		
		d.on('sorter-activate-folder', function(event, folderId) {
			sorter.activateFolder(folderId, function() {
				d.trigger('sort-bookmarks');
			});
		});
		
		d.on('sorter-activate-multiple-folders', function(event, folderId) {
			var foldersId = [folderId];
			var listHolder = $('.list-for-folder-' + folderId);
			var listItems = listHolder.find('.folder-btn');
			listItems.each(function() {
				var index = parseInt($(this).attr('node-id'), 10);
				foldersId.push(index);
			});
			
			sorter.activateMultipleFolder(foldersId, function() {
				d.trigger('sort-bookmarks');
			});
		});
		
		d.on('sorter-diactivate-multiple-folders', function(event, folderId) {
			var foldersId = [folderId];
			var listHolder = $('.list-for-folder-' + folderId);
			var listItems = listHolder.find('.folder-btn');
			listItems.each(function() {
				var index = parseInt($(this).attr('node-id'), 10);
				foldersId.push(index);
			});
			
			sorter.diactivateMultipleFolder(foldersId);
		});
		
		d.on('sort-bookmarks', function(event) {
			console.log('sorting bookmarks');
			console.log(sorter.filters);
		});
		
		d.on('add-bookmark', function(event, url, folder, tags) {
			console.log(url, folder, tags);
		});
		// var bookmarkAction = $('.main-bookmark-action');
		// var bookmarkExecutor = $('.main-action-executor')
		// bookmarkAction.on('click', function() {
			// if (!addBmActive) {
				// bookmarkAction.children('i').addClass('icon-white');
				// addBmActive = true;
				// setTimeout(function() {
					// $('.main-action-bar-input').focus();
					// bookmarkExecutor.children('i').addClass('icon-plus');
				// }, 50);
			// } else {
				// addBmActive = false;
				// bookmarkAction.children('i').removeClass('icon-white');
				// bookmarkExecutor.children('i').removeClass('icon-plus');
			// }
		// });
		// $('.main-action-bar-input').blur(function() {
			// if (!addBmActive) { return; }
			// setTimeout(function() {
				// if (addBmActive) {
					// addBmActive = false;
					// bookmarkAction.button('toggle');
					// bookmarkAction.children('i').removeClass('icon-white');
					// bookmarkExecutor.children('i').removeClass('icon-plus');
				// }				
			// }, 100);
// 
		// });
	}
};

BM.Mediator.init = function() {
		this.Tags.provide();
		this.Folders.provide();
		this.Bookmarks.provide();
};
