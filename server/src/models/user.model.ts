import {Entity, property, model} from '@loopback/repository';
import {Picture} from './picture.model';
import {UserInterface} from '../shared/domain/inteface/user.inteface';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
  })
  pictureId: number;
}