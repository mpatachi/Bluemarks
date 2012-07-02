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
	showBookmarkNavHistory : function() {
		var nav = $('#bookmark-nav-history');
		var list = BM.Bookmarks.Sorter.g().bookmarks.list;
		var html = [];
		var i = 0;
		_(list).each(function(obj) {
			i++;
			var item = "<a href='#' data-list='" + obj + "' data-page='" + i + "'></a>";
			html.push(item);
		});
		nav.html(html.join(''));
	},
	resetBookmarkNavHistory : function() {
		var nav = $('#bookmark-nav-history');
		nav.html('');
	},
	showBookmarks : function(list, callback) {
		var t = BM.Templater.Bookmarks,
			bHolder = t.bookmarksList(),
			bHolderParent = bHolder.parent(),
			html = [],
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
				img = "<img class='bookmark-thumb' data-original='http://192.168.75.128/thumber/resources/img/" + bookmark.image + "_thumb.jpg' src='' alt=''>",
				title = "<h5>" + bookmark.name + "</h5>",
				buttons = "<div class='action-group'><a href='#' data-id='" + bookmark.intId + "' class='action-group-btn delete' title='delete'><i class='icon-trash'></i></a><div class='btn-group-right'><a data-id='" + bookmark.intId + "' href='#' class='action-group-btn edit' title='edit'><i class='icon-pencil'></i></a><a data-id='" + bookmark.intId + "' href='#' class='action-group-btn share' title='share'><i class='icon-share-alt'></i></a><a data-id='" + bookmark.intId + "' href='#' class='action-group-btn mark' title='mark'><i class='icon-ok'></i></a></div></div>";
			html.push("<li draggable='true' class='span2' bookmark-id='" + bookmark.intId + "' bookmark-folder='" + bookmark.folderId + "' bookmark-tag='" + bookmark.tags + "' bookmark-type='" + bookmark.typeId + "' >" + buttons + "<a href='" + bookmark.url + "' target='_blank' class='thumbnail'>" + img + title + "</a></li>");
		}		
		bHolder.html(html.join(''));
		bHolderParent.append(bHolder);
		/*
		 * check if the thumbnail has loaded
		 * if not set the default image
		 */
		var wall = bHolder.find('.bookmark-thumb');
		for (i = 0, l = wall.length; i < l; i++) {
			wall[i].src = wall[i].dataset.original;
			$(wall[i]).error(function() {
				console.log(this);
				this.src = '/bluemarks/resources/img/default_thumb.jpg';
			});
		}				
	},
	addBookmarkToView : function(bookmark) { 
		var	img = "<img class='bookmark-thumb' data-original='http://192.168.75.128/thumber/resources/img/" + bookmark.image + "_thumb.jpg' src='http://192.168.75.128/thumber/resources/img/" + bookmark.image + "_thumb.jpg' alt=''>",
			title = "<h5>" + bookmark.name + "</h5>",
			buttons = "<div class='action-group'><a href='#' data-id='" + bookmark.intId + "' class='action-group-btn delete' title='delete'><i class='icon-trash'></i></a><div class='btn-group-right'><a data-id='" + bookmark.intId + "' href='#' class='action-group-btn edit' title='edit'><i class='icon-pencil'></i></a><a data-id='" + bookmark.intId + "' href='#' class='action-group-btn share' title='share'><i class='icon-share-alt'></i></a><a data-id='" + bookmark.intId + "' href='#' class='action-group-btn mark' title='mark'><i class='icon-ok'></i></a></div></div>";
			html = "<li class='span2' bookmark-id='" + bookmark.intId + "' bookmark-folder='" + bookmark.folderId + "' bookmark-tag='" + bookmark.tags + "' bookmark-type='" + bookmark.typeId + "' >" + "<a href='" + bookmark.url + "' target='_blank' class='thumbnail'>" + img + title + buttons + "</a></li>";
		var $obj = $(html);
		BM.Templater.Bookmarks.bookmarksList().prepend($obj);
	},
	bindHandlers : function() {
		var me = this,
			d = $(document),
			addBookmark = $('#add-bookmark'),
			shareAll = $('#share-all'),
			openAll = $('#open-all'),
			wall = $('#wall'),
			editModal = $('#edit-bookmark-modal'),
			storage = BM.Storage.g();
		d.on('show-root-folders', function() {
			me.listBookmarks();
		});
		
		shareAll.on('click', function(event) {
			return false;
		});
		openAll.on('click', function(event) {
			return false;
		});
		// wall.on('error', '.bookmark-thumb', function() {
			// console.log('error loading image', this.dataset.original);
		// });
		wall.on('click', '.edit', function() {
			editModal.modal('toggle');
			var bookmark = storage.bookmarks[this.dataset.id].bookmark;
			console.log(bookmark);
			editModal.find('.modal-bookmark-title').val(bookmark.proxy.name);
			editModal.find('.modal-bookmark-url').val(bookmark.proxy.url);
			editModal.find('.modal-bookmark-tags').val(bookmark.proxy.tags);
			editModal.find('.modal-bookmark-folder').val(this.dataset.id);
			editModal.find('.modal-bookmark-description').val(bookmark.real.description);
			return false;
		});
		$('#bookmark-nav-history').on('click', 'a', function() {
			var array = this.dataset.list.split(',');
			me.showBookmarks(array);
			$(this).parent()[0].dataset.page = this.dataset.page;
			return false;
		});
		$('#show-more-bookmarks').on('click', function() {
			d.trigger('show-more-bookmarks');

			return false;
		});		
	},
	init : function() {
		var me = this;
		// $('#wall').on('error', '.bookmark-thumb', function() {
			// console.log('error loading image', this.dataset.original);
		// });
		$('.bookmark-thumb').live('error', function() {
			console.log('errrorasdada');
		});	
		me.listBookmarks(function() {
//			console.log('done listing bookmarks');
		});
		me.showBookmarkNavHistory();
		//me.addPopovers();
		me.bindHandlers();
	}
};
