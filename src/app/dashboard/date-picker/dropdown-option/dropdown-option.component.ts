import {
  Component,
  ElementRef,
  EventEmitter, HostBinding,
  HostListener,
  Input,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
export interface DropdownOption {
  label: string;
  value: any;
  disabled?: boolean;
}
@Component({
  selector: 'app-dropdown-option',
  templateUrl: './dropdown-option.component.html',
  styleUrls: ['./dropdown-option.component.css']
})
export class DropdownOptionComponent {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() disabled: boolean = false;
  @Input() selectedValue: any = null;
  @Input() resetThumbToCenter: boolean = true;

  @Input() minWidth: string = '0rem';
  @Input() maxWidth: string = '20rem';


  @Output() selectionChange = new EventEmitter<any>();

  @ViewChild('ulElement') ulRef!: ElementRef<HTMLUListElement>;
  @ViewChild('thumbElement') thumbRef!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollbarTrack') scrollbarTrackRef!: ElementRef<HTMLDivElement>;

  isOpen: boolean = false;
  selectedOption: DropdownOption | null = null;
  hasOverflow: boolean = false;

  private isDragging: boolean = false;
  private startY: number = 0;
  private startThumbTop: number = 0;
  private startScrollTop: number = 0;
  private scrollListener: (() => void) | null = null;

  constructor(private elementRef: ElementRef) {}

  @HostBinding('style.--dropdown-min-width')
  get cssMinWidth(): string {
    return this.minWidth;
  }

  @HostBinding('style.--dropdown-max-width')
  get cssMaxWidth(): string {
    return this.maxWidth;
  }



  ngOnInit(): void {
    this.syncSelectedOption();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedValue'] || changes['options'] || changes['placeholder']) {
      this.syncSelectedOption();
    }
  }

  private syncSelectedOption(): void {
    if (this.options && this.selectedValue !== null && this.selectedValue !== undefined) {
      this.selectedOption =
        this.options.find(opt => opt.value === this.selectedValue) || null;
    } else {
      this.selectedOption = null;
    }
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        setTimeout(() => {
          this.scrollToSelected();
          this.hasOverflow =
            this.ulRef.nativeElement.scrollHeight >
            this.ulRef.nativeElement.clientHeight;

          if (this.hasOverflow) {
            requestAnimationFrame(() => {
              const ul = this.ulRef.nativeElement;
              const thumb = this.thumbRef.nativeElement;
              const track = this.scrollbarTrackRef.nativeElement;
              const viewHeight = ul.clientHeight;
              const contentHeight = ul.scrollHeight;
              const trackHeight = track.offsetHeight;

              if (this.resetThumbToCenter) {
                thumb.classList.add('reset-mode');
                this.resetThumbPosition();
              } else {
                thumb.classList.remove('reset-mode');

                const minThumbHeight =
                  parseFloat(
                    getComputedStyle(thumb).getPropertyValue('--thumb-min-height')
                  ) || 20;

                const proportionalHeight =
                  (viewHeight / contentHeight) * trackHeight;

                const thumbHeight = Math.max(minThumbHeight, proportionalHeight);
                thumb.style.setProperty('--thumb-height', `${thumbHeight}px`);

                this.updateThumbPosition();
                this.scrollListener = () => this.updateThumbPosition();
                ul.addEventListener('scroll', this.scrollListener);
              }
            });
          }
        }, 0);
      } else {
        if (this.scrollListener) {
          this.ulRef.nativeElement.removeEventListener(
            'scroll',
            this.scrollListener
          );
          this.scrollListener = null;
        }
      }
    }
  }

  private scrollToSelected(): void {
    const selectedLi =
      this.elementRef.nativeElement.querySelector('li.selected');

    if (selectedLi) {
      selectedLi.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }

  private updateThumbPosition(): void {
    const ul = this.ulRef.nativeElement;
    const track = this.scrollbarTrackRef.nativeElement;
    const thumb = this.thumbRef.nativeElement;

    const scrollTop = ul.scrollTop;
    const maxScroll = ul.scrollHeight - ul.clientHeight;
    const trackHeight = track.offsetHeight;
    const thumbHeight = thumb.offsetHeight;

    if (maxScroll > 0) {
      const scrollRatio = scrollTop / maxScroll;
      const thumbTop = scrollRatio * (trackHeight - thumbHeight);
      thumb.style.top = `${thumbTop}px`;
      thumb.style.transform = 'none';
    }
  }

  private resetThumbPosition(animate: boolean = false): void {
    const track = this.scrollbarTrackRef.nativeElement;
    const thumb = this.thumbRef.nativeElement;

    const trackHeight = track.offsetHeight;
    const thumbHeight = thumb.offsetHeight;
    const centerTop = (trackHeight - thumbHeight) / 2;

    if (animate) {
      thumb.style.transition = 'top 0.3s ease';
    }

    thumb.style.top = `${centerTop}px`;
    thumb.style.transform = 'none';

    if (animate) {
      setTimeout(() => {
        thumb.style.transition = 'none';
      }, 300);
    }
  }

  onThumbMousedown(event: MouseEvent): void {
    if (!this.hasOverflow) return;

    event.preventDefault();
    event.stopPropagation();

    this.isDragging = true;
    this.startY = event.clientY;

    const ul = this.ulRef.nativeElement;
    const thumb = this.thumbRef.nativeElement;

    if (this.resetThumbToCenter) {
      this.startScrollTop = ul.scrollTop;
      this.startThumbTop = thumb.offsetTop;
    } else {
      this.startThumbTop = thumb.offsetTop;
    }

    thumb.style.transition = 'none';
  }

  onTrackMousedown(event: MouseEvent): void {
    if (!this.hasOverflow || this.isDragging) return;

    event.preventDefault();
    event.stopPropagation();

    if (event.target !== this.scrollbarTrackRef.nativeElement) return;

    const ul = this.ulRef.nativeElement;
    const track = this.scrollbarTrackRef.nativeElement;
    const trackRect = track.getBoundingClientRect();
    const clickY = event.clientY - trackRect.top;
    const thumbHeight = this.thumbRef.nativeElement.offsetHeight;
    const trackHeight = trackRect.height;

    if (this.resetThumbToCenter) {
      const centerY = trackHeight / 2;
      const page = ul.clientHeight * 0.9;

      if (clickY < centerY) {
        ul.scrollTop = Math.max(0, ul.scrollTop - page);
      } else {
        ul.scrollTop = Math.min(
          ul.scrollHeight - ul.clientHeight,
          ul.scrollTop + page
        );
      }
    } else {
      let newThumbTop = clickY - thumbHeight / 2;
      newThumbTop = Math.max(
        0,
        Math.min(newThumbTop, trackHeight - thumbHeight)
      );

      this.thumbRef.nativeElement.style.top = `${newThumbTop}px`;
      this.thumbRef.nativeElement.style.transform = 'none';

      const scrollRatio = newThumbTop / (trackHeight - thumbHeight);
      const maxScroll = ul.scrollHeight - ul.clientHeight;
      ul.scrollTop = scrollRatio * maxScroll;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const deltaY = event.clientY - this.startY;
    const ul = this.ulRef.nativeElement;
    const track = this.scrollbarTrackRef.nativeElement;
    const thumb = this.thumbRef.nativeElement;

    const trackHeight = track.offsetHeight;
    const thumbHeight = thumb.offsetHeight;
    const maxScroll = ul.scrollHeight - ul.clientHeight;

    if (this.resetThumbToCenter) {
      const factor = maxScroll / (trackHeight - thumbHeight);
      let newScrollTop = this.startScrollTop + deltaY * factor;

      newScrollTop = Math.max(0, Math.min(newScrollTop, maxScroll));
      ul.scrollTop = newScrollTop;

      let newThumbTop = this.startThumbTop + deltaY;
      newThumbTop = Math.max(
        0,
        Math.min(newThumbTop, trackHeight - thumbHeight)
      );

      thumb.style.top = `${newThumbTop}px`;
      thumb.style.transform = 'none';
    } else {
      let newThumbTop = this.startThumbTop + deltaY;
      newThumbTop = Math.max(
        0,
        Math.min(newThumbTop, trackHeight - thumbHeight)
      );

      const scrollRatio = newThumbTop / (trackHeight - thumbHeight);
      const newScrollTop = scrollRatio * maxScroll;

      ul.scrollTop = Math.max(0, Math.min(newScrollTop, maxScroll));
      thumb.style.top = `${newThumbTop}px`;
      thumb.style.transform = 'none';
    }
  }

  @HostListener('document:mouseup')
  onMouseup(): void {
    if (this.isDragging) {
      this.isDragging = false;

      if (this.resetThumbToCenter) {
        this.resetThumbPosition(true);
      } else {
        this.thumbRef.nativeElement.style.transition = '';
      }
    }
  }

  selectOption(option: DropdownOption): void {
    if (!option.disabled) {
      this.selectedOption = option;
      this.selectedValue = option.value;
      this.isOpen = false;
      this.selectionChange.emit(option.value);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  get displayText(): string {
    return this.selectedOption
      ? this.selectedOption.label
      : this.placeholder;
  }
}
