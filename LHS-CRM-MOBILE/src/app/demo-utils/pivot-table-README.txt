step 1 : install plugins
		 ---------------
		 - npm i fusioncharts (if fusionChart required)
	     - npm i webdatarocks;

step 2 : inside demo-utils we have 2 folder
		 ----------------------------------	

	   - 1) pivot-table-data ( that have all the js and css file required for pivot table ) 
	 
	 	  required js and css file are 
		  ----------------------------
			-webdatarocks.css
			-webdatarocks.d.ts
			-webdatarocks.googlecharts.js
			-webdatarocks.highcharts.js
			-webdatarocks.js
			-webdatarocks.min.css
			-webdatarocks.toolbar.js
			-webdatarocks.toolbar.min.js
	
		  required folder
		  ---------------
		   theme
	
		*copy above files and folder from node_modules/webdatarocks and paste into pivot-table-data folder

 	
	   -2) pivot-table-webdatarocks( this is component having two files )
	
		   -webdatarocks.component.html
		   -webdatarocks.component.ts
			
			 *add this component in 
				
			 declarations:[WebdatarocksComponent]
		
			 bootstrap: [WebdatarocksComponent]


step 3 : create frame-pivot-table in frames component
		
		--import { WebdatarocksComponent } from 'src/app/demo-utils/pivot-table-webdatarocks/webdatarocks.component';
		--import * as WebDataRocks from 'webdatarocks';


step 4 : mapping of required js and css file in angular.json 

		 *after give checkout add this files info angular.json

		"styles": ["src/app/demo-utils/pivot-table-data/webdatarocks.min.css",

		"scripts": ["src/app/demo-utils/pivot-table-data/webdatarocks.toolbar.min.js",
         	   		"src/app/demo-utils/pivot-table-data/webdatarocks.js"],