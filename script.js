// The robot

const robotElement = document.querySelector("#robot");

const robotState = {
  top: 225,
  left: 225,
  col: 3,
  row: 3,
  angle: 0,
  facing: "left",
  movementSize: 100,
};

// The buttons

const forwardButton = document.querySelector("#arrowup");
const leftButton = document.querySelector("#arrowleft");
const rightButton = document.querySelector("#arrowright");

const keysThatTriggerRobotMovement = ["ArrowUp", "ArrowLeft", "ArrowRight"];

// Hardcoded values

const INITAL_TOP_SMALL = 180;
const INITAL_LEFT_SMALL = 150;
const INITAL_MOVEMENT_SIZE_SMALL = 70;

const INITIAL_COL = 3;
const INITIAL_ROW = 3;

const INITAL_TOP_LARGE = 240;
const INITAL_LEFT_LARGE = 225;
const INITAL_MOVEMENT_SIZE_LARGE = 100;

const SCREENBREAK_SIZE = 550;

const LEFTMOST_COL = 1;
const RIGHTMOST_COL = 5;
const TOP_ROW = 1;
const BOTTOM_ROW = 5;

// Resize grid on different screen sizes

if (window.innerWidth < SCREENBREAK_SIZE) {
  setRobotPosition(INITAL_TOP_SMALL, INITAL_LEFT_SMALL, INITAL_MOVEMENT_SIZE_SMALL, INITIAL_COL, INITIAL_ROW);
  updateRobotElementPosition(INITAL_TOP_SMALL, INITAL_LEFT_SMALL);
} else {
  setRobotPosition(INITAL_TOP_LARGE, INITAL_LEFT_LARGE, INITAL_MOVEMENT_SIZE_LARGE, INITIAL_COL, INITIAL_ROW);
  updateRobotElementPosition(INITAL_TOP_LARGE, INITAL_LEFT_LARGE);
}

window.addEventListener("resize", () => {
  // TODO: limit the events here with some kind of buffer
  if (window.innerWidth < SCREENBREAK_SIZE) {
    setRobotPosition(INITAL_TOP_SMALL, INITAL_LEFT_SMALL, INITAL_MOVEMENT_SIZE_SMALL, INITIAL_COL, INITIAL_ROW);
    updateRobotElementPosition(INITAL_TOP_SMALL, INITAL_LEFT_SMALL);
  } else if (window.innerWidth > SCREENBREAK_SIZE) {
    setRobotPosition(INITAL_TOP_LARGE, INITAL_LEFT_LARGE, INITAL_MOVEMENT_SIZE_LARGE, INITIAL_COL, INITIAL_ROW);
    updateRobotElementPosition(INITAL_TOP_LARGE, INITAL_LEFT_LARGE);
  }
});

// Listen to button clicks

leftButton.addEventListener("click", () => {
  rotateRobotLeft();
});
rightButton.addEventListener("click", () => {
  rotateRobotRight();
});
forwardButton.addEventListener("click", () => {
  moveRobotForward();
});

// Listen to keyboard keypresses

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (keysThatTriggerRobotMovement.includes(key)) {
    event.preventDefault(); // stop page scroll
    addPressedClassToButton(key);
  }
});

document.addEventListener("keyup", (event) => {
  const key = event.key;

  if (keysThatTriggerRobotMovement.includes(key)) {
    removePressedClassFromButton(key);
  }

  switch (key) {
    case "ArrowUp":
      moveRobotForward();
      break;
    case "ArrowLeft":
      rotateRobotLeft();
      break;
    case "ArrowRight":
      rotateRobotRight();
      break;
  }
});

// Functions

function setRobotPosition(top, left, movementSize, col, row) {
  robotState.top = top;
  robotState.left = left;
  robotState.movementSize = movementSize;
  robotState.col = col;
  robotState.row = row;
}

function updateRobotElementPosition(top, left) {
  robotElement.style.top = `${top}px`;
  robotElement.style.left = `${left}px`;
}

function addPressedClassToButton(key) {
  document.querySelector(`#${key.toLowerCase()}`).classList.add("pressed");
}

function removePressedClassFromButton(key) {
  document.querySelector(`#${key.toLowerCase()}`).classList.remove("pressed");
}

function moveRobotForward() {
  let newTop = robotState.top;
  let newLeft = robotState.left;
  let newCol = robotState.col;
  let newRow = robotState.row;

  switch (robotState.facing) {
    case "left":
      // forwards is towards the left
      newLeft -= robotState.movementSize;
      newCol -= 1;
      break;
    case "right":
      // forwards is away from the left
      newLeft += robotState.movementSize;
      newCol += 1;
      break;
    case "up":
      // forwards is towards the top
      newTop -= robotState.movementSize;
      newRow -= 1;
      break;
    case "down":
      // forwards is away from the top
      newTop += robotState.movementSize;
      newRow += 1;
      break;
  }

  if (!movementOutOfBounds(newCol, newRow)) {
    setRobotPosition(newTop, newLeft, robotState.movementSize, newCol, newRow);
    updateRobotElementPosition(newTop, newLeft);
  }
}

function movementOutOfBounds(newCol, newRow) {
  colOutofBounds = newCol < LEFTMOST_COL || newCol > RIGHTMOST_COL;
  rowOutofBounds = newRow < TOP_ROW || newRow > BOTTOM_ROW;

  return colOutofBounds || rowOutofBounds;
}

function rotateRobotLeft() {
  // TODO: merge this into single rotateRobot(direction) method
  const angle = robotState.angle - 90;
  const facing = calculateDirectionFacing(angle);

  setRobotAngle(angle, facing);
  updateRobotElementRotation(angle);
}

function rotateRobotRight() {
  // TODO: merge this with into single rotateRobot(direction) method
  const angle = robotState.angle + 90;
  const facing = calculateDirectionFacing(angle);

  setRobotAngle(angle, facing);
  updateRobotElementRotation(angle);
}

function setRobotAngle(angle, facing) {
  robotState.angle = angle;
  robotState.facing = facing;
}

function updateRobotElementRotation(angle) {
  robotElement.style.transform = `rotate(${angle}deg)`;
}

function calculateDirectionFacing(angle) {
  const normalisedAngle = normaliseAngle(angle);

  switch (normalisedAngle) {
    case 0:
      return "left";
    case 90:
      return "up";
    case 180:
      return "right";
    case 270:
      return "down";
    default:
      return "left";
  }
}

function normaliseAngle(angle) {
  return Math.abs(((angle % 360) + 360) % 360);
}

// Tests

function testMoveRobotForward(facing) {
  const initialTop = robotState.top;
  const initialLeft = robotState.left;
  robotState.facing = facing;
  moveRobotForward();
  if (facing === "up") {
    return robotState.top === initialTop - robotState.movementSize && robotElement.style.top === `${robotState.top}px`;
  } else if (facing === "down") {
    return robotState.top === initialTop + robotState.movementSize && robotElement.style.top === `${robotState.top}px`;
  } else if (facing === "left") {
    return (
      robotState.left === initialLeft - robotState.movementSize && robotElement.style.left === `${robotState.left}px`
    );
  } else if (facing === "right") {
    return (
      robotState.left === initialLeft + robotState.movementSize && robotElement.style.left === `${robotState.left}px`
    );
  }
}

function testRotateRobotLeft() {
  robotState.angle = 0;
  rotateRobotLeft();
  return robotState.angle === -90 && robotState.facing === "down";
}

function testRotateRobotRight() {
  robotState.angle = 0;
  rotateRobotRight();
  return robotState.angle === 90 && robotState.facing === "up";
}

function testMovementOutOfBounds() {
  const outOfBoundsTop = movementOutOfBounds(3, 0);
  const outOfBoundsBottom = movementOutOfBounds(3, 6);
  const outOfBoundsLeft = movementOutOfBounds(0, 3);
  const outOfBoundsRight = movementOutOfBounds(6, 3);
  const inBounds = movementOutOfBounds(3, 3);
  return outOfBoundsTop && outOfBoundsBottom && outOfBoundsLeft && outOfBoundsRight && !inBounds;
}

function testResizeUpdatesPosition() {
  window.innerWidth = SCREENBREAK_SIZE - 1;
  window.dispatchEvent(new Event("resize"));
  const smallScreenTop = robotState.top;
  const smallScreenLeft = robotState.left;

  window.innerWidth = SCREENBREAK_SIZE + 1;
  window.dispatchEvent(new Event("resize"));
  const largeScreenTop = robotState.top;
  const largeScreenLeft = robotState.left;

  return (
    smallScreenTop === INITAL_TOP_SMALL &&
    smallScreenLeft === INITAL_LEFT_SMALL &&
    largeScreenTop === INITAL_TOP_LARGE &&
    largeScreenLeft === INITAL_LEFT_LARGE
  );
}

function testAngleNormalisation() {
  return normaliseAngle(450) === 90 && normaliseAngle(-90) === 270 && normaliseAngle(360) === 0;
}

function testButtonsAndKeyPressesTriggerMovement() {
  const fakeEvent = { key: "ArrowUp" };

  document.dispatchEvent(new KeyboardEvent("keyup", fakeEvent));
  const moved = robotState.col !== INITIAL_COL || robotState.row !== INITIAL_ROW;

  return moved;
}

function resetRobot() {
  robotState.top = 225;
  robotState.left = 225;
  robotState.col = 3;
  robotState.row = 3;
  robotState.angle = 0;
  robotState.facing = "left";
  robotState.movementSize = 100;

  updateRobotElementPosition(robotState.top, robotState.left);
  updateRobotElementRotation(robotState.angle);
}

function runTests() {
  console.log("TESTS:");
  console.log(testMoveRobotForward("up") ? "✅" : "❌", "Robot moves forward when facing up.");
  console.log(testMoveRobotForward("down") ? "✅" : "❌", "Robot moves forward when facing down.");
  console.log(testMoveRobotForward("left") ? "✅" : "❌", "Robot moves forward when facing left.");
  console.log(testMoveRobotForward("right") ? "✅" : "❌", "Robot moves forward when facing right.");
  console.log(testRotateRobotLeft() ? "✅" : "❌", "Robot rotates left.");
  console.log(testRotateRobotRight() ? "✅" : "❌", "Robot rotates right.");
  console.log(testMovementOutOfBounds() ? "✅" : "❌", "Detects if movement is out of bounds.");
  console.log(testResizeUpdatesPosition() ? "✅" : "❌", "Updates robot on screen resize.");
  console.log(testAngleNormalisation() ? "✅" : "❌", "Angle is correctly normalised.");
  console.log(testButtonsAndKeyPressesTriggerMovement() ? "✅" : "❌", "Buttons and key presses trigger movement.");
  resetRobot();
  console.log("END TESTS.");
}

const testButton = document.querySelector("#run-tests");
testButton.addEventListener("click", () => runTests());
