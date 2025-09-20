import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gestiononline',
  standalone:true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './gestiononline.component.html',
  styleUrl: './gestiononline.component.css'
})
export class GestiononlineComponent {

}
