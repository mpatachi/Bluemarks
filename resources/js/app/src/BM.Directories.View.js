/**
 * @author Robert
 * Directories.View.js
 */
BM.Directories.View = {
	directoryHolder : 'directories-list',
	isLoading : false,
	activeDirectory : null,
	activeList : [],
	
	itemTemplate : function(name, id, target, parent) {
		var it = $("<li><a href='#' class='directory-btn' node-id='" + id + "' node-target='" + target + "' node-parent='" + parent + "'>" + name + "</a></li>");

		return it;
	},
	listTemplate : function(name) {
		var holder = $("<ul class='directories-list' node='" + name + "'></ul>");
		
		return holder;
	},
	
	getDirectoriesHolder : function() {
		return $(this.directoryHolder);
	},
	listDirectories : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		
		_(storage.directoriesRef).each(function(obj) {
			var listTemplate = me.listTemplate(obj.ref);
			
			_(obj.children).each(function(index) {
				var item = storage.getDirectory(index);
				var listItem = me.itemTemplate(item.name, item.id, 'directory-' + item.id, obj.ref);
				listTemplate.append(listItem);
			});
			
			/*
			 * add the templates to the DOM
			 * TODO: the items are added directly should run through a templating
			 * 		 system.
			 */
			BM.Templater.Directories.directoriesListHolder().append(listTemplate);
		});
		
		BM.e(callback);
	},
	showDirectories : function(item) {
		//var d = $(".directories-list[node='" + id + "']");
		item.fadeIn('200');
	},
	hideDirectories : function(item) {
		item.hide();
	},
	bindHandlers : function() {
		var me = this;
		var d = $('.directories-list');
		var dirNavigator = $('.directories-breadcum-navigation');

		d.on('click', 'a', function(event) {
			var id = 'directory-' + $(this).attr('node-id');
			var temp = $(".directories-list[node='" + id + "']");
			
			if(temp.length > 0) {
				var toHide = $(this).parents('.directories-list');
				var parentNode = toHide.attr('node');
				me.hideDirectories(toHide);
				me.showDirectories(temp);
				dirNavigator.attr('node-target', parentNode);
				me.activeDirectory = temp;	//introduce the active directory
				me.activeList.push(temp);	//introduce the active directory to the active dir list 
			}
			
			//me.showDirectories(n);	
			return false;
		});
		/*
		 * TODO: use a targeting system instead of array
		 */
		dirNavigator.on('click', function(event) {
			var t = me.activeList;
			var l = t.length;

			if (l > 1) {
				me.hideDirectories(t[l-1]);
				me.showDirectories(t[l-2]);
				me.activeList.splice(l-1, 1);
			}

			return false;
		});
	},
	init : function() {
		var me = this;
		me.listDirectories(function() {
			var r = $(".directories-list[node='root']");
			me.activeList.push(r);
			me.showDirectories(r);
			me.bindHandlers();
		});
	} 
};	