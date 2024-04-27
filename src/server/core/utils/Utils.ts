import { Position } from "../../../domain/Position"

const getRandomHexColor = (): number => {
  return Math.floor(Math.random() * 16777215)
}

const getRandomIntBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const getRandomPositionByRadius = (radius: number) => {
  const x = getRandomIntBetween(-radius, radius)
  const y = getRandomIntBetween(-radius, radius)
  return { x, y }
}

const lerpPosition = (x1: number, y1: number, x2: number, y2: number, t: number) => {
  return {
    x: x1 + (x2 - x1) * t,
    y: y1 + (y2 - y1) * t
  }
}

const constantLerpPosition = (currentX: number, currentY: number, targetX: number, targetY: number, maxSpeed: number) => {
  const dx = targetX - currentX;
  const dy = targetY - currentY;

  // Calcular la distancia total
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Calcular la velocidad proporcional a la distancia
  const speed = Math.min(maxSpeed, distance);

  // Calcular los incrementos para x e y
  const incrementX = (dx / distance) * speed;
  const incrementY = (dy / distance) * speed;

  // Calcular y devolver la nueva posición
  const newX = currentX + incrementX;
  const newY = currentY + incrementY;

  return { x: newX, y: newY };
};


const distanceBetweenPoints = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

const distanceBetween = (entity:Position, target:Position) => {
  return distanceBetweenPoints(
    entity.x,
    entity.y,
    target.x,
    target.y
  );
}

const throwDice = (count:number, faces:number) => {
  let sum = 0;
  for (let i = 0; i < count; i++) {
    sum += getRandomIntBetween(1, faces);
  }
  return sum;
}

export const Utils = {
  getRandomHexColor,
  getRandomPositionByRadius,
  getRandomIntBetween,
  constantLerpPosition,
  lerpPosition,
  distanceBetweenPoints,
  distanceBetween,
  throwDice
}