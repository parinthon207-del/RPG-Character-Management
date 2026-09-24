import { Character, CharacterClass } from './Character';

export class Warrior extends Character {
  public override attack(target: Character): number {
    const damage = Math.max(1, this.getAttackPower() + this.getDefense() - Math.floor(target.getDefense() * 0.5));
    target.takeDamage(damage);
    return damage;
  }

  public override getClassName(): CharacterClass { return 'Warrior'; }
  public override getSpecialSkill(): string { return 'Shield Bash'; }
}
