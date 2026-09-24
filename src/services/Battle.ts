import { Character } from '../models/Character';

export interface BattleResult {
  winner: string;
  loser: string;
  rounds: number;
  log: string[];
}

export class Battle {
  public simulate(attacker: Character, defender: Character): BattleResult {
    attacker.resetHp();
    defender.resetHp();

    const log: string[] = [`⚔️ ${attacker.getName()} entered battle against ${defender.getName()}.`];
    let rounds = 0;
    let currentAttacker = attacker;
    let currentDefender = defender;

    while (attacker.getHp() > 0 && defender.getHp() > 0 && rounds < 30) {
      rounds += 1;
      const damage = currentAttacker.attack(currentDefender);
      log.push(`Round ${rounds}: ${currentAttacker.getName()} dealt ${damage} damage.`);

      if (currentDefender.getHp() <= 0) break;
      [currentAttacker, currentDefender] = [currentDefender, currentAttacker];
    }

    const winner = attacker.getHp() > 0 ? attacker : defender;
    const loser = winner === attacker ? defender : attacker;
    log.push(`🏆 ${winner.getName()} won after ${rounds} round(s).`);

    return { winner: winner.getName(), loser: loser.getName(), rounds, log };
  }
}
