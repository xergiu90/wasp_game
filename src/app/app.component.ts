import {Component, OnInit} from '@angular/core';
import {Soldier} from './models/soldier';
import {Queen} from './models/queen';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  board = Array.from(Array(5), _ => Array(5).fill({}));
  activeBee: Queen | Soldier;
  messages: string[] = [];
  messagesQueenAtack = '';

  ngOnInit(): void {
    this.initialSetup();

  }

  initialSetup(): void {
    this.board = Array.from(Array(5), _ => Array(5).fill({type: 0}));
    this.board[0][1] = new Soldier(3, 0, 1);
    this.board[0][2] = new Queen(4, 0, 2);
    this.board[0][3] = new Soldier(3, 0, 3);
    this.board[1][2] = new Soldier(3, 1, 2);
    this.board[3][2] = new Soldier(1, 3, 2);
    this.board[4][1] = new Soldier(1, 4, 1);
    this.board[4][2] = new Queen(2, 4, 2);
    this.board[4][3] = new Soldier(1, 4, 3);
  }


  selectBee(x: number, y: number, square: Soldier | Queen): void {
    if ((square.type === 1 || square.type === 2) && !square.selected) {
      this.board.forEach(
        item => {
          item.forEach(
            insideitem => insideitem.selected = false
          );
        });

      square.selected = true;
      this.activeBee = square;
    } else if (this.activeBee && (this.activeBee.type === 1 || this.activeBee.type === 2)) {
      switch (square.type) {
        case 3:
          if (this.checkIfCanAtack(x, y)) {
            this.attackSoldier(square);
          }
          break;
        case 4:
          if (this.checkIfCanAtack(x, y)) {
            this.atackQueen(square);
          }
          break;
        case 0:
          this.moveBee(x, y, square);
          this.activeBee = Object.assign({type: 0});
          break;
      }
    } else {
      this.activeBee = Object.assign({type: 0});
      square.selected = false;
    }
  }


  moveBee(x: number, y: number, square: Soldier | Queen): void {
    this.messages.push('The bee from X:' + this.activeBee.position[0] + ' Y:' + this.activeBee.position[1] + ', moved to X:' + x + ' Y:' + y);
    this.board[this.activeBee.position[0]][this.activeBee.position[1]] = Object.assign({}, {type: 0});
    this.activeBee.position[0] = x;
    this.activeBee.position[1] = y;
    this.activeBee.selected = false;
    this.board[x][y] = Object.assign({}, this.activeBee);
  }

  checkIfCanAtack(x: number, y: number): boolean {
    const xDiff = this.activeBee.position[0] - x;
    const yDiff = this.activeBee.position[1] - y;
    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    if (distance < 2) {
      return true;
    } else {
      return false;
    }
  }

  attackSoldier(soldier: Soldier): void {
    const beeDamage: any = (this.activeBee.attack * this.activeBee.luck - soldier.defense * soldier.luck).toFixed(2);
    const waspDamage: any = (soldier.attack * soldier.luck - this.activeBee.defense * this.activeBee.luck).toFixed(2);
    soldier.health -= beeDamage;
    if (soldier.health <= 0) {
      this.board[soldier.position[0]][soldier.position[1]] = Object.assign({type: 0});
    }

    this.activeBee.health -= waspDamage;

    if (this.activeBee.health <= 0) {
      this.board[this.activeBee.position[0]][this.activeBee.position[1]] = Object.assign({type: 0});
    }

    soldier.attack -= 0.25 * beeDamage;
    this.activeBee.attack -= 0.25 * waspDamage;
    this.messages.push('The bee from X:' + this.activeBee.position[0] + ' Y:' + this.activeBee.position[1] + ', attacked with ' + beeDamage + ' damage, and the wasp from X:' + soldier.position[0] + ' Y:' + soldier.position[1] + ' responded with  ' + waspDamage + ' damage');
  }

  atackQueen(queen: Queen): void {
    const beeDamage: any = (this.activeBee.attack * this.activeBee.luck - queen.defense * queen.luck).toFixed(2);
    const waspDamage: any = (queen.attack * queen.luck - this.activeBee.defense * this.activeBee.luck).toFixed(2);
    queen.health -= beeDamage;
    if (queen.health <= 0) {
      this.board[queen.position[0]][queen.position[1]] = Object.assign({type: 0});
      alert('The wasp queen has been defeated');
    }

    this.activeBee.health -= waspDamage;

    if (this.activeBee.health <= 0) {
      this.board[this.activeBee.position[0]][this.activeBee.position[1]] = Object.assign({type: 0});
    }

    queen.attack -= 0.25 * beeDamage;
    this.activeBee.attack -= 0.25 * waspDamage;
    this.messagesQueenAtack = 'The bee from X:' + this.activeBee.position[0] + ' Y:' + this.activeBee.position[1] + ', attacked with ' + beeDamage + ' damage, and the queen  from X:' + queen.position[0] + ' Y:' + queen.position[1] + ' responded with  ' + waspDamage + ' damage';

    this.atackFromOtherSoldiers();


  }

  atackFromOtherSoldiers(): void {
    this.board.forEach(
      item => item.forEach(
        wasp => {
          if (wasp.type === 3) {
            if (this.checkIfCanAtack(wasp.position[0], wasp.position[1])) {
              const waspDamage: any = (wasp.attack * wasp.luck - this.activeBee.defense * this.activeBee.luck).toFixed(2);

              this.activeBee.health -= waspDamage;

              if (this.activeBee.health <= 0) {
                this.board[this.activeBee.position[0]][this.activeBee.position[1]] = Object.assign({type: 0});
              }

              this.activeBee.attack -= 0.25 * waspDamage;
              this.messagesQueenAtack += (' ---- The the wasp from X:' + wasp.position[0] + ' Y:' + wasp.position[1] + ' also attached with  ' + waspDamage + ' damage');
            }
          }
        }
      )
    );

    this.messages.push(this.messagesQueenAtack)
  }


}
