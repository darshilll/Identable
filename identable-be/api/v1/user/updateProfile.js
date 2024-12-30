import { Joi } from "utilities/schemaValidate";

export const updateProfileSchema = Joi.object({
  timezone: Joi.string().required().label("Timezone"),
  countryCode: Joi.string()
    .pattern(/^\+\d+$/)
    .optional()
    .label("Country Code")
    .messages({
      "string.pattern.base": "Country Code must start with '+' followed by digits.",
    }),
  phoneNumber: Joi.string()
    .pattern(/^\d{10,15}$/)
    .optional()
    .label("Phone Number")
    .messages({
      "string.pattern.base": "Phone Number must be between 10 to 15 digits.",
    }),
});
