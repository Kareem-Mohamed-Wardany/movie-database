import { AbstractControl } from '@angular/forms';

export function isValuesEqual(controlNameOne: string, controlNameTwo: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlNameOne)?.value;
    const val2 = control.get(controlNameTwo)?.value;
    if (val1 === val2) {
      return null;
    }
    return { valuesNotEqual: true };
  };
}
