(function (window) {
	'use strict';

	function View(template) {
		this.template = template;

		this.$newTask = qs('.new-task');
		this.$newExpires = qs('.new-expires');
		this.$newState = qs('.new-status');
		this.$newType = qs('.new-type');
		this.$showList = qs('.showlist');
		this.$add = qs('.add');
		this.$open = qs('.open');
		this.$deleteAll = qs('.delete');
	}
	
	View.prototype._itemId = function (element) {
		let tr = $parent(element, 'tr');
		return parseInt(tr.dataset.id, 10);
	};
	
	View.prototype.render = function (viewCmd, parameter) {
		let self = this;
		let viewCommands = {
			showEntries: function () {
				self.$showList.innerHTML = self.template.show(parameter);
			},
			setValue: function (data) {
				parameter.forEach(function(item, index) {
					let newOption = new Option(item.name, item.id);
					self.$newType.options[self.$newType.options.length]=newOption;
				});
			}
		};
		viewCommands[viewCmd]();
	};
	
	View.prototype.bind = function (event, handler) {
		let self = this;		
		if (event === 'add') {
			$on(self.$add, 'click', function () {
				handler({
					task: self.$newTask.value,
					expires_at: self.$newExpires.value,
					created_at: 0,
					done: self.$newState.value,
					type: self.$newType.value
				});
			});			
		} else if (event === 'open') {
			$on(self.$open, 'click', function () {
				handler();
			});
		} else if (event === 'delete') {
			$on(self.$deleteAll, 'click', function () {
				handler();
			});
		} else if (event === 'itemToggle') {
			$delegate(self.$showList, '.status', 'click', function () {
				handler({
					id: self._itemId(this),
					completed: this.checked
				});
			});
		} else if (event === 'deleteItem'){
			$delegate(self.$showList, '.remove', 'click', function () {
				handler({
					id: self._itemId(this)
				});
			});
		}
	};
 
	// Export to window
	window.app = window.app || {};
	window.app.View = View;
}(window));
