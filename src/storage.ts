import { Character, CharacterClass } from './models/Character';
import { Warrior } from './models/Warrior';
import { Mage } from './models/Mage';
import { Archer } from './models/Archer';
import { Item, ItemType } from './models/Item';
import { Weapon } from './models/Weapon';
import { Armor } from './models/Armor';
import { Potion } from './models/Potion';
import { characterToJSON, itemToJSON } from './data/defaults';

const CHAR_KEY = 'rpg-oop-characters';
const ITEM_KEY = 'rpg-oop-items';
const HISTORY_KEY = 'rpg-oop-history';

export interface BattleHistory {
  id: string;
  date: string;
  winner: string;
  loser: string;
  rounds: number;
}

export function saveCharacters(characters: Character[]): void {
  localStorage.setItem(CHAR_KEY, JSON.stringify(characters.map(characterToJSON)));
}

export function loadCharacters(): Character[] {
  const raw = localStorage.getItem(CHAR_KEY);
  if (!raw) return [];
  try {
    const rows = JSON.parse(raw) as any[];
    return rows.map(row => makeCharacter(row.className as CharacterClass, row));
  } catch {
    return [];
  }
}

export function makeCharacter(className: CharacterClass, data: any): Character {
  const common: [
    string,
    string,
    number,
    number,
    number,
    number,
    number,
    string
  ] = [
    String(data.id),
    String(data.name || 'Unnamed'),
    Number(data.level) || 1,
    Number(data.hp) || 1,
    Number(data.maxHp) || 1,
    Number(data.attackPower) || 1,
    Number(data.defense) || 1,
    String(data.description || '')
  ];

  if (className === 'Mage') return new Mage(...common);
  if (className === 'Archer') return new Archer(...common);
  return new Warrior(...common);
}

export function saveItems(items: Item[]): void {
  localStorage.setItem(ITEM_KEY, JSON.stringify(items.map(itemToJSON)));
}

export function loadItems(): Item[] {
  const raw = localStorage.getItem(ITEM_KEY);
  if (!raw) return [];
  try {
    const rows = JSON.parse(raw) as any[];
    return rows.map(row => makeItem(row.type as ItemType, row));
  } catch {
    return [];
  }
}

export function makeItem(type: ItemType, data: any): Item {
  const args = [data.id, data.name, type, Number(data.value) || 0, data.description || ''] as const;
  if (type === 'Armor') return new Armor(...args);
  if (type === 'Potion') return new Potion(...args);
  return new Weapon(...args);
}

export function saveHistory(history: BattleHistory[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function loadHistory(): BattleHistory[] {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as BattleHistory[]; } catch { return []; }
}
