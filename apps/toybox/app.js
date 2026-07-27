// Bangle.js 2 Touch Ripple Effect – Inverted Colors
// -------------------------------------------------
// Customise these constants to control the effect:

const SPEED     = 2;     // pixels per frame – how fast the ripples expand
const INTENSITY = 1.0;   // initial brightness multiplier (0 … 1)
const FADE_TIME = 2000;  // milliseconds until a ripple completely fades
const FRAME_RATE= 30;    // animation frames per second
const MAX_RIPPLES= 20;   // maximum number of simultaneous ripples
const WAVE_COUNT= 3;     // how many concentric circles per ripple
const WAVE_SPACE= 6;     // pixels between each concentric circle

// Base colour for the ripples (normalised 0 … 1)
// Inverted from original [0, 0.5, 1] → [1, 0.5, 0] (orange)
const BASE_COLOR = [1, 0.5, 0];

// Background colour – now white (inverted from black)
const BG_COLOR = [1, 1, 1];
// -------------------------------------------------

// Store active ripples: each has {x, y, radius, birthTime}
var ripples = [];

// Create a new ripple at the touch position
function createRipple(x, y) {
  ripples.push({
    x: x,
    y: y,
    radius: 0,
    birthTime: getTime()
  });
  // Limit the number of ripples to prevent memory or performance issues
  if (ripples.length > MAX_RIPPLES) ripples.shift();
}

// Update radii and remove expired ripples
function updateRipples() {
  var now = getTime();
  ripples = ripples.filter(function(r) {
    var ageMs = (now - r.birthTime) * 1000;
    if (ageMs >= FADE_TIME) return false; // remove fully faded ripple

    r.radius += SPEED;
    // Remove if it has grown too large (beyond the screen diagonal)
    if (r.radius > 350) return false;
    return true;
  });
}

// Draw all ripples on the screen
function drawRipples() {
  g.clear();
  // Use separate R, G, B values instead of an array
  g.setColor(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2]);
  g.fillRect(0, 0, g.getWidth()-1, g.getHeight()-1);

  var now = getTime();
  for (var i = 0; i < ripples.length; i++) {
    var r = ripples[i];
    var ageMs = (now - r.birthTime) * 1000;
    var fade = 1 - (ageMs / FADE_TIME);
    if (fade < 0) fade = 0;

    for (var w = 0; w < WAVE_COUNT; w++) {
      var rWave = r.radius - w * WAVE_SPACE;
      if (rWave <= 0) continue;

      var waveFade = fade * (1 - w / WAVE_COUNT);
      if (waveFade < 0) waveFade = 0;

      var colour = [
        BASE_COLOR[0] * INTENSITY * waveFade,
        BASE_COLOR[1] * INTENSITY * waveFade,
        BASE_COLOR[2] * INTENSITY * waveFade
      ];
      // Unpack the array here as well
      g.setColor(colour[0], colour[1], colour[2]);
      g.drawCircle(r.x, r.y, rWave);
    }
  }

  g.flip();
}

// Main animation loop
function animate() {
  updateRipples();
  drawRipples();
}

// -------------------------------------------------
// Setup

// Listen for any touch on the screen
Bangle.on('touch', function(button, xy) {
    createRipple(xy.x, xy.y);
});

// Start the animation
setInterval(animate, 1000/FRAME_RATE);