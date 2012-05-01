/**
 * @author Robert
 */
BM.Categories.View.AddCategory = {
	bindHandlers : function() {
		var t = BM.Templater.Categories;
		var modal = t.getAddModal();
		//var submitBtn = modal.find('.modal-directory-add');
		//var nameField = modal.find('.modal-directory-name');
		//var selector = modal.find('.modal-parent-selector');
		var d = $(document);
		
		modal.submit.on('click', function() {
			d.trigger('add-category', [modal.name.val()]);
			
			return false;
		});
	},
	init : function() {
		var me = this;
		
		me.bindHandlers();
	}	
};
