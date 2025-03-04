require("Font8x16").add(Graphics);

//AGUMON
var L1 = {
  width : 16, height : 16, bpp : 1,
  transparent : 0,
  palette : new Uint16Array([65535,0]),
  buffer : atob("AAAH4AgQcMiAaIDohgh4CEAQP4gpLylFGM40YlPVfn8=")
};
var L2 = {
  width : 16, height : 16, bpp : 1,
  transparent : 0,
  palette : new Uint16Array([65535,0]),
  buffer : atob("B+AIEHDIgGiA6IYIeAhA0D8QGMgpGDnHDF0zxlKqfv4=")
};
var R1 = {
  width : 16, height : 16, bpp : 1,
  transparent : 0,
  palette : new Uint16Array([65535,0]),
  buffer : atob("B+AIEBMOFgEXARBhEB4LAgj8ExgYlOOcujBjzFVKf34=")
};
var R2 = {
  width : 16, height : 16, bpp : 1,
  transparent : 0,
  palette : new Uint16Array([65535,0]),
  buffer : atob("AAAH4AgQEw4WARcBEGEQHggCEfz0lKKUcxhGLKvK/n4=")
};

// Initial position and direction
var x = 40;
var y = 30;
var direction = 1; // 1 for right, -1 for left
var currentFrame = 0; // 0 for L1/R1, 1 for L2/R2
var prevX = x; // Track the previous position of the sprite

// Function to draw the sprite
function drawSprite() {
  // Clear the previous sprite position
  g.clearRect(prevX, y, prevX + 32, y + 32);
  // Draw the new sprite
  if (direction === 1) {
    g.drawImage(currentFrame === 0 ? R1 : R2, x, y, {scale:2});
  } else {
    g.drawImage(currentFrame === 0 ? L1 : L2, x, y, {scale:2});
  }
  // Update the previous position
  prevX = x;
}

// Function to update the sprite's position
function updatePosition() {
  // Randomly decide to change direction
  if (Math.random() < 0.3) { // 10% chance to change direction
    direction = Math.random() < 0.5 ? -1 : 1; // Randomly choose left or right
  }

  // Move the sprite
  x += direction * 2; // Move the sprite by 2 pixels

  // Ensure the sprite stays within the screen bounds
  if (x > g.getWidth() - 32) {
    x = g.getWidth() - 32;
    direction = -1; // Change direction to left
  } else if (x < 0) {
    x = 0;
    direction = 1; // Change direction to right
  }

}

// Function to alternate between frames
function alternateFrame() {
  currentFrame = 1 - currentFrame; // Toggle between 0 and 1
}

// Set up timers
//setInterval(updatePosition, 500); // Update position every 50ms
//setInterval(alternateFrame, 500); // Alternate frames every 500ms

//ACTUAL WATCH

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
      queueMillis = 60000;
    } else {
      queueMillis = 500;
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
  var seconds = date.getSeconds();

  // Draw the time in the middle of the screen
  g.reset().clearRect(Bangle.appRect);
  g.setFontAlign(0, 0); // Center alignment
  g.setFontVector(60); // Large font for time
  var timeString = require("locale").time(date, 1);
  var timeWidth = g.stringWidth(timeString);
  var jpclX = (g.getWidth() - timeWidth) / 2 + 85; //this sucks, actually
  var jpclY = g.getHeight() / 2;
  g.drawString(timeString, jpclX, jpclY);

  if (!Bangle.isLocked()) {
    g.setFontVector(20); 
    g.drawString(seconds.toString().padStart(2, '0'), jpclX + timeWidth / 2 -15, jpclY - 40);
    updatePosition();
    alternateFrame();
    drawSprite();
  }

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
    var dayX = j * dayWidth + dayWidth / 2 + 1;
    if (days[j] === day) {
      g.setColor('#80FF00'); // Accent for the current day
    } else if (dows[j] === 0 || dows[j] === 6) {
      g.setColor('#FF8000'); // Red for weekend days (Saturday and Sunday)
    } else {
      g.setColor(g.theme.bg); // White for other days
    }
    g.fillRect(
      dayX - dayWidth / 2 - 1,
      dayY - 16 / 2 - 1,
      dayX + dayWidth / 2 - 1,
      dayY + 16 / 2 - 1
    );
    g.setColor(g.theme.fg);
    g.drawRect(
      dayX - dayWidth / 2 - 1,
      dayY - 16 / 2 - 1,
      dayX + dayWidth / 2 - 1,
      dayY + 16 / 2 - 1
    );
    g.drawRect(
      dayX - dayWidth / 2 - 1,
      dayY - 48 / 2 - 1,
      dayX + dayWidth / 2 - 1,
      dayY - 16 / 2 - 1
    );
    g.drawImage(jpwkday[dows[j]], dayX - 5, dayY - 22);
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
  mode: "clock",
  remove: function() {
    // Called to unload all of the clock app
    Bangle.removeListener('lcdPower', updateState);
    Bangle.removeListener('lock', updateState);
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = undefined;
  }
});
// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();
}