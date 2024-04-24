export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: string;
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IGoogleLogin {
  token: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IProfile {
  name: string;
  email: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}

export interface INewPassword {
  newPassword: string;
  repeatPassword: string;
}