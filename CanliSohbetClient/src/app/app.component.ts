import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLogin : boolean = false;
  userName : string = "";
  users:{key:string,value:{avatar:string,userName:string}}[] = [];
  avatar:string = "avatar1";
  message : string = "";
  selectedUser:string = "";
  selectedUserAvatar:string = "";
  chats:{userName:string,avatar:string,message:string}[] = [];
  selectedUserConnectionId:string = "";

  hub:signalR.HubConnection | undefined;

  login(){
    this.isLogin = true;
    this.connection();
  }

  connection(){
    this.hub = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7108/sohbet-hub")
      .build();

      this.hub
      .start()
      .then(()=>{
          console.log("Connection started....");
          this.hub?.invoke("Connect",this.userName,this.avatar);//bu sadece bir defa çalışır

          this.hub?.on("Chat",(res:{userName:string,avatar:string,message:string})=>{
            console.log(res);
            this.chats.push(res);
          })

          this.hub?.on("Login",(res:any[])=>{
            //console.log(res);
            this.users = res.filter(p=>p.value.userName !=this.userName);
          });
      });
  }

  select(user:any){
    this.selectedUserConnectionId = user.key;
    this.selectedUser = user.value.userName;
    this.selectedUserAvatar = user.value.avatar; 
  }

  send(){
    this.chats.push({userName:this.userName,avatar:this.avatar,message:this.message})
    this.hub?.invoke("Send",this.userName,this.avatar,this.selectedUserConnectionId,this.message);
    this.message = "";
  }

}
