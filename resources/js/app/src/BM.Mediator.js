/**
 * @author Robert
 */

BM.Mediator = {};

BM.Mediator.Tags = {
	provide : function() {
		var d = $(document),
			tags = BM.Tags;
			
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
		// });		
		/**
		 * hide the modal if the tag is added with success
		 */
		d.on('add-tag-success', function(event, msg) {
			tags.View.updateTypeahead();
		});
	}
};
BM.Mediator.Folders = {
	provide : function() {
		var d = $(document),
			folders = BM.Folders;
		
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
			/*
			 * some error message here
			 */
		});
		/**
		 * hides the add folder modal when the success event is triggered
		 */
		d.on('add-folder-success', function(event, msg) {
			/*
			 * what happend when success
			 */
		});
	}
};

BM.Mediator.Bookmarks = {
	provide : function() {
		var d = $(document),
			//p = BM.Promiser.g(),
			bookmarks = BM.Bookmarks,
			view = bookmarks.View,
			foldersView = BM.Folders.View,
			sorter = bookmarks.Sorter.g(),
			t = BM.Templater,
			more = false,
			navHistory = false;
			//loadingTemplate = $("<div id='bookmark-loading' class='loading'><div class='body'><span class='loader'>&nbsp;</span><span class='text'>application is starting...</span></div></div>");
		/*
		 * 
		 */
		// d.on('apply-loading-bookmarks', function(event) {
			// $('#wall').append(loadingTemplate);
		// });
		// d.on('remove-loading-bookmarks', function(event) {
			// $('#bookmark-loading').remove();
		// });
		d.on('more-bookmarks-available', function(event, ok) {
			if (ok) {
				more = true;
				$('#show-more-bookmarks').removeClass('disabled');
			} else {
				more = false;
				$('#show-more-bookmarks').addClass('disabled');				
			}
		});
		d.on('show-more-bookmarks', function(event) {
			if (more) {
				//d.trigger('apply-loading-bookmarks');
				sorter.showBookmarks();
			}
		});		
		/*
		 * event for activating a folder(s) as the current filter(s)
		 */
		d.on('sorter-activate-folder', function(event) {
			var current = foldersView.currentFolder;
			var node = $(".folder-btn[node-id='" + current + "']");
			var nodeTarge = node.attr('node-target');
			console.log('current folder is: ', foldersView.currentFolder);
			if ( nodeTarge === 'none') {
				sorter.activateFolder(current, function() {
					d.trigger('sort-bookmarks');
				});				
			} else {
				var foldersId = [current];
				var listHolder = $('.list-for-folder-' + current);
				var listItems = listHolder.find('.folder-btn');
				listItems.each(function() {
					var index = parseInt($(this).attr('node-id'), 10);
					foldersId.push(index);
				});
				
				sorter.activateMultipleFolder(foldersId, function() {
					d.trigger('sort-bookmarks');
				});				
			}
		});
		/*
		 * this event fires when we add tags to the selected tags list
		 */
		d.on('sorter-activate-tag', function(event, tag) {
			if (tag == '') {
				return;
			}
			sorter.activateTag(tag, function() {
				d.trigger('sort-bookmarks');
			});
		});
		/*
		 * this event fires when we remove a tag from the selected tags list
		 */
		d.on('sorter-diactivate-tag', function(event, tag) {
			if (tag == '') {
				return;
			}
			sorter.diactivateTag(tag, function() {
				d.trigger('sort-bookmarks');
			});
		});		
		/*
		 * this is a generic bookmark sorter event
		 */
		d.on('sort-bookmarks', function(event) {
			console.log('sorting bookmarks');
			sorter.sortBookmarks();
		});
		/*
		 * fires when we want to add a bookmark
		 */
		d.on('add-bookmark', function(event, url, folder, tags) {
			console.log(url, folder, tags);
			if (url == '') {
				return;
			}
			bookmarks.addBookmark(url, folder, tags);
		});
		
		// p.savingBookmarks.done(function(b) {
			// console.log(b);
		// });
		
		d.on('done-add-bookmark', function(event, b) {
			d.trigger('add-bookmark-to-view', [b]);
		});
		d.on('fail-add-bookmark', function(event) {
			
		});
		
		d.on('add-bookmark-to-view', function(event, b) {
			var cur;
			if (foldersView.currentFolder == null) {
				cur = 0;
			}
			if (foldersView.currentFolder == b.folderId) {
				view.addBookmarkToView(b);
			}
		});
		
		d.on('show-bookmark-nav-history', function(event) {
				view.showBookmarkNavHistory();
		});
		
		d.on('reset-bookmark-nav-history', function(event) {
			view.resetBookmarkNavHistory();
			navHistory = false;
		});
	}
};

BM.Mediator.init = function() {
		this.Tags.provide();
		this.Folders.provide();
		this.Bookmarks.provide();
};
