/**
 * @author Robert
 */

BM.Bookmarks.View = {
	listBookmarks : function(callback) {
		var folders = BM.Storage.g().foldersId;
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
			bHolder.html("<p class='no-bookmarks'>looks like there is no bookmarks</p>");
			bHolderParent.append(bHolder);
			return;
		}
		for (; i > 0; i--) {
			var bookmark = bookmarks[list[i-1]].bookmark.proxy,		
				//img = "<img src='../resources/img/" + bookmark.image + "_thumb.jpg' alt=''>",
				img = "<img src='http://192.168.75.128/thumber/resources/img/" + bookmark.image + "_thumb.jpg' alt=''>",
				title = "<h5>" + bookmark.name + "</h5>",
				mark = "",
				buttons = "<div class='action-group'><button class='btn btn-mini' title='delete'><i class='icon-trash'></i></button><div class='btn-group'><button class='btn btn-mini' title='edit'><i class='icon-pencil'></i></button><button class='btn btn-mini' title='share'><i class='icon-share-alt'></i></button><button class='btn btn-mini rigth mark' title='mark'><i class='icon-ok'></i></button></div></div>";
			html += "<li class='span2' bookmark-id='" + bookmark.intId + "' bookmark-folder='" + bookmark.folderId + "' bookmark-tag='" + bookmark.tags + "' bookmark-type='" + bookmark.typeId + "' >" + "<a href='" + bookmark.url + "' target='_blank' class='thumbnail'>" + mark + img + title + buttons + "</a></li>";
		}		
		bHolder.html(html);
		bHolderParent.append(bHolder);				
	},
	addBookmarkToView : function(bookmark) { 
		var	img = "<img src='http://192.168.75.128/thumber/resources/img/" + bookmark.image + "_thumb.jpg' alt=''>",
			title = "<h5>" + bookmark.name + "</h5>",
			mark = "",
			buttons = "<div class='action-group'><button class='btn btn-mini' title='delete'><i class='icon-trash'></i></button><div class='btn-group'><button class='btn btn-mini' title='edit'><i class='icon-pencil'></i></button><button class='btn btn-mini' title='share'><i class='icon-share-alt'></i></button><button class='btn btn-mini rigth mark' title='mark'><i class='icon-ok'></i></button></div></div>";
			html = "<li class='span2' bookmark-id='" + bookmark.intId + "' bookmark-folder='" + bookmark.folderId + "' bookmark-tag='" + bookmark.tags + "' bookmark-type='" + bookmark.typeId + "' >" + "<a href='" + bookmark.url + "' target='_blank' class='thumbnail'>" + mark + img + title + buttons + "</a></li>";
		var $obj = $(html);
		BM.Templater.Bookmarks.bookmarksList().prepend($obj);
	},
	bindHandlers : function() {
		var me = this,
			d = $(document),
			addBookmark = $('#add-bookmark'),
			shareAll = $('#share-all'),
			openAll = $('#open-all');
		d.on('show-root-folders', function() {
			me.listBookmarks();
		});
		
		shareAll.on('click', function(event) {
			return false;
		});
		openAll.on('click', function(event) {
			return false;
		});
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
