var rules = false;
function switchpage(page){
	window.location.href=page;
	console.log("worked")
}
function rulesshow(){
	if (rules){
		document.getElementById("rules").style.visibility="hidden";
		rules=false;
		document.getElementById("button5").innerHTML="Show Rules";
	}
	else{
		document.getElementById("rules").style.visibility="visible";
		rules=true;
		document.getElementById("button5").innerHTML="Hide Rules";
	}
}