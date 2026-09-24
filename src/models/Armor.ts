import { Item } from './Item';

export class Armor extends Item {
  public override use(): string {
    return `${this.getName()} equipped: +${this.getValue()} defense.`;
  }
}
