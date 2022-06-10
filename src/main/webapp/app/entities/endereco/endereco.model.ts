import { IRestaurante } from 'app/entities/restaurante/restaurante.model';

export interface IEndereco {
  id?: number;
  rua?: string | null;
  restaurante?: IRestaurante | null;
}

export class Endereco implements IEndereco {
  constructor(public id?: number, public rua?: string | null, public restaurante?: IRestaurante | null) {}
}

export function getEnderecoIdentifier(endereco: IEndereco): number | undefined {
  return endereco.id;
}
