import { Character, CharacterClass } from './Character';

export class Archer extends Character {
  public override attack(target: Character): number {
    const damage = Math.max(1, this.getAttackPower() + 20 - Math.floor(target.getDefense() * 0.35));
    target.takeDamage(damage);
    return damage;
  }

  public override getClassName(): CharacterClass { return 'Archer'; }
  public override getSpecialSkill(): string { return 'Piercing Arrow'; }
}
