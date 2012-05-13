/**
 * @author Robert
 */

BM.Bookmarks.View = {
	listBookmarks : function(callback) {
		var storage = BM.Storage.g();
		var t = BM.Templater.Bookmarks;
		var bHolder = t.bookmarksList();
		bHolder.empty();
		_(storage.bookmarks).each(function(obj, key) {
			var bookmark = obj.bookmark.proxy;
			// var catName = "";
			// _(bookmark.categoriesId).each(function(cat) {
				// var r = storage.getCategory(cat);
				// catName += " " + r.category.name;
			// });
			var itemTemplate = t.bookmarkTemplate(key, bookmark.name, bookmark.url, bookmark.folderId, bookmark.tags, bookmark.typeId);
			bHolder.append(itemTemplate); 
		});
		
		BM.e(callback);
	},
	showBookmarks : function(list, callback) {
		var t = BM.Templater.Bookmarks;
		var bHolder = t.bookmarksList();
		bHolder.empty();
		var bookmarks = BM.Storage.g().bookmarks;
		var len = list.length;
		if (len == 0) {
			bHolder.text('looks like there is no bookmarks');
			return;
		}
		for (var i = 0; i < len; i++) {
			var b = bookmarks[list[i]].bookmark.proxy;
			console.log(b);
			var itemTemplate = t.bookmarkTemplate(b.intId, b.name, b.url, b.folderId, b.tags, b.typeId);
			bHolder.append(itemTemplate); 			
		}
	},
	addPopovers : function() {
		var popoverContent = $('#add-bookmark-popover');
		var target = $('.bookmark-action');
		target.popover({
			placement : 'bottom',
			trigger : 'manual',
			title : function() {
				return popoverContent.children('.title').html();
			},
			content : function() {
				return popoverContent.children('.content').html();
			}
		});		
	},
	bindHandlers : function() {
		var me = this;
		var d = $(document);
//		var addPopoverIsActive = false;
		var addBookmarkBtn = $('.bookmark-action');
		d.on('show-root-folders', function() {
			console.log('showing all bookmarks');
			me.listBookmarks();
		});
		// d.on('show-add-bookmark-popover', function() {
			// addPopoverIsActive = true;
			// addBookmarkBtn.popover('show');
			// d.trigger('bind-add-bookmark-popover-events');			
		// });
		// d.on('hide-add-bookmark-popover', function() {
			// d.trigger('unbind-add-bookmark-popover-events');
			// addBookmarkBtn.popover('hide');
			// addPopoverIsActive = false;
		// });
		// d.on('bind-add-bookmark-popover-events', function() {
			// var popConfirm = $('.add-bookmark-popover-confirm');
			// popConfirm.on('click', function(event) {
				// //d.trigger('add-bookmark', [applyTagInput.val()]);
				// console.log('this will be for adding bookmarks');
				// return false;
			// });
			// var popClose = $('.add-bookmark-popover-close');
			// popClose.on('click', function(event) {
				// d.trigger('hide-add-bookmark-popover');
				// //applyTagInput.val('');
				// //applyTagInput.focus();
// 				
				// return false;		
			// });			
		// });
		// d.on('unbind-add-bookmark-popover-events', function() {
			// var popConfirm = $('.add-bookmark-popover-confirm');
			// popConfirm.off('click');
			// var popClose = $('.add-bookmark-popover-close');
			// popClose.off('click');						
		// });			
		// addBookmarkBtn.on('click', function() {
			// if (addPopoverIsActive) {
				// d.trigger('hide-add-bookmark-popover');
			// } else {
				// d.trigger('show-add-bookmark-popover');
			// }
		// });	
	},
	init : function() {
		var me = this;
		
		me.listBookmarks(function() {
//			console.log('done listing bookmarks');
		});
		//me.addPopovers();
		me.bindHandlers();
	}
};
