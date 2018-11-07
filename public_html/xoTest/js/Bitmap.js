(function(){
		
    function Bitmap(){
		
    } 

   Bitmap.prototype = {
		onload: function(bmp){},
		
		load: function(url){
			
			var img = new Image();
			img.src = url;
			
			var bmp = this;
			
		
			img.onload = function(){				
				bmp.width = this.width;
				bmp.height = this.height;				
				bmp.bitmapData = this;				
				bmp.onload(bmp);				
			}	
		}
   }
   
   Bitmap.prototype.width = 0;
   Bitmap.prototype.height = 0;
   Bitmap.prototype.bitmapData = null;
   
   window.Bitmap = Bitmap;
})();

