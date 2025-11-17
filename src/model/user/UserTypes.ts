
import * as yup from "yup";
import { EnumLanguage } from "../../services/Enums";


const UserSchema = yup.object().shape({
    name: yup.string().optional(),
    email: yup.string().email("Email inválido").optional(),
    password: yup.string().optional(),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), undefined])
        .optional(),
    language: yup
        .mixed<EnumLanguage>()
        .oneOf(Object.values(EnumLanguage) as EnumLanguage[], "Idioma inválido")
        .optional(),
    profile_image: yup.string().optional()
    
})

type UserType = yup.InferType<typeof UserSchema>;

const emptyUserForm: UserType = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    language: EnumLanguage.PTBR,
    profile_image: ""
}

export {UserSchema, UserType, emptyUserForm}