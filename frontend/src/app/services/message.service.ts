import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private stompClient: Client | null = null;  // STOMP client instance
  private  messageSubject = new BehaviorSubject<string[]>([]);
  public messages$ = this.messageSubject.asObservable();
  private  notiSubject = new BehaviorSubject<number>(0);
  public notis$ = this.notiSubject.asObservable();

  connect() {
    // Create a new SockJS connection pointing to the '/ws' endpoint
    const socket = new SockJS('http://localhost:8080/ws');  // Initialize the SockJS WebSocket connection to the server

    
    // Create a new STOMP Client instance and configure it
    this.stompClient = new Client({
      webSocketFactory: () => socket,  // Use SockJS as the WebSocket factory
      reconnectDelay: 5000,  // Reconnect after 5 seconds if the connection is lost
      debug: (str) => {
        console.log(str);  // Log STOMP debug messages for troubleshooting
      },
    });

    // Define behavior when the client successfully connects to the server
     this.stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);  // Log connection success
      
      // Subscribe to the public topic '/topic/messages' to receive public messages
      this.stompClient?.subscribe('/topic/messages', (message) => {
        const parsedMessage = JSON.parse(message.body).messageContent;  // Parse the message content
        this.addMessage(parsedMessage);  // Add the received message to the message list
      });


      // Subscribe to the private topic '/topic/messages' to receive private messages
      this.stompClient?.subscribe('/user/topic/private-messages', (message) => {
        const parsedMessage = JSON.parse(message.body).messageContent;  // Parse the message content
        this.addMessage(parsedMessage);  // Add the received message to the message list
      });

       // Subscribe to the private topic '/topic/private-noti' to receive private messages
       this.stompClient?.subscribe('/user/topic/private-noti', () => {
        this.addNoti();  // Increment the notificaion count
      });
     

          // Subscribe to the public topic '/topic/public-noti' to receive private messages
          this.stompClient?.subscribe('/topic/public-noti', () => {
            this.addNoti();  // Increment the notificaion count
          });
    };

    // Handle errors reported by the STOMP server
    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);  // Log the error message
      console.error('Additional details: ' + frame.body);  // Log additional error details
    };

    // Activate the client (i.e., initiate the WebSocket connection)
    this.stompClient.activate();
  }
  // Function to send a message to the server via the WebSocket connection
  sendMessage(message: string) {
    if (this.stompClient?.connected) {  // Check if the WebSocket connection is active
      this.stompClient?.publish({
        destination: '/app/message',  // The destination to send the message
        body: JSON.stringify({ messageContent: message })  // The message content as a string
      });
      
    }
  }



    // Function to send a message to the server via the WebSocket connection
    sendPrivateMessage(message: string) {
      if (this.stompClient?.connected) {  // Check if the WebSocket connection is active
        this.stompClient?.publish({
          destination: '/app/private-message',  // The destination to send the message
          body: JSON.stringify({ messageContent: message })  // The message content as a string
        });
        
      }
    }

  private addMessage(message: string) {
    const currentMessages = this.messageSubject.value;  // Get the current list of messages
    console.log("MESSAGE ADDED : " + message)
    this.messageSubject.next([...currentMessages, message]);  // Update the message list with the new message
  }

  private addNoti(){
    const currentCount = this.notiSubject.value;  // Get the current list of messages
    console.log("NOTIFICATION COUNT INCREMENTED : " + currentCount +1);
    this.notiSubject.next(currentCount +1);  
  }
}
