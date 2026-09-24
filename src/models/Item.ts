export type ItemType = 'Weapon' | 'Armor' | 'Potion';

export abstract class Item {
  private id: string;
  private name: string;
  private type: ItemType;
  private value: number;
  private description: string;

  constructor(id: string, name: string, type: ItemType, value: number, description: string) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.value = value;
    this.description = description;
  }

  public getId(): string { return this.id; }
  public getName(): string { return this.name; }
  public getType(): ItemType { return this.type; }
  public getValue(): number { return this.value; }
  public getDescription(): string { return this.description; }

  public abstract use(): string;
}
