
var events = {};

var eventApi = {
	
	register: function(name, cb){
		events[name] = cb;
	}	
}

export = eventApi;