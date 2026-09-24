import { Character } from '../models/Character';
import { Warrior } from '../models/Warrior';
import { Mage } from '../models/Mage';
import { Archer } from '../models/Archer';
import { Item } from '../models/Item';
import { Weapon } from '../models/Weapon';
import { Armor } from '../models/Armor';
import { Potion } from '../models/Potion';

export function defaultCharacters(): Character[] {
  return [
    new Warrior('c1', 'Arthas', 10, 1200, 1200, 230, 90, 'Front-line knight with high defense.'),
    new Mage('c2', 'Luna', 8, 820, 820, 280, 45, 'Arcane caster with high magic damage.'),
    new Archer('c3', 'Robin', 9, 950, 950, 250, 65, 'Ranged attacker with balanced stats.')
  ];
}

export function defaultItems(): Item[] {
  return [
    new Weapon('i1', 'Iron Sword', 'Weapon', 35, 'A reliable beginner sword.'),
    new Armor('i2', 'Knight Armor', 'Armor', 30, 'Heavy armor for frontline fighters.'),
    new Potion('i3', 'Health Potion', 'Potion', 250, 'Restores 250 HP.')
  ];
}

export function characterToJSON(c: Character) {
  return {
    id: c.getId(), name: c.getName(), level: c.getLevel(), hp: c.getHp(), maxHp: c.getMaxHp(),
    attackPower: c.getAttackPower(), defense: c.getDefense(), description: c.getDescription(), className: c.getClassName()
  };
}

export function itemToJSON(i: Item) {
  return { id: i.getId(), name: i.getName(), type: i.getType(), value: i.getValue(), description: i.getDescription() };
}
