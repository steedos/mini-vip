// import _ from 'underscore'
import {socketServer, chatBadgeTabBarIndex} from '@/config'
import io from 'weapp.socket.io'

const EVENTNAMES = {
	NEWMESSAGE: 'new message',
	STOPNEWMESSAGE: 'stop message',
	RECEIVEMESSAGE: 'receive message',
	SUBSCRIPTIONS: 'subscriptions',
	STOPNEWSUBSCRIPTIONS: 'stop subscriptions',
	RECEIVESUBSCRIPTIONS: 'receive subscriptions',
	COUNTUNREAD: 'count unread'
};

class ChatSocket{

	_socket = null;

	_userId = null;

	getSocket(userId, authToken){
		if(this._socket){
			if(this._userId == userId){
				return this._socket;
			}else{
				this._socket.disconnect();
				this._socket = null;
			}
		}

		this._socket = io(socketServer, {query: {
			'X-User-Id': userId,
			'X-Auth-Token': authToken,
		}});
		this._userId = userId;

		if(chatBadgeTabBarIndex >= 0){
			this._socket.on(EVENTNAMES.COUNTUNREAD, (unreadCount)=>{
				if (unreadCount > 0) {
					if(unreadCount > 999){
						unreadCount = 999
					}
					wx.setTabBarBadge({index: chatBadgeTabBarIndex, text: unreadCount.toString()})
				} else {
					wx.removeTabBarBadge({index: chatBadgeTabBarIndex})
				}
			})
		}

		return this._socket;
	}

	//注册新消息处理, fun请传入箭头函数,以确保this*的准确性
	registerOnNewMessage(related_to, fun){
		this._socket.emit(EVENTNAMES.RECEIVEMESSAGE, related_to);
		this._socket.on(EVENTNAMES.NEWMESSAGE, d=>{
			fun(d)
		})
	}

	//停止消息接收
	stopReceivingMessage(related_to){
		this._socket.emit(EVENTNAMES.STOPNEWMESSAGE, related_to)
	}

	//注册订阅消息处理, fun请传入箭头函数,以确保this*的准确性
	registerOnSubscriptions(related_to, fun){
		if(chatBadgeTabBarIndex >= 0){
			related_to.getBadge = true;
		}
		this._socket.emit(EVENTNAMES.RECEIVESUBSCRIPTIONS, related_to);
		this._socket.on(EVENTNAMES.SUBSCRIPTIONS, d=>{
			fun(d)
		})
	}

	//停止订阅消息接收: 不需要停止接收订阅消息
	stopReceivingubscriptions(related_to){
		// this._socket.emit(EVENTNAMES.STOPNEWSUBSCRIPTIONS, related_to)
	}
}

export default new ChatSocket()
