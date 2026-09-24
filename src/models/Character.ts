export type CharacterClass = 'Warrior' | 'Mage' | 'Archer';

export abstract class Character {
  private id: string;
  private name: string;
  private level: number;
  private hp: number;
  private maxHp: number;
  private attackPower: number;
  private defense: number;
  private description: string;

  constructor(
    id: string,
    name: string,
    level: number,
    hp: number,
    maxHp: number,
    attackPower: number,
    defense: number,
    description: string
  ) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.hp = hp;
    this.maxHp = maxHp;
    this.attackPower = attackPower;
    this.defense = defense;
    this.description = description;
  }

  public getId(): string { return this.id; }
  public getName(): string { return this.name; }
  public getLevel(): number { return this.level; }
  public getHp(): number { return this.hp; }
  public getMaxHp(): number { return this.maxHp; }
  public getAttackPower(): number { return this.attackPower; }
  public getDefense(): number { return this.defense; }
  public getDescription(): string { return this.description; }

  public setName(name: string): void { this.name = name.trim(); }
  public setLevel(level: number): void { this.level = Math.max(1, Math.floor(level)); }
  public setDescription(description: string): void { this.description = description.trim(); }

  public takeDamage(amount: number): number {
    const damage = Math.max(0, Math.floor(amount));
    this.hp = Math.max(0, this.hp - damage);
    return damage;
  }

  public heal(amount: number): number {
    const healed = Math.max(0, Math.floor(amount));
    const before = this.hp;
    this.hp = Math.min(this.maxHp, this.hp + healed);
    return this.hp - before;
  }

  public resetHp(): void { this.hp = this.maxHp; }

  public levelUp(): void {
    this.level += 1;
    this.maxHp += 25;
    this.hp = this.maxHp;
    this.attackPower += 5;
    this.defense += 3;
  }

  // Abstraction: every subclass must implement its own attack behavior.
  public abstract attack(target: Character): number;
  public abstract getClassName(): CharacterClass;
  public abstract getSpecialSkill(): string;
}
