import Matter from "matter-js";

export function createConfetti(world: Matter.World, x: number, y: number, count = 20) {
  const colors = ['#f94144', '#f3722c', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];

  for (let i = 0; i < count; i++) {
    const width = Math.random() * 10 + 5; // Random width between 5 and 15
    const height = Math.random() * 10 + 5; // Random height between 5 and 15
    const angle = Math.random() * Math.PI * 2; // Random angle in radians

    const initialColor = colors[Math.floor(Math.random() * colors.length)];
    const confettiPiece = Matter.Bodies.rectangle(x, y, width, height, {
      angle,
      render: {
        fillStyle: initialColor, // Initial color
      },
    });

    // Apply a random velocity to the confetti piece
    const velocityX = (Math.random() - 0.5) * 20;
    const velocityY = (Math.random() - 0.5) * 20;

    Matter.Body.setVelocity(confettiPiece, { x: velocityX, y: velocityY });

    Matter.World.add(world, confettiPiece);

    // Set up fading logic
    let opacity = 1.0; // Initial opacity
    const fadeInterval = setInterval(() => {
      opacity -= 0.05; // Decrease opacity
      if (opacity <= 0) {
        clearInterval(fadeInterval); // Stop fading when fully transparent
        Matter.World.remove(world, confettiPiece); // Remove from world
      } else {
        // Update fillStyle with new opacity
        confettiPiece.render.fillStyle = `${initialColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
      }
    }, 50); // Update every 50ms
  }
}
