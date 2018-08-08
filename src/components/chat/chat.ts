import {Component} from '@angular/core';
import * as io from "socket.io-client";
import {Observable} from "rxjs/Observable";
import {NavParams} from "ionic-angular";


//<editor-fold desc="Template">
const HTML_TEMPLATE = `
<ion-header>
  <ion-navbar [color]="color">
    <ion-title>
      {{ title }}
    </ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding style="background: #e5e5e5;">
  <div style="position: relative;">
    <ol class="chat" id="chat">
      <li *ngFor="let message of messages" 
          [ngClass]="message.sender === user_id ? 'self': 'other'">
        <div class="avatar">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLjvGgTN4B0qqPiSz-yayYviGl8yCSO0NLsbYXgNmIgB6QBMhkfA"
            draggable="false"/>
        </div>
        <div class="msg">
          <p> {{ message.contenido }} </p>
          <time>18:08</time>
        </div>
      </li>
      
    </ol>
  </div>

  <div>
    <ion-textarea class="textarea" 
    type="text" 
    value="" 
    [(ngModel)]="contenido"
    placeholder="Escribe un mensaje!"></ion-textarea>
    <button class="emojis btn btn-default" (click)="sendMessage()">Enviar</button>
  </div>
</ion-content>
`;
//</editor-fold>

//<editor-fold desc="Styles">
const CSS_STYLE = `
::selection {
    background: rgba(82, 179, 217, 0.3);
    color: inherit;
  }
  a {
    color: rgba(82, 179, 217, 0.9);
  }

  /* M E N U */

  .menu {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    width: 100%;
    height: 50px;
    background: rgba(82, 179, 217, 0.9);
    z-index: 100;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .back {
    position: absolute;
    width: 90px;
    height: 50px;
    top: 0px;
    left: 0px;
    color: #fff;
    line-height: 50px;
    font-size: 30px;
    padding-left: 10px;
    cursor: pointer;
  }
  .back img {
    position: absolute;
    top: 5px;
    left: 30px;
    min-width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.98);
    border-radius: 100%;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    -ms-border-radius: 100%;
    margin-left: 15px;
  }
  .back:active {
    background: rgba(255, 255, 255, 0.2);
  }
  .name {
    position: absolute;
    top: 3px;
    left: 110px;
    font-family: "Lato";
    font-size: 25px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.98);
    cursor: default;
  }
  .last {
    position: absolute;
    top: 30px;
    left: 115px;
    font-family: "Lato";
    font-size: 11px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    cursor: default;
  }

  /* M E S S A G E S */

  .chat {
    list-style: none;
    background: none;
    margin: 0;
    padding: 0 0 50px 0;
    margin-bottom: 10px;
  }
  .chat li {
    padding: 0.6rem;
    margin: 8px 0;
    overflow: hidden;
    align-items: center;
    display: flex;
  }
  .chat .avatar {
    min-width: 40px;
    height: 40px;
    position: relative;
    display: block;
    z-index: 2;
    margin: 0 4px;
    border-radius: 100%;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    -ms-border-radius: 100%;
    background-color: rgba(255, 255, 255, 0.9);
  }
  .chat .avatar img {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    -ms-border-radius: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  .chat .day {
    position: relative;
    display: block;
    text-align: center;
    color: #c0c0c0;
    height: 20px;
    text-shadow: 7px 0px 0px #e5e5e5, 6px 0px 0px #e5e5e5, 5px 0px 0px #e5e5e5,
      4px 0px 0px #e5e5e5, 3px 0px 0px #e5e5e5, 2px 0px 0px #e5e5e5,
      1px 0px 0px #e5e5e5, 1px 0px 0px #e5e5e5, 0px 0px 0px #e5e5e5,
      -1px 0px 0px #e5e5e5, -2px 0px 0px #e5e5e5, -3px 0px 0px #e5e5e5,
      -4px 0px 0px #e5e5e5, -5px 0px 0px #e5e5e5, -6px 0px 0px #e5e5e5,
      -7px 0px 0px #e5e5e5;
    box-shadow: inset 20px 0px 0px #e5e5e5, inset -20px 0px 0px #e5e5e5,
      inset 0px -2px 0px #d7d7d7;
    line-height: 38px;
    margin-top: 5px;
    margin-bottom: 20px;
    cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .other .msg {
    order: 1;
    border-top-left-radius: 0px;
    box-shadow: -1px 2px 0px #d4d4d4;
  }
  /*.other:before {
    content: "";
    position: relative;
    top: 0px;
    right: 0px;
    left: 40px;
    width: 0px;
    height: 0px;
    border: 5px solid #fff;
    border-left-color: transparent;
    border-bottom-color: transparent;
  }*/

  .self {
    justify-content: flex-end;
    align-items: flex-end;
  }
  .self .msg {
    order: 1;
    border-bottom-right-radius: 0px;
    box-shadow: 1px 2px 0px #d4d4d4;
  }
  .self .avatar {
    order: 2;
  }
  /*.self .avatar:after {
    content: "";
    position: relative;
    display: inline-block;
    bottom: 19px;
    right: 0px;
    width: 0px;
    height: 0px;
    border: 5px solid #fff;
    border-right-color: transparent;
    border-top-color: transparent;
    box-shadow: 0px 2px 0px #d4d4d4;
  }*/

  .msg {
    background: white;
    min-width: 50px;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.07);
  }
  .msg p {
    font-size: 1.3rem;
    margin: 0 0 0.2rem 0;
    color: #777;
  }
  .msg img {
    position: relative;
    display: block;
    width: 450px;
    border-radius: 5px;
    box-shadow: 0px 0px 3px #eee;
    transition: all 0.4s cubic-bezier(0.565, -0.26, 0.255, 1.41);
    cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  @media screen and (max-width: 800px) {
    .msg img {
      width: 300px;
    }
  }
  @media screen and (max-width: 550px) {
    .msg img {
      width: 200px;
    }
  }

  .msg time {
    font-size: 0.7rem;
    color: #ccc;
    margin-top: 3px;
    float: right;
    cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  .msg time:before {
    content: "\\f017";
    color: #ddd;
    font-family: FontAwesome;
    display: inline-block;
    margin-right: 4px;
  }

  emoji {
    display: inline-block;
    height: 18px;
    width: 18px;
    background-size: cover;
    background-repeat: no-repeat;
    margin-top: -7px;
    margin-right: 2px;
    transform: translate3d(0px, 3px, 0px);
  }
  emoji.please {
    background-image: url(https://imgur.com/ftowh0s.png);
  }
  emoji.lmao {
    background-image: url(https://i.imgur.com/MllSy5N.png);
  }
  emoji.happy {
    background-image: url(https://imgur.com/5WUpcPZ.png);
  }
  emoji.pizza {
    background-image: url(https://imgur.com/voEvJld.png);
  }
  emoji.cryalot {
    background-image: url(https://i.imgur.com/UUrRRo6.png);
  }
  emoji.books {
    background-image: url(https://i.imgur.com/UjZLf1R.png);
  }
  emoji.moai {
    background-image: url(https://imgur.com/uSpaYy8.png);
  }
  emoji.suffocated {
    background-image: url(https://i.imgur.com/jfTyB5F.png);
  }
  emoji.scream {
    background-image: url(https://i.imgur.com/tOLNJgg.png);
  }
  emoji.hearth_blue {
    background-image: url(https://i.imgur.com/gR9juts.png);
  }
  emoji.funny {
    background-image: url(https://i.imgur.com/qKia58V.png);
  }

  ::-webkit-scrollbar {
    min-width: 12px;
    width: 12px;
    max-width: 12px;
    min-height: 12px;
    height: 12px;
    max-height: 12px;
    background: #e5e5e5;
    box-shadow: inset 0px 50px 0px rgba(82, 179, 217, 0.9),
      inset 0px -52px 0px #fafafa;
  }

  ::-webkit-scrollbar-thumb {
    background: #bbb;
    border: none;
    border-radius: 100px;
    border: solid 3px #e5e5e5;
    box-shadow: inset 0px 0px 3px #999;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #b0b0b0;
    box-shadow: inset 0px 0px 3px #888;
  }

  ::-webkit-scrollbar-thumb:active {
    background: #aaa;
    box-shadow: inset 0px 0px 3px #7f7f7f;
  }

  ::-webkit-scrollbar-button {
    display: block;
    height: 26px;
  }

  /* T Y P E */

  ion-textarea.textarea {
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    width: 100%;
    height: 50px;
    z-index: 99;
    background: #fafafa;
    border: none;
    outline: none;
    padding-left: 15px;
    padding-right: 65px;
    color: #666;
    font-weight: 400;
  }
  .emojis {
    position: fixed;
    display: block;
    bottom: 8px;
    right: 7px;
    width: 100px;
    height: 34px;
    background-size: cover;
    z-index: 100;
    cursor: pointer;
  }
  .emojis:active {
    opacity: 0.9;
  }
`;

//</editor-fold>


/**
 * Generated class for the ChatComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'ionic-chat',
  template: HTML_TEMPLATE,
  styles: [CSS_STYLE]
})

export class ChatComponent {
  propietario: any;

  //<editor-fold desc="Component">
  color: string;
  //</editor-fold>
  socket;
  user_id;
  title;
  contenido = '';

  messages: any;

  constructor(private navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.color = this.navParams.get('color');
    this.user_id = this.navParams.get('user_id');
    this.title = this.navParams.get('title');
    this.propietario = this.navParams.get('propietario');
    let socket_url = this.navParams.get('socket_url');
    this.socket = io(`${socket_url}?propietario=${this.propietario}`);
    this.getSala().subscribe((sala) => this.loadMessages(sala));
    this.listenMessages().subscribe(message => this.messages.push(message));
  }

  loadMessages(sala) {
    this.messages = sala.mensajes;
  }

  getSala() {
    return new Observable(observer => {
      this.socket.on("sala", data => {
        observer.next(data);
      });
    });
  }


  listenMessages() {
    return new Observable(observer => {
      this.socket.on("new-message", data => {
        observer.next(data);
      });
    });
  }

  sendMessage() {
    console.log('sendMessage');
    let message = {
      contenido: this.contenido,
      sender: this.user_id
    };
    this.contenido = '';
    this.socket.emit('send-message', {message, propietario: this.propietario});
  }

}

export interface ChatParams {
  color: string,
  propietario: string,
  user_id: string,
  title: string,
  socket_url: string
}
