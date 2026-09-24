import { Item } from './Item';

export class Weapon extends Item {
  public override use(): string {
    return `${this.getName()} equipped: +${this.getValue()} attack.`;
  }
}
