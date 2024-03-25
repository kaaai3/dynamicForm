import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormService } from "../services/form-data.service";
import { customInputs } from "../inputs/inputs.component";

export interface FormStructure {
  type: string;
  key: string;
  validations: any;
  data: any;
  component?: any;
  shouldShowWhen?: string[];
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

    this.forms = customFormStructure.map(({ type, key, validations, data }) => ({
      type,
      component: customInputs.find(input => input.type === type)?.component,
      key,
      validations,
      data
    }));

    console.log(this.forms)
    let sessionData = sessionStorage.getItem('formData');
    if (sessionData) {
      this.parsedData = JSON.parse(sessionData);
    }


     let formGroup: { [key: string]: any } = {};
    this.forms.forEach((control: FormStructure) => {
      let controlValidators: any[] = [];

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
    console.log(this.dynamicForm)
  }

  onSubmit() {
    console.log(this.parsedData);
    const formValues = this.dynamicForm.value;
    const filteredFormValues = Object.fromEntries(
      Object.entries(formValues).filter(([key, value]) => value && value !== '')
    );

    const isNotEmpty = Object.values(filteredFormValues).some(value => value && value !== '');

    if (isNotEmpty) {
      sessionStorage.setItem('formData', JSON.stringify(filteredFormValues));
    }
  }

}
