(function (window) {
	'use strict';
	
	function Controller(model, view) {
		let self = this;
		self.model = model;
		self.view = view;

		self.view.bind('add', function (data){
			self.addItem(data);
		});
		self.view.bind('open', function (){
			self.downloadJSON();
		});
		self.view.bind('delete', function (){
			self.removeAll();
		});
		self.view.bind('new-type', function (item) {
			self.addValue(item.id);
		});
		self.view.bind('itemToggle', function (item) {
			self.toggleComplete(item.id, item.completed);
		});
		self.view.bind('deleteItem', function (item) {
			self.deleteItem(item.id);
		});

	}

	Controller.prototype.getTypes = function(){
		let self = this;
		
		self.model.getTypes(function (data) {
			self.view.render('setValue', data);
		});
	};
	
	Controller.prototype.showStorage = function(){
		let self = this;
		
		self.model.getStorage(function (data) {
			self.view.render('showEntries', data);
		});
	};
	
	Controller.prototype.clearStorages = function(){
		let self = this;
		
		self.model.clearStorages();
	};
	
	Controller.prototype.addItem = function (data) {
		let self = this;

		self.model.create(data, function () {
			self.model.getStorage(function (data) {
				self.view.render('showEntries', data);
			});
		});
	};

	Controller.prototype.downloadJSON = function () {
		let self = this;
		
		self.model.readJSON(function () {
			self.model.getStorage(function (data) {
				self.view.render('showEntries', data);
			});
		});
	};
	
	Controller.prototype.toggleComplete = function (id, completed) {
		let self = this;
		self.model.update(id, { completed: completed }, function () {
			self.model.getStorage(function (data) {
				self.view.render('showEntries', data);
			});
		});
	};

	Controller.prototype.deleteItem = function (id) {
		let self = this;
		
		self.model.deleteItem(id, function() {
			self.model.getStorage(function (data) {
				self.view.render('showEntries', data);
			});
		});
	};

	Controller.prototype.removeAll = function () {
		let self = this;
		
		self.model.removeAll(function () {
			self.model.getStorage(function (data) {
				self.view.render('showEntries', data);
			});
		});
	};
	
	// Export to window
	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);
