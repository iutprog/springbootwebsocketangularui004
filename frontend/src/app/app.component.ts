import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './services/message.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list'; // Import MatGridListModule
import { MatBadgeModule } from '@angular/material/badge'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatGridListModule,
    MatBadgeModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
 
  title = 'frontend';
  message = ''; // Variable to hold the message input by the user
  privateMessage = ''; // Variable to hold the private message input by the user (if needed)
  messages: string[] = []; // Array to store messages received from the WebSocket server
  notiCount = 0 ; // Variable to track the number of notification received.

  constructor (private messageService: MessageService){

  }

  ngOnInit(): void {
     
    this.messageService.connect();

    this.messageService.messages$.subscribe((messages) => {
        this.messages = messages;
    });


    this.messageService.notis$.subscribe((count) => {
        this.notiCount = count;
        console.log("Notification count from appComponent", this.notiCount);
    });
  }

  sendMessage(){
    this.messageService.sendMessage(this.message); // Call the WebSocket service to send the message
    this.message = ''; // Clear the input field after sending the message
  }


  sendPrivateMessage(){
    this.messageService.sendPrivateMessage(this.privateMessage); // Call the WebSocket service to send the message
    this.privateMessage = ''; // Clear the input field after sending the message
  }

  resetNotis(){
    this.notiCount = 0
  }

}
