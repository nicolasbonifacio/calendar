/*
@author: Nicolas Bonifacio

Creates a calendar that returns a date in one of three formats.
YYYY/MM/DD -> passing 1 as parameter to function createCalendar
DD/MM/YYYY -> passing 2 as parameter to function createCalendar
MM/DD/YYYY -> passing 3 as parameter to function createCalendar

*/

var calendario;
var tableDiv;
var lineDiv;
var columnDiv;
var yearDiv;
var monthDiv;
var fontDiv;

var isCalendarioOpen = false;
var isYearDivOpen = false;
var isMonthDivOpen = false;
var isPrevNextMonth = false;

//Column and row sizes
var DIV_WIDTH = "266px";
var DIV_HEIGTH_5_WEEKS = "235px"; //247
var DIV_HEIGTH_6_WEEKS = "271px"; //266

var BASE_COLUMN_WIDTH = "19px";
var MIN_ROW_HEIGHT = "1px";
var WEEK_ROW_HEIGHT = "19px";

var MONTH_COLUMN_WIDTH = "148px";//
var MONTH_COLUMN_HEIGHT = "30px";//
var YEAR_COLUMN_WIDTH = "111px";//
var YEAR_COLUMN_HEIGHT = "30px";//
var DAY_OF_WEEK_WIDTH = "35px";//
var DAY_OF_WEEK_HEIGHT = "19px";
var DAY_VALUE_WIDTH = "35px";//
var DAY_VALUE_HEIGHT = "35px";//
var MONTH_DIV_WIDTH = "100px";
var MONTH_DIV_HEIGHT = "200px";
var YEAR_DIV_WIDTH = "60px";
var YEAR_DIV_HEIGHT = "200px";
var MONTH_DIV_ITEM_WIDTH = "100px";
var MONTH_DIV_ITEM_HEIGHT = "20px";
var YEAR_DIV_ITEM_WIDTH = "60px";
var YEAR_DIV_ITEM_HEIGHT = "20px";

var DATE_FORMAT_1 = 1; // YYYY/MM/DD
var DATE_FORMAT_2 = 2; // DD/MM/YYYY
var DATE_FORMAT_3 = 3; // MM/DD/YYYY

var DISPLAY_MONTH_NAMES = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

//Cell colors
var DATE_FIELD_MASK_COLOR = "lightgrey"
var DATE_FIELD_DEFAULT_COLOR = "black"
var MAIN_DIV_BACKGROUND_COLOR = "white";
var CALENDAR_BACKGROUND_COLOR = "lightgrey";
var MONTH_BACKGROUND_COLOR = "darkgrey"
var YEAR_BACKGROUND_COLOR = "darkgrey"
var DAY_OF_WEEK_BACKGROUND_COLOR = "lightgrey";
var DAY_VALUE_BACKGROUND_COLOR = "white";
var SELECTED_DAY_VALUE_BACKGROUND_COLOR = "darkgrey";
var MONTH_DIV_BACKGROUND_COLOR = "white";
var YEAR_DIV_BACKGROUND_COLOR = "white";

var SUNDAY = "Sun";
var MONDAY = "Mon";
var TUESDAY = "Tue";
var WEDNESDAY = "Wed";
var THURSDAY = "Thu";
var FRIDAY = "Fri";
var SATURDAY = "Sat";

var YEAR_MIN = "1900";
var YEAR_MAX = "2100"

var FONT_CALENDARIO_FACE = "consolas";
var FONT_MONTH_CALENDARIO_SIZE = "4";
var FONT_YEAR_CALENDARIO_SIZE = "4";
var FONT_PREV_NEXT_MONTH_YEAR_SIZE = "3";
var FONT_WEEK_DAYS_SIZE = "2";
var FONT_DAYS_SIZE = "3";
var FONT_MONTH_DIV_SIZE = "3";
var FONT_YEAR_DIV_SIZE = "3";

var selectedYear;
var selectedMonth;
var selectedDay;
var selectedDate = "";

var baseYear;
var baseMonth;
var baseDay;
var baseDayOfWeekFirstDay;
var totalMonthDays;

var tempDateFormat;
var totalLineDays = 0;
var isReload = 0;

var isFirstFieldWrong = false;

function createCalendar(dateFormat) {			
	tempDateFormat = dateFormat;
	
	if(isCalendarioOpen) {		
		hideCalendar();
		
	}else {
		
		if(selectedDateField.value.length > 0 && selectedDateField.value.length < 10) {
			alert("Invalid date");
			return;
		}
		
		if(isReload == 0) {
			selectedDate = selectedDateField.value;
		}
		
		if((isNaN(selectedDateField.value.substr(0, 4)) && dateFormat == DATE_FORMAT_1) ||
			(isNaN(selectedDateField.value.substr(0, 2)) && dateFormat == DATE_FORMAT_2) ||
			(isNaN(selectedDateField.value.substr(0, 2)) && dateFormat == DATE_FORMAT_3)) {
				
				selectedDate = "";	
				selectedDateField.value = "";
				selectedDateField.setAttribute("style", "color:"+DATE_FIELD_DEFAULT_COLOR);				
			}
			
		getBaseDate(dateFormat);
					
		calendario = document.createElement("div");
		calendario.setAttribute("id", "calendarDiv");
		calendario.setAttribute("style", "background-color:"+MAIN_DIV_BACKGROUND_COLOR+"; width:"+DIV_WIDTH+"; height:"+DIV_HEIGTH_5_WEEKS+"; position:absolute");
		document.getElementById("calendarPosition").appendChild(calendario);
		
		tableDiv = document.createElement("table");	
		tableDiv.setAttribute("cellspacing", "1px");
		tableDiv.setAttribute("id", "tableDivId");
		tableDiv.setAttribute("style", "background-color:"+CALENDAR_BACKGROUND_COLOR+"; border:1px solid lightgrey");

		//Columns to define the table structure
		lineDiv = document.createElement("tr");
		for(var i=0; i<14; i++) {
			columnDiv = document.createElement("td");
			columnDiv.setAttribute("id", "baseColumn"+i);			
			columnDiv.setAttribute("width", BASE_COLUMN_WIDTH);
			columnDiv.setAttribute("height", MIN_ROW_HEIGHT);
			lineDiv.appendChild(columnDiv);
			tableDiv.appendChild(lineDiv);	
		}
				
		//Line for 'month' and 'year' columns
		lineDiv = document.createElement("tr");
		lineDiv.setAttribute("id", "lineMonthYear");
		
		//Prev month column
		columnDiv = document.createElement("td");				
		columnDiv.setAttribute("id", "prevMonth");
		columnDiv.setAttribute("onclick", "showPrevMonth();");
		columnDiv.setAttribute("style", "cursor: hand; background-color:"+MONTH_BACKGROUND_COLOR+";");		
		columnDiv.setAttribute("align", "center");

		fontDiv = document.createElement("font");
		fontDiv.setAttribute("size", FONT_PREV_NEXT_MONTH_YEAR_SIZE);
		fontDiv.setAttribute("face", FONT_CALENDARIO_FACE);
		columnDiv.appendChild(fontDiv);
		
		var prevMonth = document.createTextNode("<");	
		fontDiv.appendChild(prevMonth);

		lineDiv.appendChild(columnDiv);
		
		//month column
		columnDiv = document.createElement("td");				
		columnDiv.setAttribute("id", "columnMonth");
		columnDiv.setAttribute("onclick", "showMonths();");
		columnDiv.setAttribute("style", "cursor: hand; background-color:"+MONTH_BACKGROUND_COLOR+";");
		columnDiv.setAttribute("width", MONTH_COLUMN_WIDTH);
		columnDiv.setAttribute("height", MONTH_COLUMN_HEIGHT);
		columnDiv.setAttribute("align", "center");
		columnDiv.setAttribute("colspan", "6");	
		
		fontDiv = document.createElement("font");
		fontDiv.setAttribute("size", FONT_MONTH_CALENDARIO_SIZE);
		fontDiv.setAttribute("face", FONT_CALENDARIO_FACE);
		columnDiv.appendChild(fontDiv);
				
		var month = document.createTextNode(DISPLAY_MONTH_NAMES[baseMonth-1]);	
		fontDiv.appendChild(month);

		lineDiv.appendChild(columnDiv);
		
		//Next month column
		columnDiv = document.createElement("td");				
		columnDiv.setAttribute("id", "nextMonth");
		columnDiv.setAttribute("onclick", "showNextMonth();");
		columnDiv.setAttribute("style", "cursor: hand; background-color:"+MONTH_BACKGROUND_COLOR+";");		
		columnDiv.setAttribute("align", "center");	

		fontDiv = document.createElement("font");
		fontDiv.setAttribute("size", FONT_PREV_NEXT_MONTH_YEAR_SIZE);
		fontDiv.setAttribute("face", FONT_CALENDARIO_FACE);
		columnDiv.appendChild(fontDiv);		
		
		var nextMonth = document.createTextNode(">");	
		fontDiv.appendChild(nextMonth);

		lineDiv.appendChild(columnDiv);
		
		//Prev year column
		columnDiv = document.createElement("td");				
		columnDiv.setAttribute("id", "prevYear");
		columnDiv.setAttribute("onclick", "showPrevYear();");
		columnDiv.setAttribute("style", "cursor: hand; background-color:"+MONTH_BACKGROUND_COLOR+";");		
		columnDiv.setAttribute("align", "center");

		fontDiv = document.createElement("font");
		fontDiv.setAttribute("size", FONT_PREV_NEXT_MONTH_YEAR_SIZE);
		fontDiv.setAttribute("face", FONT_CALENDARIO_FACE);
		columnDiv.appendChild(fontDiv);				
		
		var prevYear = document.createTextNode("<");	
		fontDiv.appendChild(prevYear);

		lineDiv.appendChild(columnDiv);
		
		//year column
		columnDiv = document.createElement("td");
		columnDiv.setAttribute("id", "columnYear");
		columnDiv.setAttribute("onclick", "showYears();");
		columnDiv.setAttribute("style", "cursor: hand; background-color:"+YEAR_BACKGROUND_COLOR+";");		
		columnDiv.setAttribute("align", "center");
		columnDiv.setAttribute("colspan", "4");	

		fontDiv = document.createElement("font");
		fontDiv.setAttribute("size", FONT_YEAR_CALENDARIO_SIZE);
		fontDiv.setAttribute("face", FONT_CALENDARIO_FACE);
		columnDiv.appendChild(fontDiv);		
		
		var year = document.createTextNode(baseYear);	
		fontDiv.appendChild(year);
		
		lineDiv.appendChild(columnDiv);
		
		//Next year column
		columnDiv = document.createElement("td");				
		columnDiv.setAttribute("id", "nextYear");
		columnDiv.setAttribute("onclick", "showNextYear();");
		columnDiv.setAttribute("style", "cursor: hand; background-color:"+MONTH_BACKGROUND_COLOR+";");		
		columnDiv.setAttribute("align", "center");	

		fontDiv = document.createElement("font");
		fontDiv.setAttribute("size", FONT_PREV_NEXT_MONTH_YEAR_SIZE);
		fontDiv.setAttribute("face", FONT_CALENDARIO_FACE);
		columnDiv.appendChild(fontDiv);			
		
		var nextYear = document.createTextNode(">");	
		fontDiv.appendChild(nextYear);

		lineDiv.appendChild(columnDiv);

		//Insert line in table
		tableDiv.appendChild(lineDiv);	

		
		//Days of the week
		lineDiv = document.createElement("tr");
		lineDiv.setAttribute("id", "line_days_week");
				
		var day_of_week_display;
		var daysOfWeekArray = new Array();
		daysOfWeekArray[0] = SUNDAY;
		daysOfWeekArray[1] = MONDAY;
		daysOfWeekArray[2] = TUESDAY;
		daysOfWeekArray[3] = WEDNESDAY;
		daysOfWeekArray[4] = THURSDAY;
		daysOfWeekArray[5] = FRIDAY;
		daysOfWeekArray[6] = SATURDAY;
		for(var i=0; i<daysOfWeekArray.length; i++) {
			columnDiv = document.createElement("td");				
			columnDiv.setAttribute("id", "column_"+daysOfWeekArray[i]);		
			columnDiv.setAttribute("style", "background-color:"+DAY_OF_WEEK_BACKGROUND_COLOR+";");			
			columnDiv.setAttribute("height", DAY_OF_WEEK_HEIGHT);
			columnDiv.setAttribute("align", "center");
			columnDiv.setAttribute("colspan", "2");

			fontDiv = document.createElement("font");
			fontDiv.setAttribute("size", FONT_WEEK_DAYS_SIZE);
			fontDiv.setAttribute("face", FONT_CALENDARIO_FACE);
			columnDiv.appendChild(fontDiv);		
			
			day_of_week_display = document.createTextNode(daysOfWeekArray[i]);
			fontDiv.appendChild(day_of_week_display);
			lineDiv.appendChild(columnDiv);
		}
		tableDiv.appendChild(lineDiv);	
	
		//Calendar days
		displayDaysInCalendar(dateFormat);

		if(isReload == 1) {
			isReload = 0;
		}
		
		isCalendarioOpen = true;	
	}
	
}

function getBaseDate(dateFormat) {
	//Splits the date into year, month and day
	
	if(selectedDate == "") {
		
		selectedDate = new Date();
		
		baseYear = selectedDate.getFullYear();
		baseMonth = selectedDate.getMonth();
		baseMonth++;
		baseDay = selectedDate.getDate();
		
	}else {
		
		var dateArray = new Array();
		dateArray = selectedDate.split("/");
		if(dateFormat == DATE_FORMAT_1) {
			// YYYY/MM/DD			
			baseYear = dateArray[0];
			baseMonth = dateArray[1];			
			baseDay = dateArray[2];
			
		}else if(dateFormat == DATE_FORMAT_2) {
			// DD/MM/YYYY
			baseYear = dateArray[2];
			baseMonth = dateArray[1];			
			baseDay = dateArray[0];			
			
		}else if(dateFormat == DATE_FORMAT_3) {
			// MM/DD/YYYY
			baseYear = dateArray[2];
			baseMonth = dateArray[0];			
			baseDay = dateArray[1];
			
		}
	}
	
	var tempDate = new Date(baseYear, (baseMonth-1), 1);
		baseDayOfWeekFirstDay = tempDate.getDay();
	
	//get total number of days in month
	if(baseMonth == 1 || baseMonth == 3 || baseMonth == 5 || baseMonth == 7 || baseMonth == 8 || baseMonth == 10 || baseMonth == 12) {
		totalMonthDays = 31;
	}else if(baseMonth == 2) {		
		if(((baseYear - 1952) % 4) ==  0) {
			totalMonthDays = 29;			
		}else {
			totalMonthDays = 28;
		}	
	}else {
		totalMonthDays = 30;
	}	
	
}


function displayDaysInCalendar(dateFormat) {
	//Creates the sctructure to display the days in the calendar
	totalLineDays = 0;
	var tempDay = 1;
	
	var week = new Array(0, 0, 0, 0, 0, 0, 0);
	for(var i=baseDayOfWeekFirstDay; i<7; i++) {
		week[i] = tempDay;
		tempDay++;
	}
	//Insert week in table

	lineDiv = document.createElement("tr");
	totalLineDays++;
	lineDiv.setAttribute("id", "lineDays1");	
	var displayDay;
	for(var i=0; i<7; i++) {
		columnDiv = document.createElement("td");										
		columnDiv.setAttribute("width", DAY_VALUE_WIDTH);
		columnDiv.setAttribute("height", DAY_VALUE_HEIGHT);
		columnDiv.setAttribute("align", "center");
		columnDiv.setAttribute("colspan", "2");
		
		fontDiv = document.createElement("font");
		fontDiv.setAttribute("size", FONT_DAYS_SIZE);
		fontDiv.setAttribute("face", FONT_CALENDARIO_FACE);
		columnDiv.appendChild(fontDiv);	
		
		if(week[i] == 0) {
			displayDay = document.createTextNode("");
			columnDiv.setAttribute("style", "background-color:"+DAY_VALUE_BACKGROUND_COLOR+";");
		}else {
			displayDay = document.createTextNode(week[i]);
			columnDiv.setAttribute("onclick", "setDay("+week[i]+", "+dateFormat+");");
			if(week[i] == baseDay) {
				columnDiv.setAttribute("style", "cursor: hand; background-color:"+SELECTED_DAY_VALUE_BACKGROUND_COLOR+";");
			}else {
				columnDiv.setAttribute("style", "cursor: hand; background-color:"+DAY_VALUE_BACKGROUND_COLOR+";");
			}
		}		
		fontDiv.appendChild(displayDay);
		lineDiv.appendChild(columnDiv);
	}
	tableDiv.appendChild(lineDiv);	
	
	var qtdWeeksLeft = (totalMonthDays - (tempDay-1)) / 7;	
	qtdWeeksLeft = Math.ceil(qtdWeeksLeft);
	if(qtdWeeksLeft == 5) {
		calendario.setAttribute("style", "background-color:"+CALENDAR_BACKGROUND_COLOR+"; width:"+DIV_WIDTH+"; height:"+DIV_HEIGTH_6_WEEKS+"; position:absolute; border:1px solid lightgrey");
	}
	
	for(var i=0; i<qtdWeeksLeft; i++) {
		week = new Array(0, 0, 0, 0, 0, 0, 0);
		for(var j=0; j<7; j++) {
			if(tempDay <= totalMonthDays) {
				week[j] = tempDay;
				tempDay++;
			}	
		}
		//Insert week in table
		lineDiv = document.createElement("tr");		
		totalLineDays++;
		lineDiv.setAttribute("id", "lineDays"+totalLineDays+"");	
		for(var x=0; x<7; x++) {
			columnDiv = document.createElement("td");										
			columnDiv.setAttribute("width", DAY_VALUE_WIDTH);
			columnDiv.setAttribute("height", DAY_VALUE_HEIGHT);
			columnDiv.setAttribute("align", "center");
			columnDiv.setAttribute("colspan", "2");
			
			fontDiv = document.createElement("font");
			fontDiv.setAttribute("size", FONT_DAYS_SIZE);
			fontDiv.setAttribute("face", FONT_CALENDARIO_FACE);
			columnDiv.appendChild(fontDiv);	
		
			if(week[x] == 0) {
				displayDay = document.createTextNode("");
				columnDiv.setAttribute("style", "background-color:"+DAY_VALUE_BACKGROUND_COLOR+";");
			}else {
				displayDay = document.createTextNode(week[x]);
				columnDiv.setAttribute("onclick", "setDay("+week[x]+", "+dateFormat+");");
				if(week[x] == baseDay) {
				columnDiv.setAttribute("style", "cursor: hand; background-color:"+SELECTED_DAY_VALUE_BACKGROUND_COLOR+";");
				}else {
					columnDiv.setAttribute("style", "cursor: hand; background-color:"+DAY_VALUE_BACKGROUND_COLOR+";");
				}
			}		
			fontDiv.appendChild(displayDay);
			lineDiv.appendChild(columnDiv);
		}
		tableDiv.appendChild(lineDiv);	
	}
	
	calendario.appendChild(tableDiv);		
	calendarPosition.appendChild(calendario);
}

function setDay(day, dateFormat) {	

	if(isYearDivOpen) {
		isYearDivOpen = false;
		hideYearDiv();
	}else if(isMonthDivOpen) {
		isMonthDivOpen = false;
		hideMonthDiv();
	}else {

		var returnYear = baseYear;
		var returnMonth = baseMonth;
		var returnDay = day;
		
		
		if((""+returnDay+"").length == 1) {
			returnDay = "0" + returnDay;
		}
		if((""+returnMonth+"").length == 1) {
			returnMonth = "0" + returnMonth;
		}
		
		
		if(dateFormat == DATE_FORMAT_1) {
			// YYYY/MM/DD
			selectedDateField.value = returnYear + "/" + returnMonth + "/" + returnDay;		
				
		}else if(dateFormat == DATE_FORMAT_2) {
			// DD/MM/YYYY
			selectedDateField.value = returnDay + "/" + returnMonth + "/" + returnYear;
			
		}else if(dateFormat == DATE_FORMAT_3) {
			// MM/DD/YYYY
			selectedDateField.value = returnMonth + "/" + returnDay + "/" + returnYear;
			
		}
		
		hideCalendar();
	
	}
	
}

function showMonths() {
		
	if(isYearDivOpen) {
		isYearDivOpen = false;
		hideYearDiv();
	}
	if(isMonthDivOpen) {
		isMonthDivOpen = false;
		hideMonthDiv();
	}else {
	
		isMonthDivOpen = true;
	
		monthDiv = document.createElement("div");
		monthDiv.setAttribute("id", "monthDivField");
		monthDiv.setAttribute("style", "background-color:"+MONTH_DIV_BACKGROUND_COLOR+"; width:"+MONTH_DIV_WIDTH+"; height:"+MONTH_DIV_HEIGHT+"; position:absolute; border:1px solid lightgrey; overflow:auto");	
		
		
			tableDiv = document.createElement("table");	
			tableDiv.setAttribute("cellspacing", "1px");
			
			for(var i=0; i<DISPLAY_MONTH_NAMES.length; i++) {
				
					lineDiv = document.createElement("tr");		
					
					columnDiv = document.createElement("td");		
					//month column attributes			
					columnDiv.setAttribute("onclick", "selectMonthDiv("+i+");");
					columnDiv.setAttribute("style", "cursor: hand; background-color:"+MONTH_DIV_BACKGROUND_COLOR+";");
					columnDiv.setAttribute("width", MONTH_DIV_ITEM_WIDTH);
					columnDiv.setAttribute("height", MONTH_DIV_ITEM_HEIGHT);
					columnDiv.setAttribute("align", "left");

					fontDiv = document.createElement("font");
					fontDiv.setAttribute("size", FONT_MONTH_DIV_SIZE);
					fontDiv.setAttribute("face", FONT_CALENDARIO_FACE);
					columnDiv.appendChild(fontDiv);	
					
					fontDiv.appendChild(document.createTextNode(DISPLAY_MONTH_NAMES[i]));
					lineDiv.appendChild(columnDiv);
					tableDiv.appendChild(lineDiv);
					
				
			}

			monthDiv.appendChild(tableDiv);
		
		document.getElementById("baseColumn1").appendChild(monthDiv);
	
	}

}

function showYears() {
		
	if(isMonthDivOpen) {
		isMonthDivOpen = false;
		hideMonthDiv();
	}
	if(isYearDivOpen) {
		isYearDivOpen = false;
		hideYearDiv();
	}else {
		
		isYearDivOpen = true;
		
		yearDiv = document.createElement("div");
		yearDiv.setAttribute("id", "yearDivField");
		yearDiv.setAttribute("style", "background-color:"+YEAR_DIV_BACKGROUND_COLOR+"; width:"+YEAR_DIV_WIDTH+"; height:"+YEAR_DIV_HEIGHT+"; position:absolute; border:1px solid lightgrey; overflow:auto");

		tableDiv = document.createElement("table");	
		tableDiv.setAttribute("cellspacing", "1px");	
		var currYear = YEAR_MIN;
		for(var i=0; i<=(YEAR_MAX-YEAR_MIN); i++) {
			if(currYear <= YEAR_MAX) {
				lineDiv = document.createElement("tr");						
		
				columnDiv = document.createElement("td");				
				//year column attributes	
				columnDiv.setAttribute("id", "columnYearDiv"+currYear);				
				columnDiv.setAttribute("onclick", "selectYearDiv("+currYear+");");
				columnDiv.setAttribute("style", "cursor: hand; background-color:"+YEAR_DIV_BACKGROUND_COLOR+";");
				columnDiv.setAttribute("width", YEAR_DIV_ITEM_WIDTH);
				columnDiv.setAttribute("height", YEAR_DIV_ITEM_HEIGHT);
				columnDiv.setAttribute("align", "left");

				fontDiv = document.createElement("font");
				fontDiv.setAttribute("size", FONT_YEAR_DIV_SIZE);
				fontDiv.setAttribute("face", FONT_CALENDARIO_FACE);
				columnDiv.appendChild(fontDiv);	
				
				fontDiv.appendChild(document.createTextNode(currYear));
								
				lineDiv.appendChild(columnDiv);
				tableDiv.appendChild(lineDiv);
				currYear++;
			}
		}

		yearDiv.appendChild(tableDiv);
		
		document.getElementById("baseColumn9").appendChild(yearDiv);	
		
		var yearToFocus = document.getElementById("columnYearDiv"+baseYear);
		yearToFocus.scrollIntoView();
	
	}
}



function hideCalendar() {
	if(isYearDivOpen) {
		isYearDivOpen = false;
		hideYearDiv();
	}
	if(isMonthDivOpen) {
		isMonthDivOpen = false;
		hideMonthDiv();
	}
	
	document.getElementById("calendarPosition").removeChild(document.getElementById("calendarDiv"));
	if(isCalendarioOpen) {
		isCalendarioOpen = false;
	}
}

function showPrevMonth() {	
	var currMonth = parseInt(baseMonth) - 2;	
	if(currMonth < 0) {
		currMonth = 11;
		baseYear--;
	}
	isPrevNextMonth = true;
	selectMonthDiv(currMonth);
	
}

function showNextMonth() {	
	var currMonth = parseInt(baseMonth);
	if(currMonth > 11) {
		currMonth = 0;
		baseYear++;
	}
	isPrevNextMonth = true;
	selectMonthDiv(currMonth);
}

function selectMonthDiv(currMonth) {	

	baseMonth = parseInt(currMonth) + 1;	
	isReload = 1;
	isCalendarioOpen = false;
	
	if(!isPrevNextMonth) {
		isPrevNextMonth = false;
		hideMonthDiv();	
	}
		
	if(tempDateFormat == DATE_FORMAT_1) {
		// YYYY/MM/DD	
		selectedDate = baseYear + "/" + baseMonth + "/" + baseDay;
				
	}else if(tempDateFormat == DATE_FORMAT_2) {
		// DD/MM/YYYY
		selectedDate = baseDay + "/" + baseMonth + "/" + baseYear;		
		
	}else if(tempDateFormat == DATE_FORMAT_3) {
		// MM/DD/YYYY
		selectedDate = baseMonth + "/" + baseDay + "/" + baseYear;		
		
	}

	hideCalendar();
	
	createCalendar(tempDateFormat);
}

function showPrevYear() {	
	var currYear = parseInt(baseYear) - 1;	
	if(currYear < YEAR_MIN) {
		currYear++;
	}
	isPrevNextMonth = true;
	selectYearDiv(currYear);
}

function showNextYear() {	
	var currYear = parseInt(baseYear) + 1;	
	if(currYear > YEAR_MAX) {
		currYear--;
	}	
	isPrevNextMonth = true;
	selectYearDiv(currYear);
}

function selectYearDiv(currYear) {
	
	baseYear = parseInt(currYear);
	isReload = 1;
	isCalendarioOpen = false;	
	
	if(!isPrevNextMonth) {
		isPrevNextMonth = false;
		hideYearDiv();	
	}
	
	if(tempDateFormat == DATE_FORMAT_1) {
		// YYYY/MM/DD	
		selectedDate = baseYear + "/" + baseMonth + "/" + baseDay;
				
	}else if(tempDateFormat == DATE_FORMAT_2) {
		// DD/MM/YYYY
		selectedDate = baseDay + "/" + baseMonth + "/" + baseYear;		
		
	}else if(tempDateFormat == DATE_FORMAT_3) {
		// MM/DD/YYYY
		selectedDate = baseMonth + "/" + baseDay + "/" + baseYear;		
		
	}
	
	hideCalendar();
	
	createCalendar(tempDateFormat);
	
	
}

function hideMonthDiv() {
	isMonthDivOpen = false;
	document.getElementById("baseColumn1").removeChild(monthDiv);
}

function hideYearDiv() {
	isYearDivOpen = false;
	document.getElementById("baseColumn9").removeChild(yearDiv);
}

function validateDateInput(tempDateFormat) {
	
	selectedDateField.setAttribute("style", "color:"+DATE_FIELD_DEFAULT_COLOR);
	
	var lastDigit = selectedDateField.value.substr(selectedDateField.value.length-1);

	if((isNaN(lastDigit) || lastDigit == " " || selectedDateField.value.length > 10)) {
		selectedDateField.value = selectedDateField.value.substr(0, selectedDateField.value.length-1);
		return;
	}
	//alert(selectedDateField.value.length);
	if(event.keyCode != 8) {				
	
		if(tempDateFormat == DATE_FORMAT_1) {
			// YYYY/MM/DD
			if(selectedDateField.value.length == 4 && 
						(parseInt(selectedDateField.value) < YEAR_MIN || 
						parseInt(selectedDateField.value) > YEAR_MAX)) {
							
				selectedDateField.value = "";		
				isFirstFieldWrong = true;				
				alert("The year range is from " + YEAR_MIN + " to " + YEAR_MAX);
			}
			
			if(selectedDateField.value.length == 7 &&
						(selectedDateField.value.substr(5, 6) > 12 || selectedDateField.value.substr(5, 6) == 0)) {				
				selectedDateField.value = selectedDateField.value.substr(0, 4)
				alert("Invalid month");
			}
			
			if(selectedDateField.value.length == 4 || selectedDateField.value.length == 7) {
				selectedDateField.value = selectedDateField.value + "/";
			}
			
			if((selectedDateField.value.length == 5 || selectedDateField.value.length == 8) &&
						selectedDateField.value.substr(selectedDateField.value.length-1) != "/") {
				var tempStr = selectedDateField.value.substr(0, selectedDateField.value.length-1);
				var tempStr2 = selectedDateField.value.substr(selectedDateField.value.length-1);
				selectedDateField.value = tempStr + "/" + tempStr2;
			}
			
			if(selectedDateField.value.length == 10 && 
						(selectedDateField.value.substr(selectedDateField.value.length-2) > 31 ||
						selectedDateField.value.substr(selectedDateField.value.length-2) == 0)) {
				selectedDateField.value = selectedDateField.value.substr(0, 8);
				alert("Invalid day");
			}
			
			
			
			
		}else if(tempDateFormat == DATE_FORMAT_2) {
			// DD/MM/YYYY
			if(selectedDateField.value.length == 2 && 
						(selectedDateField.value == 0) || selectedDateField.value > 31) {
							
				selectedDateField.value = "";
				isFirstFieldWrong = true;
				alert("Invalid day");
			}
			
			if(selectedDateField.value.length == 5 &&
						(selectedDateField.value.substr(3, 4) > 12 || selectedDateField.value.substr(3, 4) == 0)) {				
				selectedDateField.value = selectedDateField.value.substr(0, 2)
				alert("Invalid month");
			}

			if((selectedDateField.value.length == 3 || selectedDateField.value.length == 6) &&
						selectedDateField.value.substr(selectedDateField.value.length-1) != "/") {
				var tempStr = selectedDateField.value.substr(0, selectedDateField.value.length-1);
				var tempStr2 = selectedDateField.value.substr(selectedDateField.value.length-1);
				selectedDateField.value = tempStr + "/" + tempStr2;
			}
			
			if(selectedDateField.value.length == 2 || selectedDateField.value.length == 5) {
				selectedDateField.value = selectedDateField.value + "/";
			}
			
			if(selectedDateField.value.length == 10 && 
						(selectedDateField.value.substr(parseInt(selectedDateField.value.length-4)) < YEAR_MIN ||
						selectedDateField.value.substr(parseInt(selectedDateField.value.length-4)) > YEAR_MAX)) {
				selectedDateField.value = selectedDateField.value.substr(0, 6);
				alert("The year range is from " + YEAR_MIN + " to " + YEAR_MAX);
			}

		}else if(tempDateFormat == DATE_FORMAT_3) {
			// MM/DD/YYYY
			isFirstFieldWrong = true;
			if(selectedDateField.value.length == 2 && 
						(selectedDateField.value == 0) || selectedDateField.value > 12) {
							
				selectedDateField.value = "";
				alert("Invalid month");
			}
			
			if(selectedDateField.value.length == 5 &&
						(selectedDateField.value.substr(3, 4) > 31 || selectedDateField.value.substr(3, 4) == 0)) {				
				selectedDateField.value = selectedDateField.value.substr(0, 2)
				alert("Invalid day");
			}

			if((selectedDateField.value.length == 3 || selectedDateField.value.length == 6) &&
						selectedDateField.value.substr(selectedDateField.value.length-1) != "/") {
				var tempStr = selectedDateField.value.substr(0, selectedDateField.value.length-1);
				var tempStr2 = selectedDateField.value.substr(selectedDateField.value.length-1);
				selectedDateField.value = tempStr + "/" + tempStr2;
			}
			
			if(selectedDateField.value.length == 2 || selectedDateField.value.length == 5) {
				selectedDateField.value = selectedDateField.value + "/";
			}
			
			if(selectedDateField.value.length == 10 && 
						(selectedDateField.value.substr(parseInt(selectedDateField.value.length-4)) < YEAR_MIN ||
						selectedDateField.value.substr(parseInt(selectedDateField.value.length-4)) > YEAR_MAX)) {
				selectedDateField.value = selectedDateField.value.substr(0, 6);
				alert("The year range is from " + YEAR_MIN + " to " + YEAR_MAX);
			}			
			
		}
	
	}
	
	if(event.keyCode == 13 && selectedDateField.value.length == 10) {		
		createCalendar(tempDateFormat);
	}

}

function createMask(formatDate, showMask) {

	if(showMask && selectedDateField.value.length == 0 && !isFirstFieldWrong) {
		
		selectedDateField.setAttribute("style", "color:"+DATE_FIELD_MASK_COLOR);
		
		if(formatDate == 1) {
			selectedDateField.value = "yyyy/mm/dd";
		}else if(formatDate == 2) {
			selectedDateField.value = "dd/mm/yyyy";
		}else if(formatDate == 3) {
			selectedDateField.value = "mm/dd/yyyy";
		}
		
	}else if(!showMask && (selectedDateField.value.length == 0 || isNaN(selectedDateField.value))) {
		selectedDateField.value = "";
	}
	
	if(isFirstFieldWrong) {
		isFirstFieldWrong = false;
	}
	
}
