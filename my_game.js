const load_images = () => {
  // Pain
  pain_img = new Image();
  pain_img.src = "/public/Pain.png";

  // Villain
  villain_img = new Image();
  villain_img.src = "/public/Villain.png";

  // Rinnegan
  kurama_img = new Image();
  kurama_img.src = "/public/Kurama.png";
};

const create_characters = () => {
  //Pain Character the starting point
  pain = {
    width: 100,
    height: 150,
    x: 0,
    y: Height / 2 - 75,
    speed: 0,
  };

  // Villain Class
  class Villain {
    constructor(x, y, speed, penalty) {
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.penalty = penalty;
    }
    width = 100;
    height = 100;
  }

  //Villain Objects
  villain1 = new Villain(250, 0, 10, 10);
  villain2 = new Villain(550, 0, 15, 20);
  villain3 = new Villain(850, 0, 20, 30);
  villain_list = [villain1, villain2, villain3];

  // Kurama the ending point
  kurama = {
    x: 1100,
    y: Height / 2 - 75,
    width: 200,
    height: 150,
  };
};

const initialize_objects = () => {
  // Get canvas from index.html
  canvas_game = document.getElementById("canvas_game");

  Width = 1300;
  Height = 660;

  canvas_game.width = Width;
  canvas_game.height = Height;

  canvas_game.style.backgroundImage = "url('/public/Space.jpg')";
  canvas_game.style.backgroundSize = "cover";

  // Total score of the game
  Score = 0;

  // Create marker to draw
  marker = canvas_game.getContext("2d");
  marker.font = "20px Verdana";

  // Create gradient
  gradient = marker.createLinearGradient(0, 0, canvas_game.width, 0);
  gradient.addColorStop("0", " magenta");
  gradient.addColorStop("0.5", "blue");
  gradient.addColorStop("1.0", "red");

  // Load All images
  load_images();

  // Create Character
  create_characters();

  // Add event listener
  document.addEventListener("keydown", (event) => {
    if (event.keyCode == 37) pain.speed = -15;
    else if (event.keyCode == 39) pain.speed = 15;
  });

  document.addEventListener("keyup", (event) => {
    pain.speed = 0;
  });

  // Offset value for Pain and Kurama
  Offset = 30;
};

const draw_objects = () => {
  //First Clear the screen
  marker.clearRect(0, 0, Width, Height);

  // Fill with gradient
  marker.fillStyle = gradient;
  marker.fillText(`Score ${Score}`, 20, 40);

  // Draw Pain
  marker.drawImage(pain_img, pain.x, pain.y, pain.width, pain.height);

  // Draw Villain
  villain_list.forEach((villain) => {
    marker.drawImage(
      villain_img,
      villain.x,
      villain.y,
      villain.width,
      villain.height
    );
  });

  // Draw Rinnegan
  marker.drawImage(kurama_img, kurama.x, kurama.y, kurama.width, kurama.height);
};

const reached = () => {
  clearInterval(interval);
  alert(`Game is Over!!!. Your Score is ${Score}`);
  draw_objects();
};

const intersection = (box1, box2) => {
  if (
    box1.x + box1.width < box2.x + Offset ||
    box1.y + box1.height < box2.y + Offset
  )
    return false;
  if (
    box2.x + box2.width < box1.x + Offset ||
    box2.y + box2.height < box1.y + Offset
  )
    return false;
  return true;
};

const update_objects = () => {
  villain_list.forEach((villain) => {
    villain.y += villain.speed;
    if (villain.y <= 0 || villain.y + villain.height >= Height)
      villain.speed *= -1;
  });

  if (pain.speed < 0) {
    if (pain.x + pain.speed >= 0) {
      Score += pain.speed;
      pain.x += pain.speed;
    } else {
      Score -= pain.x;
      pain.x = 0;
    }
  } else if (pain.speed > 0) {
    if (pain.x + pain.width + pain.speed - Offset <= kurama.x) {
      pain.x += pain.speed;
      Score += pain.speed;
    } else {
      Score += kurama.x - pain.x - pain.width + Offset;
      pain.x = kurama.x - pain.width + Offset;
      reached();
    }
  }

  villain_list.forEach((villain) => {
    if (intersection(pain, villain)) Score -= villain.penalty;
    if (Score < 0) {
      Score = 0;
      reached();
    }
  });
};

const game_loop = () => {
  // Put  and aliens
  draw_objects();

  // Update Objects
  update_objects();
};

initialize_objects();
const interval = setInterval(game_loop, 50);
