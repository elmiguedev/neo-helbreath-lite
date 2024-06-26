import { Position } from "../../domain/Position";

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
  const newX = Math.floor(currentX + incrementX);
  const newY = Math.floor(currentY + incrementY);

  return { x: newX, y: newY };
};

const distanceBetweenPoints = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.floor(Math.sqrt(dx * dx + dy * dy));
}

const distanceBetween = (entity: Position, target: Position) => {
  return distanceBetweenPoints(
    entity.x,
    entity.y,
    target.x,
    target.y
  );
}

const lerpPosition = (x1: number, y1: number, x2: number, y2: number, t: number) => {
  return {
    x: x1 + (x2 - x1) * t,
    y: y1 + (y2 - y1) * t
  }
}

const moveTowardsTarget = (currentX: number, currentY: number, targetX: number, targetY: number, speed: number) => {
  const dx = targetX - currentX;
  const dy = targetY - currentY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= speed) {
    // Si estamos muy cerca del objetivo, simplemente movemos al jugador al objetivo
    return { x: targetX, y: targetY };
  } else {
    // Calculamos la proporción de movimiento en cada eje
    const ratio = speed / distance;
    const newX = currentX + dx * ratio;
    const newY = currentY + dy * ratio;
    return { x: newX, y: newY };
  }
};

export const Utils = {
  constantLerpPosition,
  distanceBetweenPoints,
  distanceBetween,
  lerpPosition,
  moveTowardsTarget
}