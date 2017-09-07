
(function (window) {
	'use strict';

	function Store(nameDb, nameTypes, callback) {
		callback = callback || function () {};

		this._dbName = nameDb;
		this._types = nameTypes;

		if (!localStorage[this._dbName]) {
			let data = [];
			localStorage[this._dbName] = JSON.stringify(data);
		}
		
		if (!localStorage[this._types]) {
			let data = [];
			localStorage[this._types] = JSON.stringify(data);
		}

		callback.call(this, JSON.parse(localStorage[this._dbName]),JSON.parse(localStorage[this._types]));
	};

	Store.prototype.save = function (updateData, callback, id) {
		let allRecords = this.getExistStorage(this._dbName);
		
		callback = callback || function () {};

		allRecords.push(updateData);
		allRecords[allRecords.length-1].id = allRecords.length;
		this.sortBy(allRecords, "expires_at");
		localStorage[this._dbName] = JSON.stringify(allRecords);
		callback.call(this, [updateData]);
	};
	
	Store.prototype.complete = function (updateData, callback, id){
		callback = callback || function () {};
		
		let allRecords = this.getExistStorage(this._dbName);
		for(let i = 0, l = allRecords.length; i < l; i++) {
			if (allRecords[i].id === id) {
				for(let key in updateData) {
					allRecords[i].done = updateData[key];
					allRecords[i][key] = updateData[key];
				}
				break;
			}
		}
		localStorage[this._dbName] = JSON.stringify(allRecords);
		callback.call(this, allRecords);
	};
	
	Store.prototype.downloadTasks = function (callback){
		callback = callback || function () {};
		
		this.getJSONData('http://rygorh.dev.monterosa.co.uk/todo/items.php')
		.then(result => {
			let self = this;
			this.checkTasks(result);
			let allRecords = [];
		    allRecords = this.getExistStorage(this._dbName);
		    if (allRecords.length!=0) {
		    	let tempArray = this.getExistStorage(this._dbName);
		    	result.forEach(function(item){
		    		if (!self.includedLine(tempArray, item)){
		    			allRecords.push(item);
		    			allRecords[allRecords.length-1].id = allRecords.length;
		    		}
		    	});
		    }
		    else {
		    	allRecords=result;
		    }
			this.sortBy(allRecords, "expires_at");
							
		    localStorage[this._dbName] = JSON.stringify(allRecords);
		    callback.call(this, JSON.parse(localStorage[this._dbName]));
		})
		.catch(result => {  
			console.log(result);
		});
	};	

	Store.prototype.getJSONData = function (url) {
	  return new Promise(function(resolve, reject) {
	    let xhr = new XMLHttpRequest();
	    xhr.open('get', url, true);
	    xhr.responseType = 'json';
	    xhr.onload = function() {
	      let status = xhr.status;
	      if (status == 200) {
	        resolve(xhr.response);
	      } else {
	        reject(status);
	      }
	    };
	    xhr.send();
	  });
	};
		
	Store.prototype.getExistStorage = function(nameStorage){
	    let jsonList = localStorage[nameStorage];
	    if (jsonList == null) {
	    	let data = [];
			jsonList = localStorage[nameStorage] = JSON.stringify(data);
	    }
	    return JSON.parse(jsonList);
	}
	
	Store.prototype.findAll = function (callback) {
		callback = callback || function () {};
		callback.call(this, JSON.parse(localStorage[this._dbName]));
	};
	
	Store.prototype.showDate = function ShowDate(element){
		let date = 0;
		if((new Date(element)!='Invalid Date') && (element!=0)){
			date = new Date(element);
		}
		else {
			date = new Date();
		}
		let time = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+"|"+date.getHours()+"-"+date.getMinutes()+"-"+date.getSeconds();
		return time;
	};

	Store.prototype.showType = function ShowType(element){
		let allId = this.getExistStorage(this._types);
		let result = (allId[element]) ? allId[element] : "Undefined";	
		return result;
	};

	Store.prototype.checkTasks = function CheckTasks(records){
		let self = this;
		records.forEach(function(item, index){
			item.expires_at = self.showDate(item.expires_at);
			item.created_at = self.showDate(item.created_at);
			item.type = self.showType(item.type);
			item.id = index;
		});
	 	return records;
	};
	
	Store.prototype.checkItem = function (data, callback){
		callback = callback || function () {};
		
		let task = (data.task=="") ? "None" : data.task;
	    let expires_at = (data.expires_at=="") ? this.showDate(0) : this.showDate(data.expires_at);
	    let type = this.showType(parseInt(data.type));
	    let current_at = this.showDate(0);
	    let completed = "";
	    if (data.done=="Done") {
	    	completed = "hide";
	    	data.done = true;
	    } else {
	    	data.done = false;
	    }	    
	    
	    let newItem = {"task":task,
	    			"expires_at":expires_at,    			
	    			"created_at":current_at,
	    			"done":data.done,
	    			"type":type,
	    			"completed":completed
	    };
	    callback.call(this, newItem);
	}
	
	Store.prototype.sortBy = function (records, element) {
		records.sort(function (a, b) {
				if (a[element] < b[element]) {
					return 1;
				}
				if (a[element] > b[element]) {
					return -1;
				}
				return 0;
			});
		return records;
	}
	
	Store.prototype.includedLine = function (array, line) {
		array.forEach(function(item, index){
			for(let key in line){
				if (line[key]!=item[key]) {
					return false;
				}
			}		
			return true;
		});
	}

	Store.prototype.deleteItem = function (id, callback) {
		callback = callback || function () {};
		
		let allRecords = this.getExistStorage(this._dbName);
		if (allRecords.length==1) {
	    	allRecords = new Array (0);
	    } else {	    	    	
			allRecords.forEach(function(item, index){
				if(item.id==id) {
					allRecords.splice(index, 1);
					return true;
				}
			});
	    }		
		localStorage[this._dbName] = JSON.stringify(allRecords);
		callback.call(this, JSON.parse(localStorage[this._dbName]));
	};
	
	Store.prototype.drop = function (callback) {
		callback = callback || function () {};

		let data = new Array(0);
		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, data);
	};
	
	Store.prototype.downloadTypes = function (callback){
		callback = callback || function () {};
		
		this.getJSONData('http://rygorh.dev.monterosa.co.uk/todo/types.php')
		.then(result => {
			let allId = [];
			result.forEach(function(item, index){
				allId[item.id] = item.name;
			});
			localStorage[this._types] = JSON.stringify(allId);
		    callback.call(this, result);
		})
		.catch(result => {  
			console.log(result);
		});
	};
	
	Store.prototype.clearStorages = function (){
	 	localStorage.removeItem(this._dbName);
	 	localStorage.removeItem(this._types);
	}
	
	// Export to window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);
