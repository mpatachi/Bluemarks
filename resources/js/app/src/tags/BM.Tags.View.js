/**
 * @author Robert
 */

BM.Tags.View = {
	tagsList : [],
	typeaheadObject : null,
	activeTags : null,
	/*
	 * this method of displaing the tags is not used in
	 * the latest version of the application all related templates are not used
	 */	
	// ddItemTemplate : function(name, id) {
		// var it = $("<li><a href='#' tag-id='" + id + "'>" + name + "</a></li>");
// 		
		// return it;
	// },
	/*
	 * this method of displaing the tags is not used in
	 * the latest version of the application all related templates are not used
	 */
	// listTags : function(callback) {
		// var me = this;
		// var storage = BM.Storage.g();
		// _(storage.tags).each(function(obj, key) {
			// var itemTample = me.ddItemTemplate(obj.tag.name, key);
			// BM.Templater.Tags.ddTagHolder().append(itemTample);
		// });
// 		
		// if (callback !== undefined) {
			// BM.e(callback);	
		// }
	// },
	populateTypeahead : function(callback) {
		var me = this;
		var tags = BM.Storage.g().tagsName;
		var typeahead = $('.apply-tag-input');
		// var tags = [];
		// _(storage.tags).each(function(obj, key) {
			// tags.push(obj.tag.name);
		// });
		me.typeaheadObject = typeahead.typeahead({
			source : tags
		});
		me.tagsList = tags;
		if (callback !== undefined) {
			BM.e(callback);	
		}		
	},
	updateTypeahead : function(data) {
		var me = this;
		var tags = BM.Storage.g().tagsName;
		// var tags = [];
		// _(storage.tags).each(function(obj, key) {
			// tags.push(obj.tag.name);
		// });
		me.typeaheadObject.data('typeahead').source = tags;
		me.tagsList = tags;
		
	},
	addPopovers : function() {
		var applyTagInput = $('.apply-tag-input');
		var target = $('#apply-tag-popover-add');
		applyTagInput.popover({
			placement : 'bottom',
			trigger : 'manual',
			title : function() {
				return target.children('.title').html();
			},
			content : function() {
				return target.children('.content').html();
			}
		});
	},
	/*
	 * this method of displaing the tags is not used in
	 * the latest version of the application all related templates are not used
	 */	
	// addTagToList : function(tag, callback) {
		// var me = this;
		// var itemTample = me.ddItemTemplate(tag.name, tag.intId);
		// BM.Templater.Tags.ddTagHolder().append(itemTample);
// 		
		// if (callback !== undefined) {
			// BM.e(callback);		
		// }	
	// },
	addToActiveTags : function(tag) {
		var parent = this.activeTags.parent(),
			item = "<li class='tag-active-item'><span tag-name='" + tag + "'>" + tag + "<a class='close tag-remove' href='#'>&times;</a></span></li>",  
			html = this.activeTags.html();
		this.activeTags.detach();
		html += item;
		this.activeTags.html(html);
		parent.append(this.activeTags);		
	},
	bindHandlers : function() {
		var me = this,
			d = $(document),
			applyTagInput = $('.apply-tag-input'),
		 	applyTagBtn = $('.apply-tag-btn'),
		 	toolbar = $('.tags-toolbar');
		 	
		$('.sort-tags').on('click', function(event) {
			var item = $(this),
				active = item.hasClass('active');
					
			if (active) {
				toolbar.animate({
					'marginTop' : '-51px'
				}, 300, 'linear');
			} else {
				toolbar.animate({
					'marginTop' : 0
				}, 300, 'linear');				
			}
		});
		$('#active-tags-list').on('click', '.tag-remove', function(event) {
			var item = $(this),
				parent = item.parent(),
				value = parent.attr('tag-name');
			parent.remove();
			d.trigger('sorter-diactivate-tag', [value]);
			
			return false;
		});
		function hideTagInput() {
			applyTagInput.fadeOut(function() {
				applyTagInput.val('');
				applyTagBtn.fadeIn();
			});			
		}

		applyTagInput.keyup(function(e) {
			if (e.keyCode == 27) {
				hideTagInput();
			}
		});
		applyTagInput.on('keypress', function(event) {
			if (event.keyCode !== 13) {
				return;
			}
			var value = applyTagInput.val();
			if (value == '') {
				return;
			}
			var r = _.find(me.tagsList, function(item) {
				return item == value;
			});
			if (!r) {
				hideTagInput();
			} else {
				me.addToActiveTags(value);
				d.trigger('sorter-activate-tag', [value]);
				hideTagInput();			
			}			
		});
		applyTagInput.blur(function() {
			hideTagInput();
		});
		applyTagBtn.on('click', function() {
			$(this).fadeOut(function() {
				applyTagInput.fadeIn();
				applyTagInput.focus();
			});
			
			return false;
		});
	
		d.on('hide-apply-tag-input', function() {
			hideTagInput();		
		});			
	},
	init : function() {
		var me = this;
		
		me.populateTypeahead();
		me.activeTags = $('#active-tags-list');
		//me.addPopovers();
		me.bindHandlers();
	}
};
