	
/*********************************
  Initialisations
*********************************/

var min_rows = 1;  // Minimum rows
var max_rows = 30; // Maximum rows
var min_columns = 1;  // Minimum columns
var max_columns = 30; // Maximum columns

$('#main').hide(); // Hide div #main
good_typo(); // Check and update for correct typo

/** Find the iframe */
var myframe = $('#main').children('iframe'); // Method 1: iframe with no provided #ID (works ok if only 1 iframe exists)
//var myframe = $('#myFrame'); // Method 2: iframe with provided #ID




/****************************************************************************************
  Run when adjROW '-' button clicked
*****************************************************************************************/
function adjROW_minus() {
	
	var rows = parseInt($('#rows_value').text(),10); // Read rows and convert to number
		
	if (rows > min_rows) {  // Not already at minimum value?
		$('#rows_value').text(rows-1);
		good_typo(); // Check and update for correct typo
	}
} /******************************************/


/****************************************************************************************
  Run when adjROW '+' button clicked
*****************************************************************************************/
function adjROW_plus() {
	
	var rows = parseInt($('#rows_value').text(),10); // Read rows and convert to number
		
	if (rows < max_rows) {  // Not already at maximum value?
		$('#rows_value').text(rows+1);
		good_typo(); // Check and update for correct typo
	}			
} /******************************************/


/****************************************************************************************
  Run when adjCOL '-' button clicked
*****************************************************************************************/
function adjCOL_minus() {
	
	var columns = parseInt($('#columns_value').text(),10); // Read columns and convert to number
		
	if (columns > min_columns) {  // Not already at minimum value?
		$('#columns_value').text(columns-1);
		good_typo(); // Check and update for correct typo
	}
} /******************************************/


/****************************************************************************************
  Run when adjCOL '+' button clicked
*****************************************************************************************/
function adjCOL_plus() {
	
	var columns = parseInt($('#columns_value').text(),10); // Read columns and convert to number
		
	if (columns < max_columns) {  // Not already at maximum value?
		$('#columns_value').text(columns+1);
		good_typo(); // Check and update for correct typo
	}
} /******************************************/


/****************************************************************************************
  Check and update for correct typo
*****************************************************************************************/	 
function good_typo() {
	
	// Correct typo for 'Row(s)'
	if ((parseInt($('#rows_value').text(),10)) > 1)	{
		$('#rows_text').html('&nbsp;Rows');
	} else {
		$('#rows_text').html('&nbsp;Row');
	}
	// Correct typo for 'Column(s)'
	if ((parseInt($('#columns_value').text(),10)) >1) {
		$('#columns_text').html('&nbsp;Columns');
	} else {
		$('#columns_text').html('&nbsp;Column');
	}
} /******************************************/


/****************************************************************************************
  Fired when Mouse over #main/iframe
*****************************************************************************************/
myframe.hover( function(e) {
	$('#coords').show(); }, // Mouse enter
	function() {  
    $('#coords').hide(); } // Mouse leave

); /******************************************/

 
/****************************************************************************************
  Run when ok button clicked
*****************************************************************************************/
function adj_ok() {
	
	$('#main').show(); // Show div #main

//**** Create the table *************************
	var rows = parseInt($('#rows_value').text(),10); // Read rows and convert to number
	var columns = parseInt($('#columns_value').text(),10); // Read columns and convert to number
	var table = '<table>';
	for(i=0; i<rows; i++) {
		table += '<tr>';
		for(j=0; j<columns; j++) {
			table += '<td>'+'R'+i+'C'+j+'</td>';
		}
		table += '</tr>';
	}
	table += '</table>';
//************

//**** Create HTML code for the iframe *******
	var content = "<!DOCTYPE html><head>";  // Start HTML structure
	content += "<style>"; // Start CSS
	content += "body { -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }";  // some CSS: Disable highlighting on user selection
	content += "body { -webkit-tap-highlight-color:transparent; -khtml-tap-highlight-color:transparent; -moz-tap-highlight-color:transparent; -ms-tap-highlight-color:transparent; tap-highlight-color:transparent; }";  // some CSS: Disable highlighting on tap/double-click
	content += "table, td { border: 1px solid green; outline: none;}";  // some CSS: grid style
	content += "td:hover { background: black; color: white;}";  // some CSS: mouse hover cells
	content += "td.selected { background: #6688ff;}";  // some CSS: class for cells selection
	content += "</style>"; // End CSS
	content += "</head><body>"; // more HTML structure
	content += table; // Add the table
	content += "</body></html>"; // end HTML structure
//************

//**** Insert HTML code in the iframe ********
	myframe[0].contentWindow.document.open(); // open it
	myframe[0].contentWindow.document.write(content); // Write/replace contents
	myframe[0].contentWindow.document.close(); // then release (necessary, otherwise browser keeps 'searching')
//************


	/************************************
	  Fired when left-click on any cell
	*************************************/
	myframe.contents().find('table').click(function(e){

		//**** Toggling selection of a cell **********************
		var clicked_col = $(e.target).closest('td').index(); // col index of the clicked cell 
		var clicked_row = $(e.target).closest('tr').index(); // row index of the clicked cell
		//$(e.target).closest('td').addClass('selected'); // Select this cell
		$(e.target).closest('td').toggleClass('selected'); // Select or deselect (toggle) this cell	
		$('#log').append('<br />Toggle cell (R' + clicked_row + ',C' + clicked_col + ') --> cell is now '); // Log: toggling selection of a cell
		if ($(e.target).closest('td').hasClass('selected')) {
			$('#log').append('selected<br />');
		} else { $('#log').append(' not selected<br />'); }
		//*********************************************************

		//**** Cancels the selection of any other cells **********		
		$('#log').append('Clearing the selection of any other cells:'); // Log: Cancels the selection of any other cells
		var nothing2clear = true;	
		
		$(e.target).closest('table').find('.selected').each(function(){
			var col = $(this).closest('td').index(); // col index of the cell
			var row = $(this).closest('tr').index(); // row index of the cell
			if (col != clicked_col || row != clicked_row) {
				$('#log').append(' (R' + row + ',C' + col + ')'); // Log: indexes of a cell
				$(this).removeClass('selected');
				nothing2clear = false; // There is at least one cell that was cleared
			}
		});
		if (nothing2clear) $('#log').append(' nothing to clear!');
		$('#log').append('<br />');
		//*********************************************************

	}); /*****************************/
	
	
	/************************************
	  Fired when double click on a cell
	*************************************/
	myframe.contents().find('table').dblclick(function(e){

		// Cancels the selection of any other cells
		$(e.target).closest('table').find('.selected').each(function(){
			$(this).removeClass('selected');
		});
		
		var clicked_row = $(e.target).closest('tr').index(); // row index of the clicked cell
		$('#log').append('<br />Row ' + clicked_row + ' selected<br />'); // Log: the index of the row selected
		
		// Select the entire row
		$(e.target).closest('tr').find('td').each(function(){
			$(this).addClass('selected');
		});
		
	}); /*****************************/

	
	/************************************
	  Fired when right-click on iframe
	*************************************/
	myframe.contents().find('html').bind('contextmenu', function(e){

		e.preventDefault(); // This has the effect to disable the context menu in stopping propagation of the event
	
		//*** Select or deselect (toggle) this cell ***
		$(e.target).closest('td').toggleClass(function() {

			var clicked_col = $(this).closest('td').index(); // col index of the clicked cell
			var clicked_row = $(this).closest('tr').index(); // row index of the clicked cell
			$('#log').append('<br />Toggle cell (R' + clicked_row + ',C' + clicked_col + ') --> cell is now '); // Log: toggling selection of a cell
			
			if ($(this).hasClass('selected')) {
				$('#log').append('not selected<br />');
			}else {
				$('#log').append('selected<br />');
			}
			return "selected"; // Toggle the class
		}); //*****************************************		
						
	}); /*****************************/


	/***************************************
	  Fired when MouseMove over the iframe
	****************************************/
	myframe.contents().find('html').mousemove(function(e){
		var Xmouse = e.clientX; var Ymouse = e.clientY; // Read x,y mouse inside iframe
			
		$('#coords').text('('+ Xmouse +','+ Ymouse +')').css({color: "black", textShadow: "3px 2px 6px rgba(255, 0, 0, 1)"}); // Display values of x,y mouse from inside iframe
		
		var offset = $("#main").offset(); // We will display the span relative to the #main element
		$('#coords').offset({ top: (offset.top + Ymouse), left: (offset.left + Xmouse) }); // Display the span with x,y mouse offcet
	
	}); /*****************************/
	
	
	/*****************************************************
	Fired when a key is pressed while iframe is in focus
	******************************************************/
	myframe.contents().find('html').keydown(function(e) {	
		var code = e.keyCode || e.which;
		if (code == 46 || code == 8) { // Key is "Delete" or "Backspace" ?

			//$('#log').append('<br />e.target = ' + e.target.nodeName); // for testing
			//$('#log').append('<br />this = ' + this.nodeName + '<br />'); // for testing
		
			// *** Delete all the cells that were previously selected ***
			$('#log').append('<br />Deleting the selected cells: '); // Log: deleting selected cells
			var nothing2clear = true;
			
			/** Notes:
			 ** when using $(e.target) instead of $(this), couldn't find a reliable way to work cross-browsers.
			 ** 'e.target' always returns 'BODY' with Firefox and Chrome, but IE returns 'HTML' or 'TD' depending if the table is on focus.
			 ** 'this' always return 'HTML' as the DOM element that initiated the event for all browsers, so I use it at the root element.
			 ** but still, things like closest('table') don't work at all for strange reasons...
			 ** So the best code that works cross-browsers is $(this).find('.selected').closest('td')
			 */
			
			$(this).find('.selected').closest('td').each(function(){ // First scan through the table: find the cells
				var col = $(this).closest('td').index(); // col index of the cell
				//var col = $(this).prevAll().length;
				var row = $(this).closest('tr').index(); // row index of the cell
				//var row = $(this).parent('tr').prevAll().length;
				$('#log').append(' (R' + row + ',C' + col + ')'); // Log: indexes of the cell
				nothing2clear = false; // There is at least one cell that was cleared
			});
			$(this).find('.selected').closest('td').hide(1000, function(){$(this).remove();} ); // Second scan through the table: hide/fade-out then remove the cells
			
			if (nothing2clear) $('#log').append(' nothing to delete!');
			$('#log').append('<br />');
			//***********************************************************	
		}
	}); /*************************/ 


	
} /**************************************************************************************/



