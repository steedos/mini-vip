import wepy from 'wepy'
import { baseUrl } from '@/config';
import pageRouter from '@/utils/pageRouter';
import _ from 'underscore';

const PAGESIZE = 15;

export default class recordList extends wepy.mixin {
  data = {
    record_list: [],
    style_list: {},
    object_name: '',
    space_id: '',
    baseUrl: baseUrl,
    current_skip: 0,
    allow_load: true,
    is_loaded: false,
    avatar_field: '',
    name_field: '',
    price_field:'',
    description_field: '',
    date_field: '',
    searchPlaceholder: '搜索',
    allowCreate: false,
    filter: '',
    url: '/pages/record/edit',
    add_url: '/pages/record/create',
    navigationBarTitle: '',
    orderby: '',
    extra_fields: '',
  };

  dataRefresh() {
    this.record_list = [];
    this.allow_load = true;
    this.current_skip = 0;
    this.loadRecords();
  }

  onPullDownRefresh() {
    this.dataRefresh();
  }

  onReachBottom() {
    console.log('onReachBottom...')
    this.loadRecords();
  }

  searchRecords(searchValue, evt){
    this.record_list = [];
    this.allow_load = true;
    this.current_skip = 0;
    this.loadRecords(searchValue);
  }

  //onLoad之前做一些初始化
  async init() {

  }

  //点击单条记录时，跳转的页面
  getRecordUrl(e){
    let url = this.url;

    if(e.url){
      url = e.url
    }

    let joiner = '?';

    if(url.indexOf('?') > -1){
      joiner = '&';
    }

    url = url + joiner + 'action=edit&object_name=' + this.object_name;
    return url
  }

  //点击添加按钮时，跳转的页面
  getAddUrl(e){
    let add_url = this.add_url;

    if(e.add_url){
      add_url = e.add_url
    }

    let joiner = '?';

    if(add_url.indexOf('?') > -1){
      joiner = '&';
    }

    add_url = add_url + joiner + 'object_name=' + this.object_name + '&space_id=' + this.space_id + "&store_id=" + this.space_id;
    return add_url
  }

  async getQueryFilter(e){
    return e.filter || this.filter
  }

  getFinalExpand(expand) {
    return expand.join(',')
  }

  getQueryOptions(searchValue){
    const options = {
      $count: true,
      $skip: this.current_skip,
      $top: this.pageSize || PAGESIZE,
    };

    if(this.filter){
      options.$filter = this.filter
    }

    if(searchValue){
      if(options.$filter){
        options.$filter = options.$filter + ` and (contains(${this.name_field},'${searchValue}'))`
      }else{
        options.$filter = `(contains(${this.name_field},'${searchValue}'))`
      }
    }

    let keys = ['space','owner'];
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
    if(this.price_field){
      keys.push(this.price_field);
    }
    if (expand.length > 0) {
      options.$expand = this.getFinalExpand(expand);
    }

    if (this.orderby) {
      options.$orderby = this.orderby;
    }

    console.log('this.fields', this.fields);
    if(this.fields){
      keys = keys.concat(this.fields);
    }

    options.$select = keys.join(",");

    if(this.extra_fields){
      options.$select = options.$select + ',' + this.extra_fields
    }

    return options;
  }

  //点击添加按钮时触发
  addRecord(){
    console.log('mixins addRecord.... ')
    pageRouter.navigateTo({
      url: this.add_url
    })
  }

  async onLoad(e) {
    console.log('mixin onLoad...', this.object_name, this.baseUrl, e);
    if (this.beforeOnLoad) {
      console.log('mixin beforeOnLoad...', e);
      await this.beforeOnLoad(e);
    }
    wx.showNavigationBarLoading();

    if(!e){
      throw new Error('缺少参数:space_id,object_name')
    }

    if(!e.object_name && !this.object_name){
      throw new Error('缺少参数:object_name')
    }

    this.space_id = e.space_id;
    this.object_name = e.object_name || this.object_name;
    this.avatar_field = e.avatar_field || this.avatar_field;
    this.name_field = e.name_field || this.name_field || 'name';
    this.description_field = e.description_field || this.description_field;
    this.date_field = e.date_field || this.date_field;
    this.price_field = e.price_field;
    this.url = this.getRecordUrl(e);

    this.add_url = this.getAddUrl(e);

    await this.init();

    this.filter = await this.getQueryFilter(e);

    const object = await this.$parent.getObject(this.object_name, e.space_id);

    this.allowCreate = object.allowCreate;
    if(e.allow_create === 'true'){
      this.allowCreate = true
    } else if (e.allow_create === 'false'){
      this.allowCreate = false
    }
    this.searchPlaceholder = '搜索'; // + object.label;

    wx.setNavigationBarTitle({
      title: this.navigationBarTitle || object.label
    });
    await this.loadRecords()
    this.is_loaded = true
    this.$apply()
    wx.hideNavigationBarLoading();
  }

  methods = {
    addRecord() {
      this.addRecord()
    },
    touchstart(event) {
      const itemId = event.currentTarget.dataset.itemId;
      const positionX = event.touches[0].pageX;
      this.style_list[itemId] = {}
      this.style_list[itemId].positionX = positionX;
      this.$apply();
    },
    touchmove(event) {
      const itemId = event.currentTarget.dataset.itemId;
      const newPositionX = event.touches[0].pageX;
      const oldPositionX = this.style_list[itemId].positionX;
      const oldOffsetX = this.style_list[itemId].offsetX;
      const offsetX = newPositionX - oldPositionX;

      let new_style_list = {};
      new_style_list[itemId] = this.style_list[itemId];
      this.style_list = new_style_list;

      if (offsetX < 0) {
        if (oldOffsetX < 0 && oldOffsetX < offsetX) {
          this.style_list[itemId].offsetX = -60 + offsetX;
        } else {
          this.style_list[itemId].offsetX = offsetX;
        }
      } else if (offsetX > 0) {
        this.style_list[itemId].offsetX = 10;
      }
      this.$apply();
    },
    touchend(event) {
      const itemId = event.currentTarget.dataset.itemId;
      let offsetX = this.style_list[itemId].offsetX
      if ((-60 < offsetX && offsetX < -30) || offsetX < -60) {
        offsetX = -60;
      } else {
        offsetX = 0;
      }
      this.style_list[itemId].positionX = 0;
      this.style_list[itemId].offsetX = offsetX;
      this.$apply();
    },
    async deleteRecord(event) {
      const data = event.currentTarget.dataset
      const object_name = this.object_name;
      const recordId = data.recordId;
      const allowDelete = data.allowDelete;
      const spaceId = _.isObject(data.recordSpace) ? data.recordSpace._id : data.recordSpace;
      await this.$parent.delete(object_name, recordId, spaceId);
      await this.dataRefresh();
    }
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
    // wepy.showLoading({
    //   title: '加载中',
    //   mask: true
    // });
    const skip = this.current_skip;
    const object_name = this.object_name;

    const queryOptions = this.getQueryOptions(searchValue);
    if (this.allow_load) {
      const result = await this.$parent.query(object_name, queryOptions, this.space_id);
      if (result.value) {
        let records = [];
        for(let record of result.value){
          if(this.avatar_field){
            record[this.avatar_field] = this.getFieldValue(this.avatar_field, record)
          }
          const owner = _.isObject(record.owner) ? record.owner._id : record.owner
          record.allow_delete = await this.$parent.recordAllowDelete(object_name, owner, record.space)
          this.style_list[record._id] = {positionX: 0, offsetX: 0}
          records.push(record          )
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
