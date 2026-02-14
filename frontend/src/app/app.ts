import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./shared/navbar/navbar";
import { FloatingUserMenu } from "./shared/floating-user-menu/floating-user-menu";
import { FloatingRerouteMenu } from "./shared/floating-reroute-menu/floating-reroute-menu";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FloatingUserMenu, FloatingRerouteMenu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
