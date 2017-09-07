(function(){
	'use strict';

	function ListJS(name, nameTypes) {
		this.storage = new app.Store(name, nameTypes);
		this.model = new app.Model(this.storage);
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.model, this.view);
	}

	let list = new ListJS('listJs', 'types');

	function onLoad() {
		list.controller.getTypes();
		list.controller.showStorage();
	}
	
	function clearStorages() {
		list.controller.clearStorages();
	}
	
	$on(window, 'load', onLoad);
	$on(window, 'beforeunload', clearStorages);
})();