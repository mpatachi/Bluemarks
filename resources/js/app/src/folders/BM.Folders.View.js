/**
 * @author Robert
 * Folders.View.js
 */
BM.Folders.View = {
	folderHolder : 'folders-list',
	isLoading : false,
	activeFolder : $('.list-for-root'),
	currentFolder : null,
	activeList : [],
	
	getFoldersHolder : function() {
		return $(this.folderHolder);
	},
	addFolderToList : function(folder) {
		console.log('addFolderToList');
		var targetNode;
		var utils = BM.utils;
		var storage = BM.Storage.g();
		var t = BM.Templater.Folders;
		if (folder.parentId != 'null') {
			// var r = utils.search(storage.foldersRef, function(i) {
				// return i.realId == folder.parentId;
			// });
			
			// if (-1 !== r) {
				// var nodeId = storage.foldersRef[r].id;
				// targetNode = 'folder-' + nodeId;
				// var listTemplate = t.listTemplate(targetNode);
				// var node = $(".folder-btn[node-id='" + nodeId + "']");
				// node.attr('node-target', targetNode);
			// }
			var nodeId = folder.parentId;	//i have overwriten the parentId with the internal pId
			targetNode = 'folder-' + nodeId;
			var node = $(".folder-btn[node-id='" + nodeId + "']");
			node.attr('node-target', targetNode);
			if ($('.list-for-' + targetNode).length == 0) {
				var listTemplate = t.listTemplate(targetNode);
				t.foldersListHolder().append(listTemplate);
			}
		} else {
			targetNode = 'root';
		}
		var dirRef = 'folder-' + folder.intId;
		var r = utils.search(storage.folderTree, function(it) {
			return it.ref == dirRef;
		});
		if (-1 === r) {
			dirRef = 'none';
		}
		var listItem = t.itemTemplate(folder.name, folder.intId, dirRef, targetNode);
		var target = $(".folders-list[node='" + targetNode + "']");
		target.append(listItem);
	},
	listFolders : function(callback) {
		var me = this;
		var storage = BM.Storage.g();
		var t = BM.Templater.Folders;
		var utils = BM.utils;
		
		_(storage.folderTree).each(function(obj) {
			var listTemplate = t.listTemplate(obj.ref);

			_(obj.children).each(function(index) {
				var item = storage.getFolder(index).folder;
				var dirRef = 'folder-' + item.intId;
				var r = utils.search(storage.folderTree, function(it) {
					return it.ref == dirRef;
				});
				if (-1 === r) {
					dirRef = 'none';
				}
				var listItem = t.itemTemplate(item.name, item.intId, dirRef, obj.ref);
				listTemplate.append(listItem);
			});
			
			t.foldersListHolder().append(listTemplate);
		});

		BM.e(callback);
	},
	showFolders : function(item) {
		//var d = $(".folders-list[node='" + id + "']");
		item.fadeIn('200');
	},
	hideFolders : function(item) {
		item.hide();
	},
	bindHandlers : function() {
		var me = this;
		var dList = $('.folders-list');
		var d = $(document);
		//var dirNavigator = $('.folders-breadcrumb-navigation');
		var dirHolder = $('.folders-list-holder');
		var breadcrumb = $('.breadcrumb-active-folders');
		
		/*
		 * main logi of the folder navigation
		 */
		dirHolder.on('click', '.folder-btn', function(event) {
			var item = $(this);
			var targetNode = item.attr('node-target');
			var nodeId = parseInt(item.attr('node-id'), 10);
			var itemText = item.text();
			var parentNode = item.attr('node-parent');
			var folder = $("<span class='active' node-id='" + nodeId + "' node-target='" + targetNode + "' node-name='" + itemText + "' node-parent='" + parentNode + "'>" + itemText + "/</span>");
			var breadcrumbChildren = breadcrumb.children();
			breadcrumbChildren.removeClass('active');
			
			if (targetNode !== 'none') {
				var target = $(".folders-list[node='" + targetNode + "']");
				if(target.length > 0) {
					var toHide = item.parents('.folders-list');
					
					me.hideFolders(toHide);
					me.showFolders(target);
					//dirNavigator.attr('node-target', parentNode);
					me.activeFolder = target;	//introduce the active folder
					me.activeList.push(target);	//introduce the active folder to the active dir list 
				}
				
				//d.trigger('sorter-activate-multiple-folders', [nodeId]);
				// breadcrumb.append(folder);
			} else {

			}
			var bLastItem = breadcrumbChildren.last();
			
			if (bLastItem.attr('node-parent') == parentNode) {
				bLastItem.remove();
			}
			breadcrumb.append(folder);
			dirHolder.attr('active-node', nodeId);			
			me.currentFolder = nodeId;
			d.trigger('sorter-activate-folder');

			return false;
		});
		/*
		 * show the root folders only
		 */
		$('.breadcrumb-show-root').on('click', function() {
			var target = $('.list-for-root');
			if (target == me.activeFolder) {
				return;
			}
			breadcrumb.empty();
			console.log('showing root folder');
			me.hideFolders(me.activeFolder);
			me.showFolders(target);
			me.activeFolder = target;
			dirHolder.attr('active-node', -1);
		});
		/*
		 * the folder navigation by breadcrumb
		 */
		breadcrumb.on('click', 'span', function() {
			var item = $(this);
			if (item.hasClass('active')) {
				return;
			}
			console.log('#');
			var parent = item.parent();
			var parentChildren = parent.children();
			var len = parentChildren.length;
			var index = parentChildren.index(item);
			var target = $('.list-for-' + item.attr('node-target'));
			me.hideFolders(me.activeFolder);
			me.showFolders(target);
			me.activeFolder = target;
			me.currentFolder = parseInt(item.attr('node-id'), 10);	
			if (index < len - 1) {
				for (var i = index + 1; i < len; i++) {
					parentChildren.eq(i).remove();
				}
			}
			if (index == len -1) {
				parentChildren.eq(index + 1).remove();
			}
			parentChildren.eq(index).addClass('active');
			d.trigger('sorter-activate-folder');
		});
		/*
		 * TODO: use a targeting system instead of array
		 */
		// dirNavigator.on('click', function(event) {
			// var t = me.activeList;
			// var l = t.length;
// 
			// if (l > 1) {
				// me.hideFolders(t[l-1]);
				// me.showFolders(t[l-2]);
// 				
				// var temp = t[l-1].attr('node').split('-');
				// var diactivate = parseInt(temp[1], 10);
				// temp = t[l-2].attr('node').split('-');
				// var activate = parseInt(temp[1], 10);
				// if (temp[0] == 'root') {
					// active = -1;
				// }
				// d.trigger('sorter-diactivate-multiple-folders', [diactivate]);	
				// d.trigger('sorter-activate-multiple-folders', [activate]);
				// dirHolder.attr('active-node', activate);
// 				
				// me.activeList.splice(l-1, 1);			
			// }
// 
			// return false;
		// });
		
		var addDirInput = $('.add-new-folder');
		var addDirBtn = $('.add-folder-shortcut-btn');
		addDirInput.keyup(function(e) {
			if (e.keyCode == 27) {
				addDirInput.fadeOut(function() {
					addDirInput.val('');
					addDirBtn.fadeIn();
				});
			}
		});
		addDirInput.on('keypress', function(event) {
			if (event.keyCode !== 13) {
				return;
			}
			
			var parent = dirHolder.attr('active-node');
			if (parent == -1) {
				parent = 'null';
			}
			d.trigger('add-folder', [addDirInput.val(), parent]);
			addDirInput.val('');
			addDirInput.fadeOut(function() {
				addDirBtn.fadeIn();
			});
		});
		addDirInput.blur(function() {
			addDirInput.fadeOut(function() {
				addDirInput.val('');
				addDirBtn.fadeIn();
			});
		});
		addDirBtn.on('click', function() {
			$(this).fadeOut(function() {
				addDirInput.fadeIn();
				addDirInput.focus();
			});
			
			return false;
		});
	},
	init : function() {
		var me = this;
		$('.folders-list-holder').empty();
		
		me.listFolders(function() {
			var r = $(".folders-list[node='root']");
			me.activeList.push(r);
			me.showFolders(r);
			me.bindHandlers();
		});
	} 
};	