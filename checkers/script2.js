// set up board as an empty array that exists globally
var board = [];
// other variables that should exist globally
var pturn, waitingfor, oldspot, newspot, lastcell, score, gameover;

// function that will be called on page load to set up the board and some variables
function setuptwoplayer(){
	setupboard();
	printboard()
	// variable to keep track of what should be clicked on next
	waitingfor = "old";
	// randomly decide whether player 1 or player two goes first
	let tempturn = Math.floor(Math.random()*2);
	if(tempturn==0){
		pturn = "⚫";
	}
	else{
		pturn = "🔴";
		document.getElementById("text1").innerHTML = "🔴Player Two's Turn🔴";
	}
	// first score is player one, second is player two 
	score = [12,12];
	// gameover is false until someone wins
	gameover = false;
}

// function that will turn board into 2d array, put black and white pieces in designated starting spots, and s]display where pieces start on html table
function setupboard(){
	// variable to keep track of which table element is being checked
	let tempId = 1;
	// for loop to add rows
	for(var i = 0; i < 8; i ++){
		board.push([]);
		// for loop to add columns
		for(var j = 0; j < 8; j++){
			// add black pieces
			if(i%2==j%2 && i<3 ){
				board[i].push("⚫");
			}
			// add white pieces
			else if(i%2==j%2 && i>4){
				board[i].push("🔴");
			}
			// add empty spaces
			else{
				board[i].push("  ");
			}
			// update html table
			tempId = String(tempId);
			document.getElementById(tempId).innerHTML = board[i][j];
			tempId = parseInt(tempId);
			tempId ++;
		}
	}
}

// function to print board array in console for testing, and to update table in html
function printboard(){
	// check for kings before updating
	heart();
	// variable to keep track of which table element is being checked
	let tempId = 1;
	// for loop to go through rows
	for(var i = 0; i < board.length; i ++){
		let row = "";
		row += i+1 + ": "
		// for loop to go through columns
		for(var j = 0; j < board[i].length; j++){
			row += board[i][j];
			// update html table
			tempId = String(tempId);
			document.getElementById(tempId).innerHTML = board[i][j];
			tempId = parseInt(tempId);
			tempId ++;
		}
		// print current row
		// console.log(row);
	}
}

// function to turn pieces that reach the opposite side of board into kings
function heart(){
	// loop through one row of board
	for(var i=0;i<board[0].length;i++){
		// check if player 2 reached the top
		if(board[0][i]=="🔴"){
			board[0][i]="❤️";
		}
		// check if player 1 reached the bottom
		if(board[board.length-1][i]=="⚫"){
			board[board.length-1][i]="🖤";
		}
	}
}

// function to check if the last move made is a valid jump over opponents piece
function jumpmove(oldspot,newspot){
	// check if player 1 king piece tried to move 2 spots
	if(pturn == "⚫" && board[oldspot[0]][oldspot[1]]=="🖤" && Math.abs(oldspot[0]-newspot[0])==2 && Math.abs(oldspot[1]-newspot[1])==2){
		let tempcol = parseInt((oldspot[1] + newspot[1])/2);
		let temprow = parseInt((oldspot[0] + newspot[0])/2);
		// check if player 1 jumped over opponents piece
		if(board[temprow][tempcol]=="🔴" || board[temprow][tempcol]=="❤️"){
			// player 2 score goes down once and loses a piece
			score[1]-=1;
			board[temprow][tempcol]="  "
			// return true if valid
			return true;
		}
	}
	// check if player 1 normal piece tried to move 2 spots
	else if(pturn == "⚫" && oldspot[0]+2==newspot[0] && Math.abs(oldspot[1]-newspot[1])==2){
		let tempcol = parseInt((oldspot[1] + newspot[1])/2);
		// check if player 1 jumped over opponents piece
		if(board[oldspot[0]+1][tempcol]=="🔴" || board[temprow][tempcol]=="❤️"){
			// player 2 score goes down once and loses a piece
			score[1]-=1;
			board[oldspot[0]+1][tempcol]="  "
			// return true if valid
			return true;
		}
	}
	// check if player 2 king piece tried to move 2 spots
	else if(pturn == "🔴" && board[oldspot[0]][oldspot[1]]=="❤️" && Math.abs(oldspot[0]-newspot[0])==2 && Math.abs(oldspot[1]-newspot[1])==2){
		let tempcol = parseInt((oldspot[1] + newspot[1])/2);
		let temprow = parseInt((oldspot[0] + newspot[0])/2);
		// check if player 1 jumped over opponents piece
		if(board[temprow][tempcol]=="⚫" || board[temprow][tempcol]=="🖤"){
			// player 2 score goes down once and loses a piece
			score[0]-=1;
			board[temprow][tempcol]="  "
			// return true if valid
			return true;
		}
	}
	// check if player 2 normal piece tried to move 2 spots
	else if(pturn == "🔴" && oldspot[0]-2==newspot[0] && Math.abs(oldspot[1]-newspot[1])==2){
		let tempcol = parseInt((oldspot[1] + newspot[1])/2);
		// check if player 2 jumped over opponents piece
		if(board[oldspot[0]-1][tempcol]=="⚫" || board[temprow][tempcol]=="🖤"){
			// player 1 score goes down once and loses a piece
			score[0]-=1;
			board[oldspot[0]-1][tempcol]="  "
			// return true if valid
			return true;
		}
	}
	// return false if not valid
	return false;
}

// function to move pieces when valid, and change table style when not
function validmove(cell, lastcell){
	// variable to store what row was last clicked on
	const row = cell.parentElement;
	// check if the turn is to move a king piece
	let redheartcheck= pturn=="🔴" && cell.innerHTML=="❤️";
	let blackheartcheck= pturn=="⚫" && cell.innerHTML=="🖤";
	// check if turn matches and its expecting first click
	if ( (pturn==cell.innerHTML || redheartcheck || blackheartcheck) && waitingfor=="old"){
		// store info of piece clicked on
		oldspot = [row.rowIndex, cell.cellIndex];
		waitingfor="new";
		// background color turns red temporarily
		document.getElementById(cell.id).style="background-color:yellowgreen;";
		// update last cell to be current cell
		lastcell = cell;
	}
	// check if player clicks on same spot twice
	else if (waitingfor=="new" && cell == lastcell){
		// undoes the red background and resets turn
		waitingfor = "old";
		document.getElementById(lastcell.id).style+="background-color:burlywood;";
		lastcell = null;
	}
	// check if player is trying to move to a valid spot
	else if (waitingfor=="new" && cell.innerHTML == "  " && cell.className=="odd"){
		// stores info of new spot to move to 
		newspot = [row.rowIndex, cell.cellIndex];
		// calls function to see if current player did a valid jump over opponents piece
		let jumped = jumpmove(oldspot,newspot);
		// check if trying to move a king piece
		let redheartcheck= pturn=="🔴" && lastcell.innerHTML=="❤️";
		let blackheartcheck= pturn=="⚫" && lastcell.innerHTML=="🖤";
		// first check if its player 1 turn and king piece, then if normal move is made in the right direction OR if jump was made
		if(blackheartcheck && ( Math.abs(oldspot[1]-newspot[1])==1 || jumped )){
			waitingfor="old";
			// move player 1 piece in array
			board[oldspot[0]][oldspot[1]] = "  ";
			board[newspot[0]][newspot[1]] = "🖤";
			// switch turn to player 2
			pturn = "🔴";
			// change backround of table and text in html
			document.getElementById(lastcell.id).style+="background-color:burlywood;";
			document.getElementById("text1").innerHTML = "🔴Player Two's Turn🔴";
		}
		// first check if its player 2 turn and king piece, then if normal move is made in the right direction OR if jump was made
		else if(redheartcheck && ( Math.abs(oldspot[1]-newspot[1])==1 || jumped )){
			waitingfor="old";
			// move player 1 piece in array
			board[oldspot[0]][oldspot[1]] = "  ";
			board[newspot[0]][newspot[1]] = "❤️";
			// switch turn to player 2
			pturn = "⚫";
			// change backround of table and text in html
			document.getElementById(lastcell.id).style+="background-color:burlywood;";
			document.getElementById("text1").innerHTML = "⚫Player One's Turn⚫";
		}
		// first check if its player 1 turn, then if normal move is made in the right direction OR if jump was made
		else if(pturn == "⚫" && ((oldspot[0]+1==newspot[0] && Math.abs(oldspot[1]-newspot[1])==1) || (jumped)) ){
			waitingfor="old";
			// move player 1 piece in array
			board[oldspot[0]][oldspot[1]] = "  ";
			board[newspot[0]][newspot[1]] = "⚫";
			// switch turn to player 2
			pturn = "🔴";
			// change backround of table and text in html
			document.getElementById(lastcell.id).style+="background-color:burlywood;";
			document.getElementById("text1").innerHTML = "🔴Player Two's Turn🔴";
		}
		// first check if its player 2 turn, then if normal move is made in the right direction OR if jump was made
		else if(pturn == "🔴" && ((oldspot[0]-1==newspot[0] && Math.abs(oldspot[1]-newspot[1])==1) || (jumped)) ){
			waitingfor="old";
			// move player 2 piece in array
			board[oldspot[0]][oldspot[1]] = "  ";
			board[newspot[0]][newspot[1]] = "🔴";
			// switch turn to player 1
			pturn = "⚫";
			// change backround of table and text in html
			document.getElementById(lastcell.id).style+="background-color:burlywood;";
			document.getElementById("text1").innerHTML = "⚫Player One's Turn⚫";
		}
		
	}
	// return info of last cell clicked on
	return lastcell;
}

// function to see if either player wins
function wincheck(){
	// check if player 2 ran out of pieces
	if(score[1]==0){
		document.getElementById("text1").innerHTML = "⚫Player One Wins!⚫";
		return true;
	}
	// check if player 1 ran out of pieces
	else if(score[0]==0){
		document.getElementById("text1").innerHTML = "🔴Player Two Wins!🔴";
		return true;
	}
	// return false if no one has won
	return false;
}

// query selector withing the table
const tbody = document.querySelector('#myTable');
// event listener to see if current player clicks anywhere on the board
tbody.addEventListener('click', function (e) {
	// stores info of current cell in table clicked on
	const cell = e.target.closest('td');
	// do nothing if cell wasnt clicked on or if game is over
	if (!cell || gameover){
		return;
	}
	// if cell was clicked on and game isnt over, call function validmove() to handle movement of pieces on the board
	lastcell = validmove(cell, lastcell);
	// print the board in the console and update the board in the html
	printboard();
	// update gameover to see if either player lost
	gameover = wincheck();
	console.log("Red Pieces: " +score[1] + " Black Pieces: " +score[0] )
});