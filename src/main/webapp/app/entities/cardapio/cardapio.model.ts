import { IRestaurante } from 'app/entities/restaurante/restaurante.model';
import { IPrato } from 'app/entities/prato/prato.model';

export interface ICardapio {
  id?: number;
  nome?: string | null;
  restaurante?: IRestaurante | null;
  pratoes?: IPrato[] | null;
}

export class Cardapio implements ICardapio {
  constructor(
    public id?: number,
    public nome?: string | null,
    public restaurante?: IRestaurante | null,
    public pratoes?: IPrato[] | null
  ) {}
}

export function getCardapioIdentifier(cardapio: ICardapio): number | undefined {
  return cardapio.id;
}
