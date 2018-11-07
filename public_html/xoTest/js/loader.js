class Loader{
	
  constructor() {
    console.log("I'm loader");
	this.images = {};	
	this.imagesVol = 0;
	this.onloadImages = null;
  }
  
  image(id, url){
	console.log("load image " + url);
	var img = new Bitmap();
	
	var target = this;
	
	img.onload = function(bmp){
		console.log("Loaded image " + bmp.bitmapData);
		target.images[id] = {};
		target.images[id] = bmp;
	}
	
	img.load(url);
	
  }
  
  setHandler(f){
	 this.onloadImages = f;
  }
  
  loadImages(arr){
	
	var url = arr[this.imagesVol];
	var id = arr[this.imagesVol];
	
	if(this.images[id]) return;
	
	var img = new Bitmap();
	
	var target = this;
	
	img.onload = function(bmp){
		//console.log("Loaded image " + bmp.bitmapData);
		target.images[id] = {};
		target.images[id] = bmp;
		target.imagesVol++;
		if(target.imagesVol < arr.length){
			target.loadImages(arr);
		}else{
			if(target.onloadImages != null) target.onloadImages.apply(target);
		}
	}
	
	img.load(url);
	
	  
  }
  
  getImage(id){
	if(!this.images[id]) return null;
	return this.images[id];
  }
  
  static load(){
		console.log("Load" + this);
  }
  
  
}