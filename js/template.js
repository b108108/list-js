(function (window) {

	function Template() {
		this.startTableTemplate = '<table><tr><th> Date expires </th><th> Task </th><th> Date created </th><th> Type </th><th> Status </th><th></th></tr>';
		this.defaultTemplate =
		 	'<tr data-id="{{id}}" class="{{completed}}">' +
		 	'<td>{{expires_at}}</td>' + 
		 	'<td>{{task}}</td>' +
		 	'<td>{{created_at}}</td>' +
		 	'<td>{{type}}</td>' +
		 	'<td>{{status}}</td>' +
		 	'<td><input type="checkbox" class="status" value={{id}} {{checked}}></td>' +
		 	'<td><button class="remove" id="{{id}}">x</button></td></tr>';
		this.endTableTemplate = '</table>';
	}

	Template.prototype.show = function (data) {
		let view = null;
	
		if (data.length!=0) {
			view = this.startTableTemplate;
		}

		for (let i = 0, l = data.length; i < l; i++) {
			let template = this.defaultTemplate;
			let completed = '';
			let checked = '';
			let status = "Active";
			

			if (data[i].done) {
				completed = 'hide';
				checked = 'checked';
				status = "Done";
			}

			template = template.replace('{{id}}', data[i].id);
			template = template.replace('{{task}}', data[i].task);
			template = template.replace('{{expires_at}}', data[i].expires_at);
			template = template.replace('{{created_at}}', data[i].created_at);
			template = template.replace('{{status}}', status);
			template = template.replace('{{type}}', data[i].type);
			template = template.replace('{{completed}}', completed);
			template = template.replace('{{checked}}', checked);

			view = view + template;
		}
		if (data.length!=0) {
			view = view + this.endTableTemplate;
		}
		
		return view;
	};

	// Export to window
	window.app = window.app || {};
	window.app.Template = Template;
})(window);