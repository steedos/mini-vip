import wepy from 'wepy'

export default class ChatNotificationMixin extends wepy.mixin {

  data = {
    args: {}
  };

  async onLoad(e){

    if(e.space_id){
      this.space_id = e.space_id;
    }

    this.args = {
      space_id: this.space_id
    };

    this.$apply();
  }

  // onShow(){
  //   this.$invoke('chatNotification', 'receivingSubscriptions')
  // }

  // onHide(){
  //   this.$invoke('chatNotification', 'stopReceivingSubscriptions')
  // }

  async onUnload(){
    this.$invoke('chatNotification', 'stopReceivingSubscriptions')
  }
}
