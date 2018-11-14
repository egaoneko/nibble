import {PictureInterface} from './picture.inteface';
import { Role } from '../enum/index';

export interface UserInterface {
  id: number | null;
  email: string;
  name: string;
  picture: PictureInterface | null;
  role: Role | null;
}