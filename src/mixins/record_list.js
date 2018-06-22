import wepy from 'wepy'
import { baseUrl } from '@/config';

const DATA_LENGTH = 15;

export default class recordList extends wepy.mixin {
  data = {
    record_list: [],
    object_name: '',
    space_id: '',
    baseUrl: baseUrl,
    current_skip: 0,
    allow_load: true,
    is_loaded: false,
    avatar_field: '',
    name_field: '',
    description_field: '',
    date_field: '',
    searchPlaceholder: '搜索',
    allowCreate: false,
    filter: '',
    url: './edit',
    add_url: './create'
  };

  refresh() {
    this.record_list = [];
    this.allow_load = true;
    this.current_skip = 0;
    this.loadRecords();
  }

  onPullDownRefresh() {
    this.refresh();
  }

  onReachBottom() {
    this.loadRecords();
  }

  searchRecords(searchValue, evt){
    this.record_list = [];
    this.allow_load = true;
    this.current_skip = 0;
    this.loadRecords(searchValue);
  }

  async onLoad(e) {
    wepy.showLoading({
      title: '加载中',
      mask: true
    });

    if(!e){
      throw new Error('缺少参数:space_id,object_name')
    }

    if(!e.object_name){
      throw new Error('缺少参数:object_name')
    }

    if(e.url){
      this.url = e.url
    }

    if(this.url.indexOf('?') > -1){
      this.url = this.url + '&action=edit'
    }else{
      this.url = this.url + '?action=edit'
    }

    this.space_id = e.space_id || this.$parent.globalData.space_id;
    this.object_name = e.object_name;

    if(e.add_url){
      this.add_url = e.add_url
    }

    if(this.add_url.indexOf('?') > -1){
      this.add_url = this.add_url + '&object_name=' + this.object_name + '&space_id=' + this.space_id + "&store_id=" + this.space_id
    }else{
      this.add_url = this.add_url + '?object_name=' + this.object_name + '&space_id=' + this.space_id + "&store_id=" + this.space_id
    }

    this.avatar_field = e.avatar_field;
    this.name_field = e.name_field || 'name';
    this.description_field = e.description_field;
    this.date_field = e.date_field;

    this.filter = e.filter;

    const object = await this.$parent.getObject(this.object_name);

    this.allowCreate = object.allowCreate;
    if(e.allow_create === 'true'){
      this.allowCreate = true
    }
    this.searchPlaceholder = '搜索' + object.label;

    wx.setNavigationBarTitle({
      title: object.label
    });
    await this.loadRecords()
    this.is_loaded = true
    this.$apply()
    wepy.hideLoading();
  }

  methods = {
    addRecord() {
      console.log('mixins addRecord.... ')
      wx.navigateTo({
        url: this.add_url
      })
    },
    // searchRecords(searchValue, evt){
    //   console.log('mixins searchRecords.....')
    //   this.searchRecords(searchValue, evt)
    // }
  };

  getExpand(field){
    let fieldArr = field.split('.');
    if(fieldArr.length > 1){
      //        expand.push(`${avatar[0]}($select=${avatar_field.substr(avatar_field.indexOf('.') + 1, avatar_field.length)})`)

      return `${fieldArr[0]}($select=${fieldArr[1]})`
    }
  }

  getFieldValue(field, value){
    if(!value){
      return ''
    }

    let fieldArr = field.split('.');
    if(fieldArr.length > 1){
      return this.getFieldValue(field.substr(field.indexOf('.') + 1, field.length), value[fieldArr[0]])
    }else{
      return value[fieldArr[0]]
    }
  }

  async loadRecords(searchValue) {
    wepy.showLoading({
      title: '加载中',
      mask: true
    });

    const skip = this.current_skip;
    const object_name = this.object_name;

    const options = {
      $count: true,
      $skip: skip,
      $top: DATA_LENGTH,
    };

    if(this.filter){
      options.$filter = this.filter
    }

    if(searchValue){
      if(options.$filter){
        options.$filter = options.$filter + `and (contains(${this.name_field},'${searchValue}'))`
      }else{
        options.$filter = `(contains(${this.name_field},'${searchValue}'))`
      }
    }

    let keys = ['space'];
    let expand = [];

    if(this.avatar_field){
      let avatar_field = this.avatar_field;
      let avatar = avatar_field.split('.');
      keys.push(avatar[0]);
      if(avatar.length > 1){
        expand.push(this.getExpand(avatar_field))
      }
    }

    if(this.name_field){
      let name_field = this.name_field;
      let name = name_field.split('.');
      keys.push(name[0]);
      if(name.length > 1){
        expand.push(this.getExpand(name_field))
      }
    }

    if(this.description_field){
      keys.push(this.description_field);
    }

    if(this.date_field){
      keys.push(this.date_field);
    }

    if (expand.length > 0) {
      options.$expand = expand.join(',')
    }

    options.$select = keys.join(",")

    if (this.allow_load) {

      const result = await this.$parent.query(object_name, options);
      if (result.value) {
        let records = []

        for(let record of result.value){

          if(this.avatar_field){
            record[this.avatar_field] = this.getFieldValue(this.avatar_field, record)
          }
          records.push(record)
        }
        this.record_list = this.record_list.concat(records)
      }
      this.current_skip = skip + result.value.length;
      if (this.current_skip === result['@odata.count']) {
        this.allow_load = false
      }
      this.$apply();
    }
    wepy.hideLoading();
    wx.stopPullDownRefresh();
  }

}
