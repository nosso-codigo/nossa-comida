import { IEndereco } from 'app/entities/endereco/endereco.model';
import { ICardapio } from 'app/entities/cardapio/cardapio.model';

export interface IRestaurante {
  id?: number;
  nome?: string | null;
  endereco?: IEndereco | null;
  cardapio?: ICardapio | null;
}

export class Restaurante implements IRestaurante {
  constructor(public id?: number, public nome?: string | null, public endereco?: IEndereco | null, public cardapio?: ICardapio | null) {}
}

export function getRestauranteIdentifier(restaurante: IRestaurante): number | undefined {
  return restaurante.id;
}
