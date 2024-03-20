import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  userId:String = ""

  constructor(private router:Router,private socket:ChatService){}

  ngOnInit(): void {
    if(sessionStorage.getItem("existingUser")){
      this.userId = JSON.parse(sessionStorage.getItem("existingUser") || "")._id
      
    }
    this.socket.getUserStatus().subscribe((res:any)=>{
      console.log(res);
      
    })
      
    
    
  }

  logout(){
    sessionStorage.clear()
    this.router.navigateByUrl('/')
    
  }
}
