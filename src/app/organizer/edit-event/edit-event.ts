import { ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { EventService } from '../../services/event';
import { Event } from '../../Models/event.model';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [Sidebar, CommonModule, ReactiveFormsModule, NgxEditorModule],
  templateUrl: './edit-event.html',
  styleUrl: './edit-event.css'
})
export class EditEvent implements OnInit, OnDestroy {

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

  id = 0;
  image = '';
  galleryImages: string[] = [];
  availableSeats = 0;
  validationMessage = '';
  showSuccessModal = false;
  status: Event['status'] = 'Active';
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

  private readonly fb =
    inject(FormBuilder);
  private readonly uploadImageMaxSize = 900;
  private readonly uploadImageQuality = 0.82;
  private redirectTimer?: ReturnType<typeof setTimeout>;

  editForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    startDateTime: ['', Validators.required],
    endDateTime: ['', Validators.required],
    venue: ['', Validators.required],
    city: ['', Validators.required],
    address: ['', Validators.required],
    organizerName: ['', Validators.required],
    organizerEmail: ['', [Validators.required, Validators.email]],
    price: [0, [Validators.required, Validators.min(0)]],
    totalSeats: [0, [Validators.required, Validators.min(1)]],
    additionalInfo: ['']
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private changeDetector: ChangeDetectorRef
  ) {

    this.id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    const event =
      this.eventService.getEventById(this.id);

    if (event) {
      this.editForm.patchValue({
        title: event.title,
        category: event.category,
        description: event.description,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        venue: event.venue,
        city: event.city,
        address: event.address,
        organizerName: event.organizerName,
        organizerEmail: event.organizerEmail,
        price: event.price,
        totalSeats: event.totalSeats,
        additionalInfo: event.additionalInfo
      });

      this.image = event.image;
      this.galleryImages = [...event.gallery];
      this.availableSeats = event.availableSeats;
      this.status = event.status;
    }

  }

  get minimumStartDateTime(): string {

    return this.formatDateTimeInput(
      this.getTodayStart()
    );

  }

  get minimumEndDateTime(): string {

    const todayStart =
      this.getTodayStart();
    const startDate =
      this.parseDateTimeInput(this.editForm.controls.startDateTime.value);

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

    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }

    this.editor.destroy();

  }

  updateEvent(): void {

    if (this.showSuccessModal) {
      return;
    }

    this.validationMessage = '';

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const value =
      this.editForm.getRawValue();

    if (this.isBeforeToday(value.startDateTime)) {
      this.validationMessage =
        'Start date and time cannot be before today.';
      this.editForm.controls.startDateTime.markAsTouched();
      return;
    }

    if (this.isBeforeToday(value.endDateTime)) {
      this.validationMessage =
        'End date and time cannot be before today.';
      this.editForm.controls.endDateTime.markAsTouched();
      return;
    }

    if (new Date(value.endDateTime) <= new Date(value.startDateTime)) {
      this.validationMessage =
        'End date and time must be after start date and time.';
      this.editForm.controls.endDateTime.markAsTouched();
      return;
    }

    const coverImage =
      this.image ||
      this.galleryImages[0] ||
      'images/technology/tech.jpg';

    const currentEvent =
      this.eventService.getEventById(this.id);

    const soldSeats =
      currentEvent
        ? currentEvent.totalSeats - currentEvent.availableSeats
        : 0;

    const updatedEvent: Event = {
      id: this.id,
      title: value.title.trim(),
      category: value.category,
      description: value.description.trim(),
      date: value.startDateTime.slice(0, 10),
      startDateTime: value.startDateTime,
      endDateTime: value.endDateTime,
      venue: value.venue.trim(),
      city: value.city.trim(),
      address: value.address.trim(),
      organizerName: value.organizerName.trim(),
      organizerEmail: value.organizerEmail.trim(),
      price: Number(value.price),
      image: coverImage,
      gallery:
        this.galleryImages.length > 0
          ? this.galleryImages
          : [coverImage],
      totalSeats: Number(value.totalSeats),
      availableSeats: Math.max(
        Number(value.totalSeats) - soldSeats,
        0
      ),
      additionalInfo: value.additionalInfo,
      status: this.status
    };

    this.eventService.updateEvent(updatedEvent);

    this.showSuccessModal = true;
    this.editForm.disable();

    this.redirectTimer = setTimeout(
      () => {
        this.router.navigate([
          '/organizer/manage-events'
        ]);
      },
      1500
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

  onStartDateTimeChange(): void {

    const startDate =
      this.parseDateTimeInput(this.editForm.controls.startDateTime.value);
    const endDate =
      this.parseDateTimeInput(this.editForm.controls.endDateTime.value);

    if (startDate && endDate && endDate <= startDate) {
      this.editForm.controls.endDateTime.setValue('');
    }

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
