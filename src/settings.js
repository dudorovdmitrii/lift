export const initialFloor = parseInt(localStorage.getItem('floor')) || 0;
export const initialQueue = JSON.parse(localStorage.getItem('queue')) || [];
export const floorCount = 10;
export const liftCount = 1;

export const blinkCount = 3;
export const blinkSettings = {
  duration: 3000,
  iteration: 1
}