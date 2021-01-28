export class Soldier {
  position: Array<number> = [];
  health = 100;
  attack = 30;
  defense = 30;
  type: number;
  selected = false;
  luck: number = parseFloat(Math.random().toFixed(2));

  constructor(type: number, x: number, y: number) {
    this.type = type;
    this.position.push(x, y);
  }
}

