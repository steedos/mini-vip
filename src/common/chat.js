import wepy from 'wepy'
import ODataClinet from '@/utils/odata_client'
import _ from 'underscore'

class ChatAPI {

  async resetUnread(room_id, user_id, space_id){
    const queryOptions = {
      $top: 1,
      $filter: `(related_to/o eq 'chat_rooms') and (related_to/ids eq '${room_id}') and owner eq '${user_id}'`,
      $select: '_id',
    };

    const result = await ODataClinet.query('chat_subscriptions', queryOptions, space_id);

    if(result.value.length > 0){
      const sId = result.value[0]._id;
      ODataClinet.update('chat_subscriptions', sId, {unread: 0}, space_id)
    }
  }

  async getRoom(user_id, space, room_members){
    let filter = [];

    _.forEach(room_members, (m)=>{
      filter.push(`(members eq '${m}')`)
    });

    let queryOptions = {
      $filter: `(type eq 'private') and (${filter.join(' and ')})`,
      $select: '_id,name',
    };

    const room = await ODataClinet.query('chat_rooms', queryOptions, space);

    console.log('getRoom room', room);
    if(room.value.length > 0){
      return room.value[0]
    }else{

      const room_data = {
        type: 'private',
        name: '',
        owner: user_id,
        members: room_members
      };
      const insert_room = await ODataClinet.insert('chat_rooms', room_data, space);
      console.log('getRoom insert_room', insert_room);
      if(insert_room.value.length > 0){
        return insert_room.value[0]
      };
    }
  }

  sendMsg(room_id, msg, type = 'text', space, user_id) {
    return this.msg(room_id, msg, type, space, user_id);
  }

  getHistory(room_id, space, top, filter){

    let queryOptions = {
      $top: top || 15,
      $filter: `(related_to/o eq 'chat_rooms') and (related_to/ids eq '${room_id}')`,
      $orderby: 'created desc',
      $select: 'name,type,created,owner',
      $expand: 'owner($select=name,profile)'
    };

    if(filter){
      queryOptions.$filter = `${queryOptions.$filter} and ${filter}`
    }

    return ODataClinet.query('chat_messages', queryOptions, space)
  }

  getNewMessage(room_id, space, timestamp){
    let queryOptions = {
      $filter: `(related_to/o eq 'chat_rooms') and (related_to/ids eq '${room_id}') and created gt ${timestamp}`,
      $orderby: 'created desc',
      $select: 'name,type,created,owner',
      $expand: 'owner($select=name,profile)'
    };
    return ODataClinet.query('chat_messages', queryOptions, space)
  }

  async msg(room_id, msg, type = 'text', space, user_id) {
    let data = {
      related_to: {
        o: "chat_rooms",
        ids: [room_id]
      },
      name: msg,
      type: 'text',
      owner: user_id
    };

    const res = await ODataClinet.insert('chat_messages', data, space);

    data._id = res.value[0]._id;

    return data;

    // let history = wepy.getStorageSync('_wechat_history_') || m_history;
    // let msgObj = {
    //   to: to,
    //   msg: msg,
    //   type: type,
    //   from: frm,
    //   time: +new Date()
    // };
	//
    // history.push(msgObj);
	//
    // return new Promise((resolve, reject) => {
    //   wepy.setStorage({key: '_wechat_history_', data: history}).then(() => {
    //     resolve(msgObj);
    //   }).catch(reject);
    // });
  }
}

export default new ChatAPI()
