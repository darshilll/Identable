import { Joi } from "utilities/schemaValidate";

export const getPresetAdCreativeTemplateSchema = Joi.object({
    adType: Joi.string().required().label("adType"),
});
