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
      if (textElement) {
        textElement.style.color = this.isRed ? 'white' : '#6ffa1e';
        this.isRed = !this.isRed;
      }
    }, 600);
  }
}
