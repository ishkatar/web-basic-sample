import SendBird from 'sendbird';
import { uuid4 } from './utils';

let instance = null;

class SendBirdChatEvent {
  constructor() {
    if (instance) {
      return instance;
    }

    this.sb = SendBird.getInstance();
    this.key = uuid4();
    this._createChannelHandler();

    this.onMessageReceived = null;
    this.onMessageUpdated = null;
    this.onMessageDeleted = null;

    this.onReadReceiptUpdated = null;
    this.onTypingStatusUpdated = null;
    instance = this;
  }

  /**
   * Channel Handler
   */
  _createChannelHandler() {
    const handler = new this.sb.ChannelHandler();
    handler.onMessageReceived = (channel, message) => {
      if (this.onMessageReceived) {
          this.onMessageReceived(channel, message);

          // Let's check if the browser supports notifications
          if (!("Notification" in window)) {
              alert("This browser does not support desktop notification");
          }

          // Let's check whether notification permissions have already been granted
          else if (Notification.permission === "granted") {
              // If it's okay let's create a notification
              var notification = new Notification("Message received!");
          }

          // Otherwise, we need to ask the user for permission
          else if (Notification.permission !== "denied") {
              Notification.requestPermission().then(function (permission) {
                  // If the user accepts, let's create a notification
                  if (permission === "granted") {
                      var notification = new Notification("Message received!");
                  }
              });
          }
      }
    };
    handler.onMessageUpdated = (channel, message) => {
      if (this.onMessageUpdated) {
          this.onMessageUpdated(channel, message);
      }
    };
    handler.onMessageDeleted = (channel, messageId) => {
      if (this.onMessageDeleted) {
        this.onMessageDeleted(channel, messageId);
      }
    };

    handler.onReadReceiptUpdated = groupChannel => {
      if (this.onReadReceiptUpdated) {
        this.onReadReceiptUpdated(groupChannel);
      }
    };
    handler.onTypingStatusUpdated = groupChannel => {
      if (this.onTypingStatusUpdated) {
        this.onTypingStatusUpdated(groupChannel);
      }
    };
    this.sb.addChannelHandler(this.key, handler);
  }

  remove() {
    this.sb.removeChannelHandler(this.key);
  }

  static getInstance() {
    return instance;
  }
}

export { SendBirdChatEvent };
