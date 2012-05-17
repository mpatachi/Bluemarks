/**
 * @author Robert
 */

BM.Bookmarks.View = {
	listBookmarks : function(callback) {
		var folders = BM.Storage.g().foldersId;
		console.log(folders);
		BM.Bookmarks.Sorter.g().activateMultipleFolder(folders, function() {
			$(document).trigger('sort-bookmarks');
		});
			// t = BM.Templater.Bookmarks,
			// bHolder = t.bookmarksList(),
			// bHolderParent = bHolder.parent(),
			// html = '',
			// i = bookmarks.length;
		// bHolder.detach();
		// bHolder.empty();
		// _(bookmarks).each(function(obj, key) {
			// var bookmark = obj.bookmark.proxy;
			// var img = "<img src='../resources/img/160x120.gif' alt=''>";
			// var title = "<h5>" + bookmark.name + "</h5>";
			// html += "<li class='span2' bookmark-id='" + key + "' bookmark-folder='" + bookmark.folderId + "' bookmark-tag='" + bookmark.tags + "' bookmark-type='" + bookmark.typeId + "' >" + "<a href='" + bookmark.url + "' target='_blank' class='thumbnail'>" + img + title + "</a>" + "</li>"  
		// });
		// // for (; i > 0; i--) {
			// // var bookmark = bookmarks[i-1].bookmark.proxy;			
			// // var img = "<img src='../resources/img/160x120.gif' alt=''>";
			// // var title = "<h5>" + bookmark.name + "</h5>";
			// // html += "<li class='span2' bookmark-id='" + bookmark.intId + "' bookmark-folder='" + bookmark.folderId + "' bookmark-tag='" + bookmark.tags + "' bookmark-type='" + bookmark.typeId + "' >" + "<a href='" + bookmark.url + "' target='_blank' class='thumbnail'>" + img + title + "</a>" + "</li>"
		// // }		
		// bHolder.html(html);
		// bHolderParent.append(bHolder);
		if (callback != undefined) {
			BM.e(callback);
		}
	},
	showBookmarks : function(list, callback) {
		var t = BM.Templater.Bookmarks,
			bHolder = t.bookmarksList(),
			bHolderParent = bHolder.parent(),
			html = '',
			bookmarks = BM.Storage.g().bookmarks,
			i = list.length;
		bHolder.detach();
		bHolder.empty();	
		if (i == 0) {
			bHolder.html('<p>looks like there is no bookmarks</p>');
			bHolderParent.append(bHolder);
			return;
		}
		for (; i > 0; i--) {
			var bookmark = bookmarks[list[i-1]].bookmark.proxy;			
			var img = "<img src='../resources/img/160x120.gif' alt=''>";
			var title = "<h5>" + bookmark.name + "</h5>";
			html += "<li class='span2' bookmark-id='" + bookmark.intId + "' bookmark-folder='" + bookmark.folderId + "' bookmark-tag='" + bookmark.tags + "' bookmark-type='" + bookmark.typeId + "' >" + "<a href='" + bookmark.url + "' target='_blank' class='thumbnail'>" + img + title + "</a>" + "</li>"
		}
		bHolder.html(html);
		bHolderParent.append(bHolder);
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
