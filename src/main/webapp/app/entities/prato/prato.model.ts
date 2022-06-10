import { ICardapio } from 'app/entities/cardapio/cardapio.model';

export interface IPrato {
  id?: number;
  nome?: string | null;
  cardapio?: ICardapio | null;
}

export class Prato implements IPrato {
  constructor(public id?: number, public nome?: string | null, public cardapio?: ICardapio | null) {}
}

export function getPratoIdentifier(prato: IPrato): number | undefined {
  return prato.id;
}
