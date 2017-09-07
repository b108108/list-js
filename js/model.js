(function (window) {
	'use strict';

	function Model(storage) {
		this.storage = storage;
	}
	
	Model.prototype.create = function (data, callback) {
		let self = this;
		data = data || '';
		callback = callback || function () {};

		self.storage.checkItem (data, function (data) {
			self.storage.save(data, callback);
		});
	};
	
	Model.prototype.clearStorages = function(){
		let self = this;
		
		self.storage.clearStorages();
	};
	
	Model.prototype.getTypes = function (callback) {
		let self = this;
		
		self.storage.downloadTypes(callback);
	};

	Model.prototype.getStorage = function (callback) {
		let self = this;
		
		self.storage.findAll(callback);
	};
	
	Model.prototype.readJSON = function(callback) {
		let self = this;
		
		self.storage.downloadTasks(callback);
	}
	
	Model.prototype.update = function (id, data, callback) {
		this.storage.complete(data, callback, id);
	};
	
	Model.prototype.deleteItem = function(id, callback) {
		let self = this;
		
		self.storage.deleteItem(id, callback);
	};

	Model.prototype.removeAll = function(callback) {
		let self = this;
		
		self.storage.drop(callback);
	};
	
	// Export to window
	window.app = window.app || {};
	window.app.Model = Model;
})(window);
