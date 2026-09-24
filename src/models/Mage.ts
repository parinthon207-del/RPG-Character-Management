import { Character, CharacterClass } from './Character';

export class Mage extends Character {
  public override attack(target: Character): number {
    const damage = Math.max(1, this.getAttackPower() + 35 - Math.floor(target.getDefense() * 0.25));
    target.takeDamage(damage);
    return damage;
  }

  public override getClassName(): CharacterClass { return 'Mage'; }
  public override getSpecialSkill(): string { return 'Arcane Blast'; }
}
