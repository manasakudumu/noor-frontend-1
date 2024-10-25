import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface UserDoc extends BaseDoc {
  username: string;
  password: string;
  //captcha: string;  Including CAPTCHA
}

export default class AuthenticatingConcept {
  public readonly users: DocCollection<UserDoc>;
  constructor(collectionName: string) {
    this.users = new DocCollection<UserDoc>(collectionName);
    void this.users.collection.createIndex({ username: 1 });
  }

  // Commenting out the CAPTCHA verification
  /*
  async verifyCaptcha(captchaToken: string): Promise<boolean> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
    const response = await axios.post(verificationUrl);
    if (!response.data.success) {
      throw new NotAllowedError("CAPTCHA validation failed!");
    }
    return true; 
  }
  */

  async create(username: string, password: string) {
    await this.assertGoodCredentials(username, password);
    const _id = await this.users.createOne({ username, password });
    return { msg: "User created successfully!", user: await this.users.readOne({ _id }) };
  }

  private redactPassword(user: UserDoc): Omit<UserDoc, "password"> {
    if (user.password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }
    // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async getUserById(_id: ObjectId) {
    const user = await this.users.readOne({ _id });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    }
    return this.redactPassword(user);
  }

  async getUserByUsername(username: string) {
    const user = await this.users.readOne({ username });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    }
    return this.redactPassword(user);
  }

  async idsToUsernames(ids: ObjectId[]) {
    const users = await this.users.readMany({ _id: { $in: ids } });
    const idToUser = new Map(users.map((user) => [user._id.toString(), user]));
    return ids.map((id) => idToUser.get(id.toString())?.username ?? "DELETED_USER");
  }

  async getUsers(username?: string) {
    const filter = username ? { username } : {};
    const users = (await this.users.readMany(filter)).map(this.redactPassword);
    return users;
  }

  async authenticate(username: string, password: string) {
    const user = await this.users.readOne({ username, password });
    if (!user) {
      throw new NotAllowedError("Username or password is incorrect.");
    }
    return { msg: "Successfully authenticated.", _id: user._id };
  }

  async updateUsername(_id: ObjectId, username: string) {
    await this.assertUsernameUnique(username);
    await this.users.partialUpdateOne({ _id }, { username });
    return { msg: "Username updated successfully!" };
  }

  async updatePassword(_id: ObjectId, currentPassword: string, newPassword: string) {
    const user = await this.users.readOne({ _id });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (user.password !== currentPassword) {
      throw new NotAllowedError("The given current password is wrong!");
    }

    await this.users.partialUpdateOne({ _id }, { password: newPassword });
    return { msg: "Password updated successfully!" };
  }

  async delete(_id: ObjectId) {
    await this.users.deleteOne({ _id });
    return { msg: "User deleted!" };
  }

  async assertUserExists(_id: ObjectId) {
    const maybeUser = await this.users.readOne({ _id });
    if (maybeUser === null) {
      throw new NotFoundError(`User not found!`);
    }
  }

  // Commenting out the CAPTCHA logic in credential assertion for now
  private async assertGoodCredentials(username: string, password: string) {
    if (!username || !password) {
      throw new BadValuesError("Username and password must be non-empty!");
    }
    await this.assertUsernameUnique(username);
    // await this.assertCaptchaValid(captcha);
  }

  private async assertUsernameUnique(username: string) {
    const existingUser = await this.users.readOne({ username });
    if (existingUser) {
      throw new NotAllowedError(`User with username ${username} already exists!`);
    }
  }

  // Commenting out the CAPTCHA validation
  /*
  private async assertCaptchaValid(captcha: string) {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`, 
      {}, 
      {
        params: {
          secret: this.RECAPTCHA_SECRET_KEY,
          response: captcha,
        },
      }
    );

    const data = response.data;
    if (!data.success) {
      throw new NotAllowedError("CAPTCHA validation failed!");
    }
  } 
  */
}
