import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function alphanumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = /^[a-zA-Z0-9]*$/.test(value);
      return !isValid ? { alphanumeric: true } : null;
    };
  }