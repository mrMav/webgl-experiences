var Keyboard = function() {
	
	this.keys = [];
	
	this.left  = new Key(37);
	this.right = new Key(39);
	this.up    = new Key(38);
	this.down  = new Key(40);
	
	this.keys.push(this.left);
	this.keys.push(this.right);
	this.keys.push(this.up);
	this.keys.push(this.down);
	
	this.keys.forEach(function(k) {
		
		k.Init();
		
	});
	
}
