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
	}
};

BM.Templater.Tags = {
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
	getEditModal : function() {
		var modal = $('#edit-bookmark-modal');
		var submitBtn = modal.find('.modal-bookmark-save-confirm');
		var titleField = modal.find('.modal-bookmark-title');
		var urlField = modal.find('.modal-bookmark-url');
		var folderField = modal.find('.modal-bookmark-folder');
		var tagsField = modal.find('.modal-bookmark-tags');
		var descField = modal.find('.modal-bookmark-description');
		var titleGroup = modal.find('.modal-title-group');
		var urlGroup = modal.find('.modal-url-group');
		var folderGroup = modal.find('.modal-folder-group');
		var tagsGroup = modal.find('.modal-tags-group');
		var descGroup = modal.find('.modal-description-group');
		
		return {
			el : modal,
			submit : submitBtn,
			title : titleField,
			url : urlField,
			folder : folderField,
			tags : tagsField,
			description : descriptionField,
			titleGroup : titleGroup,
			urlGroup : urlGroup,
			folderGroup : folderGroup,
			tagsGroup : tagsGroup,
			descriptionGroup : descGroup
		};		
	},	
	bookmarkTemplate : function(id, name, url, folder, tag, type, image) {
		var li = $("<li class='span2' bookmark-id='" + id + "' bookmark-folder='" + folder + "' bookmark-tag='" + tag + "' bookmark-type='" + type + "' ></li>");
		var link = $("<a href='" + url + "' target='_blank' class='thumbnail'></a>");
		var img = $("<img src='../resources/img/160x120.gif' alt=''>");
		var title = $("<h5>" + name + "</h5>");
		link.append(img, title);
		li.append(link);
		
		return li; 
	}
};
