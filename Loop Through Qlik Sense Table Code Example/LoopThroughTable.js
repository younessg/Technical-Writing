/*
 * Basic responsive mashup template
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
} );

require(["js/qlik"], function ( qlik ) {
	qlik.setOnError( function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		$( '#popup' ).fadeIn( 1000 );
	} );
	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
	} );

	//callbacks -- inserted here --
	//open apps -- inserted here --
	var app = qlik.openApp('TableMashupLoop.qvf', config);

	//get objects -- inserted here --
	app.getObject('QV01','FAqRJKB');
	
	app.getObject("FAqRJKB").then(model => {  
      
	  // Contains the full size of the hypercube, which is qcx * qcy
      // qcx number of columns and qcy the height or number ie. rows
	  var totaColumns = model.layout.qHyperCube.qSize.qcx;
	  var totaRows = model.layout.qHyperCube.qSize.qcy;
      
	  $("#tableResult").append("Total columns = " + totaColumns + ". Total rows = " + totaRows + '<br>');
      
	  var count = 0;
      // Fetch a page of data. A single page can maximum contain 10000  
      // cells. Calculate the page size and number of pages based of qSize  
      // and fetch accordingly.
      model.getHyperCubeData('/qHyperCubeDef', [{  
        qTop: 0,   
        qLeft: 0,   
        qWidth: 10,   
        qHeight: 1000  
      }]).then(data =>
	  		data.qDataPages[0].qMatrix.forEach( 
				function(element){
					count++;
					// Show values in in the second column, note we used static index of 1
					// where if 0 was used this will give us the values in first column
					$("#tableResult").append('<br> ' + count + ' => ' + element[1].qText);
				}
			)
	  	)  
    })  
	
	//create cubes and lists -- inserted here --

} );
