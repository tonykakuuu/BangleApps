// Clear the screen once at the beginning
g.clear();
require("Font8x16").add(Graphics);

// Function to draw the watchface
function drawWatchface() {
  // Get the current date and time
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var day = date.getDate();
  var month = date.getMonth() + 1; // Months are 0-indexed
  var year = date.getFullYear();

  // Clear the screen
  g.clear();

  // Draw the time in the middle of the screen
  var timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  var timeWidth = g.stringWidth(timeString);
  var timeX = (g.getWidth() - timeWidth) / 2+10;
  var timeY = g.getHeight() / 2;
  g.setFontAlign(0, 0); // Center alignment
  g.setFontVector(60); // Large font for time
  g.drawString(timeString, timeX, timeY);

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
}

// Update the watchface every minute
setInterval(drawWatchface, 60000);

// Draw the watchface immediately
drawWatchface();

// Load widgets if needed
Bangle.loadWidgets();
Bangle.drawWidgets();