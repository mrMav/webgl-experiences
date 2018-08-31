var Key = function(keyCode) {
	
	this.keyCode = keyCode;
	
	this.isDown = false;
	
}

Key.prototype.Init = function() {
	
	var self = this;
	
	window.addEventListener("keydown", function(evt) {
		
		self.OnDownEvent(evt.keyCode, self);
		
	}, true);
	
	window.addEventListener("keyup", function(evt) {
		
		self.OnUpEvent(evt.keyCode, self);
		
	}, true);
	
}

Key.prototype.OnDownEvent = function(keyCode, self) {
		
	if(keyCode === self.keyCode) {
		
		self.isDown = true;
		
	}
	
}

Key.prototype.OnUpEvent = function(keyCode, self) {
		
	if(keyCode === self.keyCode) {
				
		self.isDown = false;
		
	}
	
}