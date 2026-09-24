import { Item } from './Item';

export class Potion extends Item {
  public override use(): string {
    return `${this.getName()} used: restores ${this.getValue()} HP.`;
  }
}
