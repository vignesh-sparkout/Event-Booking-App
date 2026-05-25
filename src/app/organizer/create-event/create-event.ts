import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule,NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import {Editor,NgxEditorModule,Toolbar} from 'ngx-editor';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { EventService } from '../../services/event';
import { Event } from '../../Models/event.model';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    Sidebar,
    CommonModule,
    FormsModule,
    NgxEditorModule
  ],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css'
})
export class CreateEvent implements OnInit, OnDestroy {

  @ViewChild('coverImageInput')
  private coverImageInput?: ElementRef<HTMLInputElement>;
  @ViewChild('galleryImageInput')
  private galleryImageInput?: ElementRef<HTMLInputElement>;

  categories = [
    'Music',
    'Technology',
    'Workshop',
    'Comedy',
    'Sports',
    'Food'
  ];

  title = '';
  category = '';
  description = '';
  startDateTime = '';
  endDateTime = '';
  venue = '';
  city = '';
  address = '';
  organizerName = '';
  organizerEmail = '';
  price = 0;
  image = '';
  galleryImages: string[] = [];
  totalSeats = 0;
  additionalInfo = '';
  validationMessage = '';
  editor!: Editor;
  toolbar: Toolbar = [
    [
      'bold',
      'italic',
      'underline',
      'strike'
    ],
    [
      'blockquote',
      'ordered_list',
      'bullet_list'
    ],
    [
      {
        heading: [
          'h2',
          'h3',
          'h4'
        ]
      }
    ],
    [
      'link',
      'text_color',
      'background_color'
    ],
    [
      'align_left',
      'align_center',
      'align_right',
      'align_justify'
    ],
    [
      'undo',
      'redo',
      'format_clear'
    ]
  ];

  private readonly emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  private readonly uploadImageMaxSize = 900;
  private readonly uploadImageQuality = 0.82;

  constructor(
    private eventService: EventService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}
  
  get minimumStartDateTime(): string {

    return this.formatDateTimeInput(
      this.getTodayStart()
    );

  }

  get minimumEndDateTime(): string {

    const todayStart =
      this.getTodayStart();
    const startDate =
      this.parseDateTimeInput(this.startDateTime);

    if (startDate && startDate > todayStart) {
      return this.formatDateTimeInput(startDate);
    }

    return this.formatDateTimeInput(todayStart);

  }

  ngOnInit(): void {

    this.editor =
      new Editor();

  }

  ngOnDestroy(): void {

    this.editor.destroy();

  }

  createEvent(form: NgForm): void {

    this.validationMessage = '';

    const hasMissingRequiredField =
      this.hasMissingRequiredField();

    if (hasMissingRequiredField) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.emailPattern.test(this.organizerEmail.trim())) {
      this.validationMessage =
        'Please enter a valid organizer email address.';
      this.markFieldAsTouched(form, 'organizerEmail');
      return;
    }

    if (Number(this.price) < 0) {
      this.validationMessage =
        'Ticket price cannot be negative.';
      this.markFieldAsTouched(form, 'price');
      return;
    }

    if (Number(this.totalSeats) < 1) {
      this.validationMessage =
        'Total seats must be at least 1.';
      this.markFieldAsTouched(form, 'totalSeats');
      return;
    }

    if (this.isBeforeToday(this.startDateTime)) {
      this.validationMessage =
        'Start date and time cannot be before today.';
      this.markFieldAsTouched(form, 'startDateTime');
      return;
    }

    if (this.isBeforeToday(this.endDateTime)) {
      this.validationMessage =
        'End date and time cannot be before today.';
      this.markFieldAsTouched(form, 'endDateTime');
      return;
    }

    if (
      this.startDateTime &&
      this.endDateTime &&
      new Date(this.endDateTime) <= new Date(this.startDateTime)
    ) {
      this.validationMessage =
        'End date and time must be after start date and time.';
      this.markFieldAsTouched(form, 'endDateTime');
      return;
    }

    const coverImage =
      this.image ||
      this.galleryImages[0] ||
      'images/technology/tech.jpg';

    const newEvent: Event = {
      id: Date.now(),
      title: this.title.trim(),
      category: this.category,
      description: this.description.trim(),
      date: this.startDateTime.slice(0, 10),
      startDateTime: this.startDateTime,
      endDateTime: this.endDateTime,
      venue: this.venue.trim(),
      city: this.city.trim(),
      address: this.address.trim(),
      organizerName: this.organizerName.trim(),
      organizerEmail: this.organizerEmail.trim(),
      price: Number(this.price),
      image: coverImage,
      gallery:
        this.galleryImages.length > 0
          ? this.galleryImages
          : [coverImage],
      totalSeats: Number(this.totalSeats),
      availableSeats: Number(this.totalSeats),
      additionalInfo: this.additionalInfo,
      status: 'Active'
    };

    this.eventService.addEvent(newEvent);

    this.resetForm();
    form.resetForm({
      title: '',
      category: '',
      description: '',
      startDateTime: '',
      endDateTime: '',
      venue: '',
      city: '',
      address: '',
      organizerName: '',
      organizerEmail: '',
      price: 0,
      image: '',
      additionalInfo: '',
      totalSeats: 0
    });
    this.clearUploadInputs();
    this.router.navigate(
      [
        '/organizer/manage-events'
      ],
      {
        state: {
          eventCreated: true,
          eventTitle: newEvent.title
        }
      }
    );

  }

  async onCoverImageSelected(event: globalThis.Event): Promise<void> {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    try {
      this.image =
        await this.readImageAsCompressedDataUrl(file);
      this.validationMessage = '';
    } catch {
      this.validationMessage =
        'Unable to upload cover image. Please choose a valid image file.';
      input.value = '';
    }

    this.changeDetector.detectChanges();

  }

  async onGalleryImagesSelected(event: globalThis.Event): Promise<void> {

    const input =
      event.target as HTMLInputElement;

    const files =
      Array.from(input.files || []);

    if (files.length === 0) {
      return;
    }

    try {
      this.galleryImages =
        await Promise.all(
          files.map(file =>
            this.readImageAsCompressedDataUrl(file)
          )
        );
      this.validationMessage = '';
    } catch {
      this.galleryImages = [];
      this.validationMessage =
        'Unable to upload gallery images. Please choose valid image files.';
      input.value = '';
    }

    this.changeDetector.detectChanges();

  }

  clearCoverImage(): void {

    this.image = '';

    if (this.coverImageInput) {
      this.coverImageInput.nativeElement.value = '';
    }

  }

  clearGalleryImages(): void {

    this.galleryImages = [];

    if (this.galleryImageInput) {
      this.galleryImageInput.nativeElement.value = '';
    }

  }

  onStartDateTimeChange(value: string): void {

    this.startDateTime = value;

    const startDate =
      this.parseDateTimeInput(this.startDateTime);
    const endDate =
      this.parseDateTimeInput(this.endDateTime);

    if (startDate && endDate && endDate <= startDate) {
      this.endDateTime = '';
    }

  }

  private resetForm(): void {

    this.title = '';
    this.category = '';
    this.description = '';
    this.startDateTime = '';
    this.endDateTime = '';
    this.venue = '';
    this.city = '';
    this.address = '';
    this.organizerName = '';
    this.organizerEmail = '';
    this.price = 0;
    this.image = '';
    this.galleryImages = [];
    this.totalSeats = 0;
    this.additionalInfo = '';
    this.validationMessage = '';

  }

  private hasMissingRequiredField(): boolean {

    const requiredValues = [
      this.title,
      this.category,
      this.description,
      this.startDateTime,
      this.endDateTime,
      this.venue,
      this.city,
      this.address,
      this.price,
      this.totalSeats,
      this.organizerName,
      this.organizerEmail
    ];

    return requiredValues
      .some(value => !this.hasValue(value));

  }

  private hasValue(value: string | number): boolean {

    return this.stripHtml(String(value ?? '')).length > 0;

  }

  private markFieldAsTouched(
    form: NgForm,
    controlName: string
  ): void {

    form.controls[controlName]?.markAsTouched();

  }

  private isBeforeToday(value: string): boolean {

    const date =
      this.parseDateTimeInput(value);

    return !!date && date < this.getTodayStart();

  }

  private parseDateTimeInput(value: string): Date | undefined {

    if (!value) {
      return undefined;
    }

    const date =
      new Date(value);

    return Number.isNaN(date.getTime())
      ? undefined
      : date;

  }

  private getTodayStart(): Date {

    const today =
      new Date();

    today.setHours(0, 0, 0, 0);

    return today;

  }

  private formatDateTimeInput(date: Date): string {

    const pad =
      (value: number) => String(value).padStart(2, '0');

    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())
    ].join('-') + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;

  }

  private stripHtml(value: string): string {

    return value
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

  }

  private clearUploadInputs(): void {

    if (this.coverImageInput) {
      this.coverImageInput.nativeElement.value = '';
    }

    if (this.galleryImageInput) {
      this.galleryImageInput.nativeElement.value = '';
    }

  }

  private readImageAsCompressedDataUrl(file: File): Promise<string> {

    return new Promise((resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        const image =
          new Image();

        image.onload = () => {
          const scale =
            Math.min(
              this.uploadImageMaxSize / image.width,
              this.uploadImageMaxSize / image.height,
              1
            );

          const canvas =
            document.createElement('canvas');

          canvas.width =
            Math.round(image.width * scale);
          canvas.height =
            Math.round(image.height * scale);

          const context =
            canvas.getContext('2d');

          if (!context) {
            reject(new Error('Unable to process image.'));
            return;
          }

          context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
          );

          resolve(
            canvas.toDataURL(
              'image/jpeg',
              this.uploadImageQuality
            )
          );
        };

        image.onerror =
          () => reject(new Error('Please upload a valid image file.'));

        image.src =
          String(reader.result || '');
      };

      reader.onerror =
        () => reject(reader.error);

      reader.readAsDataURL(file);
    });

  }

}
