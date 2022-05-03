import { useEffect, useState } from "react";

export interface Validator<T = any> {
  key: string;
  message: string;
  value: T;
  validate: () => boolean;
}

export interface ArrayValidator<T = string> {
  key: string;
  message: string;
  value: T[];
  validate: (value?: T, idx?: number) => boolean;
}

export const useValidationErrors = ({ validators }: { validators: (Validator | ArrayValidator)[] }) => {
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(
    () => {
      const ve = { ...validationErrors };
      const blacklist: string[] = [];

      // For each validator, execute validate function to see if the error was cleared
      validators.forEach((validator) => {
        if (validator.value instanceof Array) {
          validator.value.forEach((e, i) => {
            !validator.validate(e, i) && blacklist.push(`${validator.key}.${i}`);
          });
          return;
        }

        validator.validate() && delete ve[validator.key];
      });

      Object.keys(ve)
        .filter((key) => key.includes(".") && !blacklist.includes(key))
        .forEach((key) => delete ve[key]);
      setValidationErrors(ve);
    },
    validators.map((v) => v.value)
  );

  function getValueValidationError(key: string): string | undefined {
    return validationErrors[key];
  }

  function getArrayValidationError(key: string, idx: number): string {
    const k = Object.keys(validationErrors)
      .filter((ve) => ve.includes(`${key}.`))
      .find((ve) => parseInt(ve.split(".")[1]) === idx);
    if (!k) {
      return "";
    }

    return validationErrors[k];
  }

  function checkValidationErrors() {
    const ve = {};

    // For each validator, execute validate function to see if there is at least one error
    validators.forEach((validator) => {
      if (validator.value instanceof Array) {
        validator.value.forEach((e, i) => {
          if (Object.keys(ve).includes(`${validator.key}.${i}`)) {
            return;
          }

          !validator.validate(e, i) && (ve[`${validator.key}.${i}`] = validator.message);
        });
        return;
      }

      if (Object.keys(ve).includes(validator.key)) {
        return;
      }

      !validator.validate() && (ve[validator.key] = validator.message);
    });

    // End of validation error checking
    console.log("Validation errors: ", ve);
    setValidationErrors(ve);
    if (Object.keys(ve).length > 0) {
      // There are some validation errors
      return false;
    }

    return true;
  }

  function clearValidationErrors() {
    setValidationErrors({});
  }

  return {
    validationErrors,
    getValueValidationError,
    getArrayValidationError,
    checkValidationErrors,
    clearValidationErrors,
  };
};
