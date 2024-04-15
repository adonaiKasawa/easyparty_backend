import { registerDecorator, ValidationOptions } from 'class-validator';
import * as zxcvbn from 'zxcvbn';

export function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) {
            this.error = 'Mot de passe vide.';
            return true;
          }
          const result = zxcvbn(value);
          console.log(result.score);

          if (result.score === 0) {
            this.error = 'Le mot de passe est trop faible.';
            return false;
          }
          return true;
        },
        defaultMessage(): string {
          return this.error || `Quelque chose s'est mal passé.`;
        },
      },
    });
  };
}
