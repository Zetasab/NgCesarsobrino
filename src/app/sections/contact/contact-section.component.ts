import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxTypewriterComponent } from '@omnedia/ngx-typewriter';

@Component({
  selector: 'app-section-contact',
  imports: [NgxTypewriterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.css'
})
export class ContactSectionComponent {
  protected readonly thanksWords = ['Gracias por ver'];
}
