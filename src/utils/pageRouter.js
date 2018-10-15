import wepy from 'wepy'

const TYPE = {
  NAVIGATETO: 'navigateTo',
  REDIRECTTO: 'redirectTo',
  SWITCHTAB: 'switchTab',
  NAVIGATEBACK: 'navigateBack',
  RELAUNCH: 'reLaunch'
};

class PageRouter{

  _enter = []; // [{page:'/index', script: function}]

  _exit = []; //TODO

  _app;

  /**
   * 跳转url中可以传入callBack函数作为回调
    pageRouter.navigateTo({
      url: url,
      callBack: () => {
        wepy.redirectTo({
          url: "/pages/visiting_card/home"
        });
      }
    });
   * 目标界面可以在保存按钮事件中识别这个callBack属性，存在时就执行这个callBack函数
   */
  // 
  callBack = null;

  go(type, object){
    for(let e of this._enter){
      if(e.page === object.url || object.url.startsWith(e.page + '?')){
        const v = e.script.call(this._app, object.url)
        if(v === false){
          return ;
        }
      }
    }
    this.callBack = object.callBack;
    return wepy[type](object)
  }

  navigateTo(object){
    return this.go(TYPE.NAVIGATETO, object)
  }

  redirectTo(object){
    return this.go(TYPE.REDIRECTTO, object)
  }

  switchTab(object){
    return this.go(TYPE.SWITCHTAB, object)
  }

  navigateBack(object){
    return this.go(TYPE.NAVIGATEBACK, object)
  }

  reLaunch(object){
    return this.go(TYPE.RELAUNCH, object)
  }

  pushEnter(enter){
    this._enter.push(enter)
  }

  setApp(app){
    this._app = app;
  }
}


export default new PageRouter()
