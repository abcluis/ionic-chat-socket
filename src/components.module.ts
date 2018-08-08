import {NgModule} from '@angular/core';
import {ChatComponent} from './components/chat/chat';
import {IonicModule} from 'ionic-angular';
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [ChatComponent],
    imports: [IonicModule, FormsModule],
    exports: [ChatComponent]
})
export class IonicChatModule {

}
