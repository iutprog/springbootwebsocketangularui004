package com.example.springbootwebsocketangularui001.services;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.springbootwebsocketangularui001.dto.Message;

@Service
public class NotiService {
  private SimpMessagingTemplate template;

    public NotiService ( SimpMessagingTemplate template){
        this.template = template;
    }

    public void sendPublicNoti(){

        Message message  = new Message("Public Notification");
        template.convertAndSend("/topic/public-noti", message);
    }

    public void sendPrivateNoti(final String id){
        Message message  = new Message("Private Notification");
        template.convertAndSendToUser(id, "/topic/private-noti", message);
    }
}
