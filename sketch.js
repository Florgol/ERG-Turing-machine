
//Jetzige Position auf dem Band der Turing Machine
var positionCharArray = 0;

//Die Position an der das Turing Band auf der Canvas angezeigt wird
var turingBandXPosition = 750;
var turingBandYPosition = 250;

//Die Position des Graphs
var graphXPosition = 100;
var graphYPosition = 30;

//Die Position an der der Schreib- und Lesekopf der Turingmachine auf der Canvas
//angezeigt wird
//Wichtig: ist abhängig von der Position des Turingbandes
var turingArrowXPosition = turingBandXPosition + 17.5;
var turingArrowYPosition = turingBandYPosition - 30;

//Die Position der Erfolgs- bzw. Misserfolgsanzeige
var resultXPosition = 700;
var resultYPosition = 500;

//Der Zustand in der sich die Turing Machine befindet
//nextState wird von der Turing Machine markiert
var currentState = "0";
var nextState = "1";

//Input Text Fenster
var inp;

//Buttons
var buttonGenerateCorrectERGString;
var buttonGenerateIncorrectERGString;
var buttonStartMachine;
var buttonNextStep;
var buttonReset;

//Ein korrekter ERG String wird später durch einen Button ausgegeben
var inputString = [""];

function setup() {


  createCanvas(1900, 550);
  background(220);

  createP("");

  //Input Fenster erstellen
  inp = createInput("BEISPIEL␣");

  //Button um richtige Zeichenkette zu generieren         
  buttonGenerateCorrectERGString = createButton("Richtige Zeichenkette generieren");
  buttonGenerateCorrectERGString.mousePressed(generateCorrectInput);

  //Button um falsche Zeichenkette zu generieren
  buttonGenerateIncorrectERGString = createButton("Falsche Zeichenkette generieren");
  buttonGenerateIncorrectERGString.mousePressed(generateWrongInput);

  createP("");

  //Button um den eingegebenen Ausdruck zu prüfen
  buttonStartMachine = createButton("Zeichenkette prüfen");
  buttonStartMachine.mousePressed(checkString);


                               


  drawTuringArrow(turingArrowXPosition, turingArrowYPosition);
  //deleteTuringArrow(turingArrowXPosition, turingArrowYPosition);

 



  
}

function draw() {

  background(220);
  
  drawGraph(graphXPosition, graphYPosition, currentState, nextState);
  drawCharArray(inputString, turingBandXPosition, turingBandYPosition);
  drawTuringArrow(turingArrowXPosition, turingArrowYPosition);

}


//Diese Funktion setzt die relevanten globalen Variablen zurück
//Und stellt die Buttons wieder her
function reset(){

  buttonReset.remove();

  currentState = "0";
  nextState = "1";
  positionCharArray = 0;
  inputString = [""];

  //Das überstehende Turing Band und das Erbebnis von der Canvas löschen
  background(220);

  //Turing Lese- und Schreibkopf auf Anfang zurücksetzen
  deleteTuringArrow(turingArrowXPosition, turingArrowYPosition);
  turingArrowXPosition = turingBandXPosition + 17.5;
  drawTuringArrow(turingArrowXPosition, turingArrowYPosition);

  //Input Fenster erstellen
  inp = createInput("BEISPIEL␣");

  //Button um richtige Zeichenkette zu generieren         
  buttonGenerateCorrectERGString = createButton("Richtige Zeichenkette generieren");
  buttonGenerateCorrectERGString.mousePressed(generateCorrectInput);

  //Button um falsche Zeichenkette zu generieren
  buttonGenerateIncorrectERGString = createButton("Falsche Zeichenkette generieren");
  buttonGenerateIncorrectERGString.mousePressed(generateWrongInput);

  createP("");

  //Button um den eingegebenen Ausdruck zu prüfen
  buttonStartMachine = createButton("Zeichenkette prüfen");
  buttonStartMachine.mousePressed(checkString);
}


//Diese Funktion gibt den input an den zur Prüfung weiter InputString weiter
//Ausserdem werden alle Buttons und das Input Fenster entfernt 
//und ein neuer Button erscheint um den nächsten Schritt auszuführen
function checkString(){
  inputString = createCharArray(inp.value());

  inp.remove();
  buttonGenerateCorrectERGString.remove();
  buttonGenerateIncorrectERGString.remove();
  buttonStartMachine.remove();

  buttonNextStep = createButton("Nächster Schritt");
  buttonNextStep.mousePressed(moveTuring);

}


//Diese Funktion generiert einen korrekten ERG String im Input Fenster
function generateCorrectInput(){
  inp.value(createCorrectERGString());
}

//Diese Funktion generiert einen falschen ERG String im Input Fenster
function generateWrongInput(){
  inp.value(createIncorrectERGString());
}


//Der Graph, das Turingband und der Schreib- und Lesekopft verändern sich schrittweise
//Diese Funktion geht einen Schritt
function moveTuring(){

  if(nextStateMarkMove(nextState, positionCharArray)){

    var info = nextStateMarkMove(nextState, positionCharArray);

    //Changing the current and next state, based on the logic in nextStateMarkMove()
    currentState = nextState;
    nextState = info[0];
    var mark = info[1];
    var move = info[2];

    //Moving the turing head, baseed on the logic in nextStateMarkMove()
    deleteTuringArrow(turingArrowXPosition, turingArrowYPosition);
    moveTuringArrow(move);


    //Writing on the Turing band, based on the logic in nextStateMarkMove()
    inputString[positionCharArray] = mark;

    //Changing the position on the Turing Band, based on whether we move left or right
    if (move == "R")
      positionCharArray++;
    else if (move == "L")
      positionCharArray--;

    //If the next state is 15, we have reached the end of our Graph
    //and the ERG String is correct
    if(nextState == "15"){
      showResult(true, resultXPosition, resultYPosition);

      buttonNextStep.remove();
      createP("(¬‿¬)");

      buttonReset = createButton("Einen weiteren Ausdruck prüfen");
      buttonReset.mousePressed(reset);
    }
  } else {
    showResult(false, resultXPosition, resultYPosition);
    buttonNextStep.remove();

    createP("(︺︹︺)");

    buttonReset = createButton("Einen weiteren Ausdruck prüfen");
    buttonReset.mousePressed(reset);
  }
}


//Diese Funktion gibt eine Meldung aus, ob der Embedded Reber Grammar String gültig oder ungültig ist
//an der Position (x,y) auf der Canvas
function showResult(correct, x, y){

  strokeWeight(0.7);

  if (correct){
    //Show correct message
    //I might use images here
    text("Der Ausdruck ist ", x, y);
    stroke(0,255,0);
    strokeWeight(1.2);
    text("gültig", x+95, y);
  } else {
    //Show incorrect message
    text("Der Ausdruck ist ", x, y);
    stroke(255,0,0);
    strokeWeight(1.2);
    text("nicht gültig", x+95, y);
  }
}


//Diese Funktion verändert ein Zeichen im Input String
//input: position auf Turing Band, also 1 oder 2, 3, ..
//und symbol, welches auf das Band geschrieben wird
//output: Verändert ein Zeichen im Char Array inputString
function changeTuringBand(position, symbol){
  inputString[position] = symbol;
}

//Diese Funktion bewegt den Lesekopf der Turing Machine nach rechts oder nach links
//input: "L" oder "R"
//output: veränder die Variable turingArrowXPosition
function moveTuringArrow(direction){
  if (direction == "L")
    turingArrowXPosition = turingArrowXPosition - 40;
  else if (direction == "R")
    turingArrowXPosition = turingArrowXPosition + 40;
}

//Diese Funktion löscht einen Pfeil (Schreibkopf der Turing Machine)
function deleteTuringArrow(x, y){
  strokeWeight(5);
  stroke(220);

  beginShape();
  vertex(x, y);
  vertex(x, y +20);
  vertex(x-5, y+15);
  vertex(x, y +20);
  vertex(x+5, y+15);
  vertex(x, y+20);
  endShape();
}

//Diese Funktion zeichnet einen Pfeil, der nach unten zeigt an dem Punkt (x,y)
function drawTuringArrow(x, y){
  arrowBottom(x, y, x, y + 20);
}

//Diese Funktion zeichnet ein Char Array als Band einer Turing Machine an Position (x,y)
function drawCharArray(ca, x, y){

  var distance = 0;
  var increment = 40;

  for(i = 0; i < ca.length; i++){
    square(x+distance, y, 35);
    text(ca[i], x+distance + (increment/3), y + (increment/2));
    distance = distance + increment;
  }
}


//Diese Funktion macht aus einem String ein Char Array
function createCharArray(str){
  return str.split("");
}

//Hier sind 2 Funktionen, um einen korrekten Embedded Reber Grammar String zu erzeugen
//und um einen wahrscheinlich inkorrekten Embedded Reber Grammar String zu erzeugen

//Gibt korrekte ERG String zurück
function createCorrectERGString() {
  var result = generateEmbeddedRGString(generateRGString(3, true));

  //Falls die Länge des Strings größer als 20 ist rufen wir die Funktion rekursiv erneut auf
  if (result.length <= 20)
    return result;
  else
    return createCorrectERGString();
}

//Gibt wahrscheinlich falschen ERG String zurück
function createIncorrectERGString() {

  var result = generateEmbeddedRGString(generateRGString(3, false));

  //Falls die Länge des Strings größer als 20 ist rufen wir die Funktion rekursiv erneut auf
  if (result.length <= 20)
    return result;
  else
    return createProbablyWrongERGString();
}


//Diese Funktion nimmt einen Reber Grammar String
//und macht einen (von 2 möglichen) Embedded Reber Grammar String daraus
function generateEmbeddedRGString(rgString){

  var pick = Math.floor(Math.random() * 2);

  if (pick == 0)
    return "BT" + rgString + "TE␣";
  else
    return "BP" + rgString + "PE␣";
}


//Diese rekursive Funktion generiert einen Reber Grammar String
//Wichtig: sie muss mit generateRGString(3, true) aufgerufen werden
//um einen korrekten RG String zu erzeugen!
//generateRGString(3, false) erzeugt einen falschen!
function generateRGString(state, correct){
  var pick = "";

  //In state 3 we always return B and go to state 4
  if (state == 3){
    return "B" + generateRGString(4, correct);
  }
  //In state 4 we either return T and state 5, or P and state 7
  else if (state == 4){
    pick = pickRandomElement(["T", "P"]);
    if (pick == "T")
      return pick + generateRGString(5, correct);
    else
      return pick + generateRGString(7, correct);
  }

  //In state 5 we either return S and state 5, or X and state 6
  else if (state == 5){
    pick = pickRandomElement(["S", "X"]);
    if (pick == "S")
      return pick + generateRGString(5, correct);
    else
      return pick + generateRGString(6, correct);
  }

  //Here we intentionally create a wrong String, if correct == false
  //
  //
  else if (state == 6 && correct == false){
    pick = pickRandomElement(["T", "E"]);
    if (pick == "T")
      return pick + generateRGString(7, correct);
    else
      return pick + generateRGString(9, correct);
  }

  else if (state == 8 && correct == false){
    pick = pickRandomElement(["T", "E"]);
    if (pick == "T")
      return pick + generateRGString(6, correct);
    else
      return pick + generateRGString(9, correct);
  }
  //
  //


  //In state 6 we either return X and state 7, or S and State 9
  else if (state == 6){
    pick = pickRandomElement(["X", "S"]);
    if (pick == "X")
      return pick + generateRGString(7, correct);
    else
      return pick + generateRGString(9, correct);
  }

  //In state 7 we either return T and state 7, or V and state 8
  else if (state == 7){
    pick = pickRandomElement(["T", "V"]);
    if (pick == "T")
      return pick + generateRGString(7, correct);
    else
      return pick + generateRGString(8, correct);
  }

  //In state 8 we either return P and state 6, or V and state 9
  else if (state == 8){
    pick = pickRandomElement(["P", "V"]);
    if (pick == "P")
      return pick + generateRGString(6, correct);
    else
      return pick + generateRGString(9, correct);
  }

  //In state 9 we always return E and state 10
  else if (state == 9){
    return "E" + generateRGString(10, correct);
  }

  //In state

  return "";
}



//Diese Funktion sucht ein zufälliges element aus einem Array aus 
//und gibt es zurück
function pickRandomElement(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}


//Diese Funktion nimmt den jetzigen Zustand und das Symbol von Turing Band 
//(dieses wird über die globale Variable position bestimmt)
//und gibt den nächsten Zustand, die Zeichenänderung auf dem Band und die Bewegungsrichtung wieder
//Beispiel für Ausgabe: ["1", "#", "R"]
//Falls es keinen nächsten Zustand gibt, wird hier der Boolean false zurückgegeben
//Diese Funkton liefert also verschiedene Rückgabe-Datentypen
function nextStateMarkMove(state, bandPosition){

  var symbol = inputString[bandPosition];

  //Hier wird die Logik für alle Kanten vorgegeben

  //Kante von 1 zu 2
  if (state == "1" && symbol == "B"){
    return ["2", "#", "R"];
  } 
  //Kante von 2 zu 3
  else if (state == "2" && symbol == "P"){
    return ["3", "P", "R"];
  }
  else if (state == "2" && symbol == "T"){
    return ["3", "T", "R"];
  }
  //Kante von 3 zu 4
  else if (state == "3" && symbol == "B"){
    return ["4", "#", "R"];
  }
  //Kante von 4 zu 5
  else if (state == "4" && symbol == "T"){
    return ["5", "#", "R"];
  }
  //Kante von 5 zu 5
  else if (state == "5" && symbol == "S"){
    return ["5", "#", "R"];
  }
  //Kante von 5 zu 6
  else if (state == "5" && symbol == "X"){
    return ["6", "#", "R"];
  }
  //Kante von 6 zu 7
  else if (state == "6" && symbol == "X"){
    return ["7", "#", "R"];
  }
  //Kante von 4 zu 7
  else if (state == "4" && symbol == "P"){
    return ["7", "#", "R"];
  }
  //Kante von 7 zu 7
  else if (state == "7" && symbol == "T"){
    return ["7", "#", "R"];
  }
  //Kante von 7 zu 8
  else if (state == "7" && symbol == "V"){
    return ["8", "#", "R"];
  }
  //Kante von 8 zu 6
  else if (state == "8" && symbol == "P"){
    return ["6", "#", "R"];
  }
  //Kante von 8 zu 9
  else if (state == "8" && symbol == "V"){
    return ["9", "#", "R"];
  }
  //Kante von 6 zu 9
  else if (state == "6" && symbol == "S"){
    return ["9", "#", "R"];
  }
  //Kante von 9 zu 10
  else if (state == "9" && symbol == "E"){
    return ["10", "#", "R"];
  }
  //Kante von 10 zu 11
  else if (state == "10" && symbol == "T"){
    return ["11", "#", "L"];
  }
  //Kante von 10 zu 12
  else if (state == "10" && symbol == "P"){
    return ["12", "#", "L"];
  }
  //Kante von 11 zu 11
  else if (state == "11" && symbol == "#"){
    return ["11", "#", "L"];
  }
  //Kante von 11 zu 13
  else if (state == "11" && symbol == "T"){
    return ["13", "#", "R"];
  }
  //Kante von 12 zu 12
  else if (state == "12" && symbol == "#"){
    return ["12", "#", "L"];
  }
  //Kante von 12 zu 13
  else if (state == "12" && symbol == "P"){
    return ["13", "#", "R"];
  }
  //Kante von 13 zu 13
  else if (state == "13" && symbol == "#"){
    return ["13", "#", "R"];
  }
  //Kante von 13 zu 14
  else if (state == "13" && symbol == "E"){
    return ["14", "#", "R"];
  }
  //Kante von 14 zu 15
  else if (state == "14" && symbol == "␣"){
    return ["15", "␣", "L"];
  }
  return false;
  

}



//cs (current state) und ns (next state) identifizieren die ausgewählte Kante
//Die ausgewählte Kante ist grün unterlegt wie in den arrow-Funktionen definiert
//x und y zeichnen den Graph an Position (x,y)
function drawGraph(x, y, cs, ns) {



  //Zustand 1
  drawState(x+50, y+50, "1", (ns == "1"));

  //Kante von Zustand 1 zu 2
  arrowRight(x+70, y+50, x+130, y+50, (cs=="1" && ns =="2"));
  strokeWeight(0.7);
  text("B -> #, R", x+80, y+40);

  //Zustand 2
  drawState(x+150, y+50, "2", (ns == "2"));

  //Kante von Zustand 2 zu 3
  arrowRight(x+170, y+50, x+230, y+50, (cs=="2" && ns =="3"));
  strokeWeight(0.7);
  text("P -> P, R", x+175, y+25);
  text("T -> T, R", x+175, y+40);

  //Zustand 3
  drawState(x+250, y+50, "3", (ns == "3"));

  //Kante von Zustand 3 zu 4
  arrowBottomRight(x+265, y+65, x+305, y+105, (cs=="3" && ns =="4"));
  strokeWeight(0.7);
  text("B -> #, R", x+230, y+95);

  //Zustand 4
  drawState(x+320, y+120, "4", (ns == "4"));

  //Kante von Zustand 4 zu 5
  arrowTopRight(x+335, y+105, x+375, y+65, (cs=="4" && ns =="5"));
  strokeWeight(0.7);
  text("T -> #, R", x+302, y+85);

  //Zustand 5
  drawState(x+390, y+50, "5", (ns == "5"));

  //Kante von Zustand 5 zu 6
  arrowRight(x+410, y+50, x+470, y+50, (cs=="5" && ns =="6"));
  strokeWeight(0.7);
  text("X -> #, R", x+420, y+40);

  //Kante von Zustand 5 zu 5
  arrowSelfTop(x+380, y+35, x+400, y+35, (cs=="5" && ns =="5"));
  strokeWeight(0.7);
  text("S -> #, R", x+367, y+10);

  //Zustand 6
  drawState(x+490, y+50, "6", (ns == "6"));

  //Kante von Zustand 6 zu 7
  arrowBottomLeft(x+475, y+65, x+400, y+172, (cs=="6" && ns =="7"));
  strokeWeight(0.7);
  text("X -> #, R", x+380, y+120);

  //Kante von Zustand 6 zu 9
  arrowBottomRight(x+505, y+65, x+545, y+105, (cs=="6" && ns =="9"));
  strokeWeight(0.7);
  text("S -> #, R", x+530, y+80);

  //Kante von Zustand 4 zu 7
  arrowBottomRight(x+335, y+135, x+375, y+175, (cs=="4" && ns =="7"));
  strokeWeight(0.7);
  text("P -> #, R", x+300, y+165);
  
  //Zustand 7
  drawState(x+390, y+190, "7", (ns == "7"));

  //Kante von Zustand 7 zu 7
  arrowSelfBottom(x+380, y+205, x+400, y+205, (cs=="7" && ns =="7"));
  strokeWeight(0.7);
  text("T -> #, R", x+366, y+238);  

  //Kante von Zustand 7 zu 8
  arrowRight(x+410, y+190, x+470, y+190, (cs=="7" && ns =="8"));
  strokeWeight(0.7);
  text("V -> #, R", x+415, y+180);

  //Zustand 8
  drawState(x+490, y+190, "8", (ns == "8"));

  //Kante von Zustand 8 zu 6
  arrowTop(x+490, y+170, x+490, y+70, (cs=="8" && ns =="6"));
  strokeWeight(0.7);
  text("P -> #, R", x+435, y+150);

  //Kante von Zustand 8 zu 9
  arrowTopRight(x+505, y+175, x+545, y+135, (cs=="8" && ns =="9"));
  strokeWeight(0.7);
  text("V -> #, R", x+495, y+130);

  //Zustand 9
  drawState(x+560, y+120, "9", (ns == "9"));

  //Kante von Zustand 9 zu 10
  arrowBottom(x+560, y+140, x+560, y+300, (cs=="9" && ns =="10"));
  strokeWeight(0.7);
  text("E -> #, R", x+500, y+250);

  //Zustand 10
  drawState(x+560, y+320, "10", (ns == "10"));

  //Kante von 10 zu 11
  arrowLeft(x+540, y+320, x+340, y+320, (cs=="10" && ns =="11"));
  strokeWeight(0.7);
  text("T -> #, L", x+420, y+310);

  //Kante von 10 zu 12
  arrowBottomLeft(x+545, y+335, x+340, y+415, (cs=="10" && ns =="12"));
  strokeWeight(0.7);
  text("P -> #, L", x+360, y+385);

  //Zustand 11
  drawState(x+320, y+320, "11", (ns == "11"));

  //Kante von 11 zu 11
  arrowSelfTop(x+310, y+305, x+330, y+305, (cs=="11" && ns =="11"));
  strokeWeight(0.7);
  text("# -> #, L", x+297, y+280);

  //Kante von 11 zu 13
  arrowLeft(x+300, y+320, x+240, y+320, (cs=="11" && ns =="13"));
  strokeWeight(0.7);
  text("T -> #, R", x+250, y+310);

  //Zustand 12
  drawState(x+320, y+420, "12", (ns == "12"));

  //Kante von 12 zu 12
  arrowSelfBottom(x+310, y+435, x+330, y+435, (cs=="12" && ns =="12"));
  strokeWeight(0.7);
  text("# -> #, L", x+297, y+468);

  //Kante von 12 zu 13
  arrowTopLeft(x+305, y+405, x+235, y+335, (cs=="12" && ns =="13"));
  strokeWeight(0.7);
  text("P -> #, R", x+220, y+385);

  //Zustand 13
  drawState(x+220, y+320, "13", (ns == "13"));

  //Kante von 13 zu 13
  arrowSelfTop(x+210, y+305, x+230, y+305, (cs=="13" && ns =="13"));
  strokeWeight(0.7);
  text("# -> #, R", x+200, y+280);

  //Kante von 13 zu 14
  arrowLeft(x+200, y+320, x+70, y+320, (cs=="13" && ns =="14"));
  strokeWeight(0.7);
  text("E -> #, R", x+120, y+310);

  //Zustand 14
  drawState(x+50, y+320, "14", (ns == "14"));

  //Kante von 14 zu 15
  arrowBottom(x+50, y+340, x+50, y+395, (cs=="14" && ns =="15"));
  strokeWeight(0.7);
  text("␣ -> ␣ , L", x+60, y+370);

  //Zustand 15
  strokeWeight(3);
  ellipse(x+50, y+420, 41, 41);
  drawState(x+50, y+420, "15", (ns == "15"));


}


//Funktion um einen Pfeil in Richtung links zu zeichnen
//Der Pfeil beginnt bei Punkt (x1,y1) und endet in Punkt (x2,y2)
//Falls green == true ist er grün, sonst schwarz
//Die Dicke des Pfeils ist sWeight
//Die folgenden Definitionen für Pfeile folgen dieser hier
function arrowLeft(x1, y1, x2, y2, green = false, sWeight = 2){
  strokeWeight(sWeight);

  if(green)
    stroke(0,255,0);
  else
    stroke(0,0,0);

  beginShape();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x2+5, y2-5);
  vertex(x2, y2);
  vertex(x2+5, y2+5);
  vertex(x2, y2);
  endShape();
}

function arrowRight(x1, y1, x2, y2, green = false, sWeight = 2){
  strokeWeight(sWeight);

  if(green)
    stroke(0,255,0);
  else
    stroke(0,0,0);

  beginShape();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x2-5, y2-5);
  vertex(x2, y2);
  vertex(x2-5, y2+5);
  vertex(x2, y2);
  endShape();
}

function arrowTop(x1, y1, x2, y2, green = false, sWeight = 2){
  strokeWeight(sWeight);

  if(green)
    stroke(0,255,0);
  else
    stroke(0,0,0);

  beginShape();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x2-5, y2+5);
  vertex(x2, y2);
  vertex(x2+5, y2+5);
  vertex(x2, y2);
  endShape();
}

function arrowTopLeft(x1, y1, x2, y2, green = false, sWeight = 2){
  strokeWeight(sWeight);

  if(green)
    stroke(0,255,0);
  else
    stroke(0,0,0);

  beginShape();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x2, y2+5);
  vertex(x2, y2);
  vertex(x2+5, y2);
  vertex(x2, y2);
  endShape();
}

function arrowTopRight(x1, y1, x2, y2, green = false, sWeight = 2){
  strokeWeight(sWeight);

  if(green)
    stroke(0,255,0);
  else
    stroke(0,0,0);

  beginShape();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x2, y2+5);
  vertex(x2, y2);
  vertex(x2-5, y2);
  vertex(x2, y2);
  endShape();
}

function arrowBottom(x1, y1, x2, y2, green = false, sWeight = 2){
  strokeWeight(sWeight);

  if(green)
    stroke(0,255,0);
  else
    stroke(0,0,0);

  beginShape();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x2-5, y2-5);
  vertex(x2, y2);
  vertex(x2+5, y2-5);
  vertex(x2, y2);
  endShape();
}

function arrowBottomLeft(x1, y1, x2, y2, green = false, sWeight = 2){
  strokeWeight(sWeight);

  if(green)
    stroke(0,255,0);
  else
    stroke(0,0,0);

  beginShape();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x2, y2-5);
  vertex(x2, y2);
  vertex(x2+5, y2);
  vertex(x2, y2);
  endShape();
}

function arrowBottomRight(x1, y1, x2, y2, green = false, sWeight = 2){
  strokeWeight(sWeight);

  if(green)
    stroke(0,255,0);
  else
    stroke(0,0,0);

  beginShape();
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x2, y2-5);
  vertex(x2, y2);
  vertex(x2-5, y2);
  vertex(x2, y2);
  endShape();
}


//Hier beginnen die Definitionen der Pfeile, die einen Zustand auf sich selbst zeigen lassen
//Diese Funktionen sind weniger allgemein, 
//denn ihre Proportionen sind von der Größe des Zustandes abhängig (40)
//Und die Punkte müssen für SelfRight und SelfLeft in der Reihenfolge: 
//"Erst der obere, dann der untere Punkt", eingegeben werden
//Für SelfTop und SelfBottom in der Reihenfolge: "Erst der linke Punkt, dann der rechte"

//Orientierung für die Punkte
//Seien xZ und yZ die Koordinaten des Zustandes
//Für SelfRight und SelfLeft: 
//x1 sollte 20 Einheiten von xZ entfernt sein, y1 10 Einheiten von yZ
//x2 = x1 und y2 = y1 + 20

//Die gleichen Abstände in unterschiedlicher Richtung lassen sich auf SelfTop und SelfBottom übertragen

function arrowSelfRight (x1, y1, x2, y2, green = false, sWeight = 2){
  strokeWeight(sWeight);
  
  if(green)
    stroke(0,255,0);
  else
    stroke(0,0,0);
  
  line(x1, y1, x1 +20, y1 -20);
  line(x1 +20, y1 -20, x1 +20, y1 +40);
  line(x1 +20, y1 +40, x2, y2);

  beginShape();
  vertex(x2, y2);
  vertex(x2, y2+5);
  vertex(x2, y2);
  vertex(x2+5, y2);
  vertex(x2, y2);
  endShape();
  
}

function arrowSelfLeft (x1, y1, x2, y2, green = false, sWeight = 2){
  strokeWeight(sWeight);
  
  if(green)
    stroke(0,255,0);
  else
    stroke(0,0,0);
  
  line(x1, y1, x1 -20, y1 -20);
  line(x1 -20, y1 -20, x1 -20, y1 +40);
  line(x1 -20, y1 +40, x2, y2);

  beginShape();
  vertex(x2, y2);
  vertex(x2, y2+5);
  vertex(x2, y2);
  vertex(x2-5, y2);
  vertex(x2, y2);
  endShape();
  
}

function arrowSelfTop (x1, y1, x2, y2, green = false, sWeight = 2){
  strokeWeight(sWeight);
  
  if(green)
    stroke(0,255,0);
  else
    stroke(0,0,0);
  
  line(x1, y1, x1 -20, y1 -20);
  line(x1 -20, y1 -20, x1 +40, y1 -20);
  line(x1 +40, y1 -20, x2, y2);

  beginShape();
  vertex(x2, y2);
  vertex(x2, y2-5);
  vertex(x2, y2);
  vertex(x2+5, y2);
  vertex(x2, y2);
  endShape();
  
}

function arrowSelfBottom (x1, y1, x2, y2, green = false, sWeight = 2){
  strokeWeight(sWeight);
  
  if(green)
    stroke(0,255,0);
  else
    stroke(0,0,0);
  
  line(x1, y1, x1 -20, y1 +20);
  line(x1 -20, y1 +20, x1 +40, y1 +20);
  line(x1 +40, y1 +20, x2, y2);

  beginShape();
  vertex(x2, y2);
  vertex(x2, y2+5);
  vertex(x2, y2);
  vertex(x2+5, y2);
  vertex(x2, y2);
  endShape();
  
}

//Allgemeine Funktion um Zustand zu zeichnen
//Zeichnet einen Zustand an Position (x,y) mit Bezeichner stateName
//Falls selected == true wird er grün umrandet
//sWeight repräsentiert die Dicke der Umrandung und size den Radius des Kreises 
function drawState(x, y, stateName, selected = false, sWeight = 2.7, size = 30){
    
  strokeWeight(sWeight);

  if (selected)
    stroke(0,255,0);
  else
    stroke(0,0,0);

  ellipse(x, y, size, size);

  strokeWeight(0.7);
  stroke(255,255,255);

  //positioning stateName in the middle of ellipse based on length of the stateName
  //e.g. "14" has to be positioned differently from "1"
  if(stateName.length == 1)
    text(stateName, x- (size/10), y+ (size/10));
  else
    text(stateName, x- (size/4.5), y+ (size/10));
}