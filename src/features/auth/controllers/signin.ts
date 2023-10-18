import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { config } from '@root/config';
import JWT from 'jsonwebtoken';
import { authService } from '@services/db/auth.service';
import { BadRequestError } from '@globals/helpers/error-handler';
import { loginSchema } from '@auth/schemes/sign-in';
import { joiValidation } from '@globals/decorators/joi-validation.decorators';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@services/db/user.service';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);

    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(password);

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);

    const userJwt: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      config.JWT_TOKEN!
    );

    req.session = { jwt: userJwt };
    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser!._id,
      username: existingUser!.username,
      email: existingUser!.email,
      avatarColor: existingUser!.avatarColor,
      uId: existingUser!.uId,
      createdAt: existingUser!.createdAt
    } as IUserDocument;
    res.status(HTTP_STATUS.OK).json({
      message: 'User Signing in successfully',
      user: userDocument,
      token: userJwt
    });
  }
}
