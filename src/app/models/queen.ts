export class Queen {
  position: Array<number> = [];
  health = 100;
  attack = 50;
  defense = 50;
  type: number;
  selected = false;
  luck = parseFloat(Math.random().toFixed(2));

  constructor(type: number, x: number , y: number){
    this.type = type;
    this.position.push(x, y);
  }
}

