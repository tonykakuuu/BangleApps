require("Font8x16").add(Graphics);

{
let drawTimeout;
let queueMillis = 1000;
let queueDraw = function() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    drawWatchface();
  }, queueMillis - (Date.now() % queueMillis));
};
let updateState = function() {
  if (Bangle.isLCDOn()) {
    if (Bangle.isLocked()){
      //secondsScreen = true;
      queueMillis = 60000;
    } else {
      //secondsScreen = false;
      queueMillis = 60000;

    }
    drawWatchface(); // draw immediately, queue redraw
  } else { // stop draw timer
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = undefined;
  }
};


// Function to draw the watchface
function drawWatchface() {
  // Get the current date and time
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1; // Months are 0-indexed
  var year = date.getFullYear();

  // Draw the time in the middle of the screen

  g.reset().clearRect(Bangle.appRect);
  g.setFontAlign(0, 0); // Center alignment
  g.setFontVector(60); // Large font for time
  var timeString = require("locale").time(date, 1);
  var timeWidth = g.stringWidth(timeString);
  var jpclX = (g.getWidth() - timeWidth) / 2+85; //this sucks, actually
  var jpclY = g.getHeight() / 2;
  g.drawString(timeString, jpclX, jpclY);

  let jpwkday = [];
  let jpwkday_strings = [
    "AB/mGYZhn+YZhmGf4A==",
    "AA/jGP4xjGP4xmGY4A==",
    "DAMAzbbNAwDgbDG4MA=",
    "DAMAz9Y1DUbZs8zHAA==",
    "DAMAw/8MB4NRtszDAA==",
    "AAeDMf7M3+DBtjU/8A==",
    "DAMAwf4MAwDAMAw/8A==",
  ];
  for (let i = 0; i < 7; i++) {
  jpwkday.push({
    width: 10,
    height: 10,
    bpp: 1,
    transparent: 0,
    palette: new Uint16Array([65535, 0]),
    buffer: atob(jpwkday_strings[i])
    });
  }

  var days = [];
  var dows = [];
  for (var i = -3; i <= 3; i++) {
    var tempDate = new Date(year, month - 1, day + i);
    days.push(tempDate.getDate());
    dows.push(tempDate.getDay());
  }

  var dayWidth = g.getWidth() / 7;
  var dayY = g.getHeight() - 20; // Position at the bottom
  g.setFontAlign(0, 0); // Center alignment
  g.setFont("8x16"); 

  for (var j = 0; j < days.length; j++) {
    var dayX = j * dayWidth + dayWidth / 2+1;
    if (days[j] === day) {
      g.setColor('#80FF00'); // Accent for the current day
    } else if (dows[j] === 0 || dows[j] === 6) {
      g.setColor('#FF0000'); // Red for weekend days (Saturday and Sunday)
    } else {
      g.setColor(g.theme.bg); // White for other days
    }
    g.fillRect(
                dayX - dayWidth/2-1,
                dayY - 16/2-1,
                dayX + dayWidth/2-1,
                dayY + 16/2-1
              );
    g.setColor(g.theme.fg);
    g.drawRect(
                dayX - dayWidth/2-1,
                dayY - 16/2-1,
                dayX + dayWidth/2-1,
                dayY + 16/2-1
              );
    g.drawRect(
                dayX - dayWidth/2-1,
                dayY - 48 /2-1,
                dayX + dayWidth/2-1,
                dayY - 16/2-1
              );
    g.drawImage(jpwkday[dows[j]], dayX-5, dayY-22);
    g.drawString(days[j], dayX, dayY);
  }

  queueDraw();
}

// Clear the screen once, at startup
g.clear();
// Set dynamic state and perform initial drawing
updateState();
// Register hooks for LCD on/off event and screen lock on/off event
Bangle.on('lcdPower', updateState);
Bangle.on('lock', updateState);
Bangle.setUI({
  mode : "clock",
  remove : function() {
    // Called to unload all of the clock app
    Bangle.removeListener('lcdPower', updateState);
    Bangle.removeListener('lock', updateState);
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = undefined;
  }});
// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();
}