import { EnumLanguage } from "../../services/Enums";

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    language: EnumLanguage;
    profileImage: string;
}
