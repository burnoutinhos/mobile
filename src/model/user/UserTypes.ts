
import * as yup from "yup";
import { EnumLanguage } from "../../services/Enums";


const UserSchema = yup.object().shape({
    name: yup.string().required("Nome é obrigatório"),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    password: yup.string().min(8, "Senha deve ter pelo menos 8 caracteres").required("Senha é obrigatória"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), "Senha não confere"])
        .label("Confirmação de senha")
        .required("Confirmação de senha é obrigatória"),
    language: yup
        .mixed<EnumLanguage>()
        .oneOf(Object.values(EnumLanguage) as EnumLanguage[], "Idioma inválido")
        .optional(),
    profileImage: yup.string().optional()

})

// Schema para edição - senha é opcional
const UserEditSchema = yup.object().shape({
    name: yup.string().required("Nome é obrigatório"),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    password: yup.string()
        .test('password-length', 'Senha deve ter pelo menos 8 caracteres', function(value) {
            if (!value || value.length === 0) return true;
            return value.length >= 8;
        }),
    confirmPassword: yup.string()
        .test('passwords-match', 'Senha não confere', function(value) {
            const { password } = this.parent;
            if (!password || password.length === 0) return true;
            return value === password;
        })
        .test('confirm-required', 'Confirmação de senha é obrigatória', function(value) {
            const { password } = this.parent;
            if (!password || password.length === 0) return true;
            return !!value;
        })
}).noUnknown(false)

type UserType = yup.InferType<typeof UserSchema>;

const emptyUserForm: UserType = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    language: EnumLanguage.PTBR,
    profileImage: ""
}

export {UserSchema, UserEditSchema, UserType, emptyUserForm}
