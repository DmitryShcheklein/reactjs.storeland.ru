import Joi from 'joi';
import chalk from 'chalk';

const envSchema = Joi.object({
  CURRENT_SITE: Joi.string().uri().required().messages({
    'string.uri': 'должен быть валидным URL адресом',
    'any.required': 'отсутствует в .env файле',
    'string.empty': 'не может быть пустым',
  }),

  SECRET_KEY: Joi.string().min(6).required().messages({
    'string.min': 'должен содержать минимум {#limit} символов',
    'any.required': 'отсутствует в .env файле',
    'string.empty': 'не может быть пустым',
  }),

  PORT: Joi.number().port().required().messages({
    'number.port': 'должен быть валидным портом (0-65535)',
    'any.required': 'отсутствует в .env файле',
  }),

  API_BASE_URL: Joi.string().required().pattern(/^\//).messages({
    'string.pattern.base': 'должен начинаться с /',
    'string.empty': 'не может быть пустым',
    'any.required': 'отсутствует в .env файле',
  }),
}).unknown(); // разрешаем дополнительные переменные в .env

export function validateEnv() {
  const { error, value } = envSchema.validate(process.env, {
    abortEarly: false,
  });

  if (error) {
    console.error(chalk.red('\n⛔ Ошибки валидации .env файла:'));

    error.details.forEach(({ path, message }) => {
      console.error(`  • ${chalk.red(path[0])} ${message}`);
    });

    console.log(
      chalk.gray(
        '\nПроверьте файл .env и убедитесь, что все переменные заданы корректно.\n',
      ),
    );
    process.exit(1);
  }

  // Обновляем process.env значениями после валидации (включая дефолтные)
  Object.assign(process.env, value);

  return true;
}
