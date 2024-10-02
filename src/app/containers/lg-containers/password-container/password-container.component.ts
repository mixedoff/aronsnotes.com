import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Import this module

@Component({
  selector: 'app-password-container',
  standalone: true,
  imports: [],
  templateUrl: './password-container.component.html',
  styleUrl: './password-container.component.css',
})
export class PasswordContainerComponent {
  inputControl = new FormControl('');
  @Output() inputSubmitted = new EventEmitter<void>();

  checkInput(value: string) {
    if (value === '1111') {
      console.log('Input is exactly 1111');
      this.inputSubmitted.emit();
    } else {
      console.log(`Input is ${value}`);
      // Handle other cases if needed
    }
  }

  // ngOnInit() {
  //   this.inputControl.valueChanges.subscribe((value) => {
  //     console.log(value);
  //     // Perform actions on input change
  //   });
  // }

  // checkInput() {
  //   if (this.inputControl.value === '1111') {
  //     console.log('Input is exactly 1111');
  //     // Perform your desired action here
  //   } else {
  //     console.log(`'Input is' ${this.inputControl.value}`);
  //   }
  // }
}