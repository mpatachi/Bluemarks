/**
 * @author Robert
 */

BM.Templater = {};

BM.Templater.Directories = {
	leftSidebar : function() {
		return $('.left-sidebar');
	},
	directoriesListHolder : function() {
		return $('.directories-list-holder');
	},
	itemTemplate : function(name, id, target, parent) {
		var it = $("<li><a href='#' class='directory-btn' node-id='" + id + "' node-target='" + target + "' node-parent='" + parent + "'>" + name + "</a></li>");

		return it;
	},
	listTemplate : function(name) {
		var holder = $("<ul class='directories-list' node='" + name + "'></ul>");
		
		return holder;
	},
	getAddModal : function() {
		var modal = $('#add-directory-modal');
		var submitBtn = modal.find('.modal-directory-add');
		var nameField = modal.find('.modal-directory-name');
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

BM.Templater.Categories = {
	ddCategoryHolder : function() {
		return $('.categories-dropdown');
	},
	getAddModal : function() {
		var modal = $('#add-category-modal');
		var submitBtn = modal.find('.modal-category-add');
		var nameField = modal.find('.modal-category-name');
		var nameGroup = modal.find('.modal-name-group');
		
		return {
			el : modal,
			submit : submitBtn,
			name : nameField,
			nameGroup : nameGroup,
		};		
	}
};

BM.Templater.Bookmarks = {
	bookmarksList : function() {
		return $('.bookmarks-list');
	},
	bookmarkTemplate : function(id, name, category, image) {
		var li = $("<li class='span2' bookmark-id='" + id + "' bookmark-category='" + category + "' ></li>");
		var link = $("<a href='#' class='thumbnail'></a>");
		var img = $("<img src='../resources/img/160x120.gif' alt=''>");
		var title = $("<h5>" + name + "</h5>");
		link.append(img, title);
		li.append(link);
		
		return li; 
	}
};
