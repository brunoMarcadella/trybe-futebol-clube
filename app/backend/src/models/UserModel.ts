import { IUser } from '../Interfaces/users/IUser';
import SequelizeUser from '../database/models/SequelizeUser';
import { IUserModel } from '../Interfaces/users/IUserModel';

export default class UserModel implements IUserModel {
  private model = SequelizeUser;

  async findByEmail(email: IUser['email']): Promise<IUser | null> {
    const user = await this.model.findOne({ where: { email } });
    if (!user) return null;
    const { id, password, username, role } = user;
    return { id, email, password, username, role };
  }

  // async findAll(): Promise<ITeam[]> {
  //   const dbData = await this.model.findAll();
  //   return dbData;
  // }

  // async findById(id: ITeam['id']): Promise<ITeam | null> {
  //   const dbData = await this.model.findByPk(id);
  //   if (dbData == null) return null;

  //   return dbData;
  // }
}
