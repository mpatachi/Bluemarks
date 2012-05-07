/**
 * @author Robert
 */

BM.Tags.View = {
	tagsList : [],
	typeaheadObject : null,
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
		var storage = BM.Storage.g();
		var typeahead = $('.apply-tag-input');
		var tags = [];
		_(storage.tags).each(function(obj, key) {
			tags.push(obj.tag.name);
		});
		me.typeaheadObject = typeahead.typeahead({
			source : tags
		});
		me.tagsList = tags;
		if (callback !== undefined) {
			BM.e(callback);	
		}		
	},
	updateTypeahead : function(data) {
		var storage = BM.Storage.g();
		var tags = [];
		_(storage.tags).each(function(obj, key) {
			tags.push(obj.tag.name);
		});
		this.typeaheadObject.data('typeahead').source = tags;
		this.tagsList = tags;
		
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
	bindHandlers : function() {
		var me = this;
		var d = $(document);
		$('.sort-tags').on('click', function(event) {
			var item = $(this);
			var active = item.hasClass('active');
			var toolbar = $('.tags-toolbar');
			
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
		
		var applyTagInput = $('.apply-tag-input');
		var applyTagBtn = $('.apply-tag-btn');
		var popoverIsActive = false; 
		applyTagInput.keyup(function(e) {
			if (e.keyCode == 27) {
				applyTagInput.fadeOut(function() {
					applyTagInput.val('');					
					popoverIsActive = false;
					applyTagBtn.fadeIn();
				});
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
				// popoverIsActive = true;
				// applyTagInput.popover('show');
				// d.trigger('bind-tag-popover-events');
				d.trigger('show-tag-popover');				
			} else {
				//d.trigger('apply-tag', [value]);
				popoverIsActive = false;
				applyTagInput.fadeOut(function() {
					applyTagInput.val('');
					applyTagBtn.fadeIn();
				});				
			}
			
			console.log(r, value);		
		});
		// applyTagInput.on('change', function() {
			// if (popoverIsActive) {
				// applyTagInput.fadeOut(function() {
					// applyTagInput.popover('hide');
					// popoverIsActive = false;
					// applyTagInput.val('');
					// applyTagBtn.fadeIn();
				// });	
			// }
		// });
		applyTagInput.on('input', function(e) {
			if (popoverIsActive) {
				// d.trigger('unbind-tag-popover-events');
				// applyTagInput.popover('hide');				
				// popoverIsActive = false;
				d.trigger('hide-tag-popover');
				applyTagInput.fadeOut(function() {
					applyTagInput.val('');
					applyTagBtn.fadeIn();
				});					
			}
		});
		applyTagInput.blur(function() {
			if (popoverIsActive) {
				return;
			}
			applyTagInput.fadeOut(function() {
				applyTagInput.val('');
				applyTagBtn.fadeIn();
			});
		});
		applyTagBtn.on('click', function() {
			$(this).fadeOut(function() {
				applyTagInput.fadeIn();
				applyTagInput.focus();
			});
			
			return false;
		});
		d.on('bind-tag-popover-events', function() {
			var popConfirm = $('.tag-popover-confirm');
			popConfirm.on('click', function(event) {
				d.trigger('add-tag', [applyTagInput.val()]);
				
				return false;
			});
			var popClose = $('.tag-popover-close');
			popClose.on('click', function(event) {
				// d.trigger('unbind-tag-popover-events');
				// applyTagInput.popover('hide');
				// popoverIsActive = false;
				d.trigger('hide-tag-popover');
				applyTagInput.val('');
				applyTagInput.focus();
				
				return false;		
			});			
		});
		d.on('unbind-tag-popover-events', function() {
			var popConfirm = $('.tag-popover-confirm');
			popConfirm.off('click');
			var popClose = $('.tag-popover-close');
			popClose.off('click');						
		});
		d.on('show-tag-popover', function() {
			popoverIsActive = true;
			applyTagInput.popover('show');
			d.trigger('bind-tag-popover-events');			
		});
		d.on('hide-tag-popover', function() {
			d.trigger('unbind-tag-popover-events');
			applyTagInput.popover('hide');
			popoverIsActive = false;
		});
		d.on('hide-apply-tag-input', function() {
			applyTagInput.fadeOut(function() {
				applyTagInput.val('');
				applyTagBtn.fadeIn();
			});			
		});			
	},
	init : function() {
		var me = this;
		
		me.populateTypeahead();
		me.addPopovers();
		me.bindHandlers();
	}
};
