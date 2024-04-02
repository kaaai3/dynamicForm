import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormService } from "../services/form-data.service";
import { customInputs } from "../inputs/inputs.component";
import { Observable } from "rxjs";

export interface FormStructure {
  type: string;
  key: string;
  validations: any;
  data: any;
  component?: any;
  shouldShowWhen?: {};
  visibilityCondition?: (formGroup: FormGroup) => Observable<boolean>;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit {
  dynamicForm!: FormGroup;
  parsedData: { [key: string]: any } = {};

  forms: FormStructure[] = [];

  constructor(private formBuilder: FormBuilder, public formService: FormService) { }

  ngOnInit() {
    const customFormStructure = this.formService.getCustomFormStructure();

    // Create form structure and map to components
    this.forms = customFormStructure.map(({ type, key, validations, data, visibilityCondition }) => ({
      type,
      component: customInputs.find(input => input.type === type)?.component,
      key,
      validations,
      data,
      visibilityCondition,
    }));

    // Get form data from session storage
    let sessionData = sessionStorage.getItem('formData');
    if (sessionData) {
      this.parsedData = JSON.parse(sessionData);
    }

    // Create form group
    let formGroup: { [key: string]: any } = {};
    this.forms.forEach((control: FormStructure) => {
      let controlValidators: any[] = [];

      controlValidators.push(Validators.required);

       if (control.validations) {
         control.validations.forEach((validation: any) => {
           controlValidators.push(Validators.required);
           if (validation.validator === 'email') controlValidators.push(Validators.email);
           // Add more built-in validators as needed
         });
       }

       formGroup[control.key] = [this.parsedData[control.key] || '', controlValidators];
    });

     this.dynamicForm = this.formBuilder.group(formGroup);

    this.updateVisibilityConditions();
    //
    // // Call the function whenever the form values change
    this.dynamicForm.valueChanges.subscribe((value) => {
      this.updateVisibilityConditions();
      console.log(value)
    });

  }

  onSubmit() {
    console.log(this.parsedData);
    console.log(this.dynamicForm);
    const formValues = this.dynamicForm.value;
    const filteredFormValues = Object.fromEntries(
      Object.entries(formValues).filter(([key, value]) => value && value !== '')
    );

    const isNotEmpty = Object.values(filteredFormValues).some(value => value && value !== '');

    if (isNotEmpty) {
      sessionStorage.setItem('formData', JSON.stringify(filteredFormValues));
    }
  }

  updateVisibilityConditions() {
    this.forms.forEach(form => {
      if (form.visibilityCondition) {
        form.visibilityCondition(this.dynamicForm).subscribe(isVisible => {
          const formControl = this.dynamicForm.get(form.key);
          if (isVisible && formControl?.disabled) {
            formControl.enable({ emitEvent: false });
          } else if (!isVisible && formControl?.enabled) {
            formControl.disable({ emitEvent: false });
          }
        });
      } else {
        // If there is no visibility condition, the form control should be enabled by default
        // this.dynamicForm.get(form.key)?.enable({ emitEvent: false });
      }
    });
  }


}
