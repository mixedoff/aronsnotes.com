import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-start-container',
  standalone: true,
  imports: [],
  templateUrl: './start-container.component.html',
  styleUrl: './start-container.component.css',
})
export class StartContainerComponent {
  private intervalId: number | undefined;
  private isRed = true;
  @Output() enterPressed = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      console.log('Enter');
      this.enterPressed.emit();
    }
  }

  onEnter() {
    this.enterPressed.emit();
  }
  // event: { $event: any } | undefined;
  // onEnter($event: { $event: any } | undefined) {
  //   this.enterPressed.emit($event);
  //   console.log('enter');
  // }
  ngOnInit(): void {
    this.startColorChange();
  }

  ngOnDestroy(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }

  private startColorChange(): void {
    this.intervalId = window.setInterval((): void => {
      const textElement = document.getElementById('text');
      const innerContainer = document.getElementById('inner-container');
      const outerContainer = document.getElementById('outer-container');
      if (textElement && innerContainer && outerContainer) {
        textElement.style.color = this.isRed ? 'white' : '#6ffa1e';
        innerContainer.style.borderColor = this.isRed ? 'white' : '#6ffa1e';
        innerContainer.style.backgroundColor = this.isRed ? '#010689' : 'black';
        outerContainer.style.backgroundColor = this.isRed ? '#010689' : 'black';
        this.isRed = !this.isRed;
      }
    }, 600);
  }
}
