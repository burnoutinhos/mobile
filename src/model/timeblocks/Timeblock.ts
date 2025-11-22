import * as yup from "yup";

const MaxMinutesSchema = yup.object().shape({
    max : yup.number().required("Tempo máximo deve ser preenchido").min(1, "O mínimo é de um minuto")
})

type MaxMinutesType = yup.InferType<typeof MaxMinutesSchema>

export {MaxMinutesType, MaxMinutesSchema};