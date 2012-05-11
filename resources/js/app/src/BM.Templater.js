/**
 * @author Robert
 */

BM.Templater = {};

BM.Templater.Folders = {
	leftSidebar : function() {
		return $('.left-sidebar');
	},
	foldersListHolder : function() {
		return $('.folders-list-holder');
	},
	itemTemplate : function(name, id, target, parent) {
		var it = $("<li><a href='#' class='folder-btn' node-id='" + id + "' node-target='" + target + "' node-parent='" + parent + "'>" + name + "</a></li>");

		return it;
	},
	listTemplate : function(name) {
		var holder = $("<ul class='list-for-" + name + " folders-list' node='" + name + "'></ul>");
		
		return holder;
	},
	getAddModal : function() {
		var modal = $('#add-folder-modal');
		var submitBtn = modal.find('.modal-folder-add');
		var nameField = modal.find('.modal-folder-name');
		var selector = modal.find('.modal-parent-selector');
		var nameGroup = modal.find('.modal-name-group');
		var parentGroup = modal.find('.modal-parent-group');
		
		return {
			el : modal,
			submit : submitBtn,
			name : nameField,
			selector : selector,
			nameGroup : nameGroup,
			parentGroup : parentGroup
		};
	}	
};

BM.Templater.Tags = {
	// ddTagHolder : function() {
		// return $('.categories-dropdown');
	// },
	// getAddModal : function() {
		// var modal = $('#add-tag-modal');
		// var submitBtn = modal.find('.modal-tag-add');
		// var nameField = modal.find('.modal-tag-name');
		// var nameGroup = modal.find('.modal-name-group');
// 		
		// return {
			// el : modal,
			// submit : submitBtn,
			// name : nameField,
			// nameGroup : nameGroup,
		// };		
	// },
	tagTypeahead : function() {
		return $('.apply-tag-input');
	}
};

BM.Templater.Bookmarks = {
	bookmarksList : function() {
		return $('.bookmarks-list');
	},
	getAddModal : function() {
		var modal = $('#add-bookmark-modal');
		var submitBtn = modal.find('.modal-bookmark-add-confirm');
		var urlField = modal.find('.modal-bookmark-url');
		var folderField = modal.find('.modal-bookmark-folder');
		var tagsField = modal.find('.modal-bookmark-tags');
		var urlGroup = modal.find('.modal-url-group');
		var folderGroup = modal.find('.modal-folder-group');
		var tagsGroup = modal.find('.modal-tags-group');
		
		return {
			el : modal,
			submit : submitBtn,
			url : urlField,
			folder : folderField,
			tags : tagsField,
			urlGroup : urlGroup,
			folderGroup : folderGroup,
			tagsGroup : tagsGroup
		};
	},	
	bookmarkTemplate : function(id, name, folder, tag, type, image) {
		var li = $("<li class='span2' bookmark-id='" + id + "' bookmark-folder='" + folder + "' bookmark-tag='" + tag + "' bookmark-type='" + type + "' ></li>");
		var link = $("<a href='#' class='thumbnail'></a>");
		var img = $("<img src='../resources/img/160x120.gif' alt=''>");
		var title = $("<h5>" + name + "</h5>");
		link.append(img, title);
		li.append(link);
		
		return li; 
	}
};
