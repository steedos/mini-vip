# 会员服务台

### 业务逻辑规范
- 任何一个人第一次使用卡券助手，自动创建users记录，并将userId保存在本地存储
- 微信用户在第一次浏览商户时，自动创建space_user记录
- 当用户点击“使用微信账户登录”后，将微信账户关联到本地UserId
- 每个商户是一个工作区
- 每个工作区可以配置多个门店
- 每个微信用户在一个工作区下只能申请一张会员卡
- 微信用户在工作区下没有会员卡时，显示“激活会员卡”按钮（激活卡服务）
- 微信用户在工作区下已有会员卡时，显示会员卡信息
- 微信用户浏览每一项服务均需将浏览记录保存到服务端（最近查看）
- 每个商户页面都需要额外传入space=?参数，方便转发

### 页面路径规范
- index 卡券助手，浏览我的所有会员卡
- me 卡券助手/我的资料
- me_profile 编辑我的资料
- home 商户主页，最上面显示3条最新的动态，下面显示联系方式
- apps 商户服务台
- card 商户会员卡，显示我在此商户的会员卡信息
- card_activate 激活会员卡（如果没有卡）
- card_recharge 会员卡充值
- card_billing 会员卡消费记录
- posts 最新动态
- post 查看动态
- wifi 连接WIFI
- stores 门店列表
- store 门店显示
- tickets 投诉建议列表
- ticket 投诉建议显示
- knowledges 会员指南
- knowledge 会员指南显示


### 页面初始化

用户有可能扫码打开系统的任何一个页面，因此需要做统一的初始化。
- 在页面的onLoad函数中调用 $.parent.vipInitialize(options) 进行初始化。
- 通过 $.parent.globalData 获取相关信息。

vipInitialize(options) 执行以下操作
- 用户验证
  - wx.login() 获取 code
  - 调用接口 /mini/vip/sso?code=xxx&old_user_id=yyy&old_auth_token=yyy
  - 在服务端使用 code 去服务器获取 open_id，session_key
  - 根据open_id + appId 获取用户，如果获取不到，则新增用户，并生成新auth_token并返回 open_id, user_id, auth_token
  - 判断 open_id 与 old_user_id 如果是同一个人
     - 如果auth_token有效，直接返回 open_id, user_id, auth_token
     - 如果auth_token失效，生成新的auth_token并返回 open_id, user_id, auth_token
  - 如果不是同一个人，则以open_id找到的用户为准，生成新的auth_token并返回 open_id, user_id, auth_token
  - 前台获取返回结果并写入 globalData.user 对象
- space 初始化
  - 如果options传入space_id参数，并且与本地space._id不同，调用odata接口获取space信息并写入globalData.space
- store 初始化
  - 如果options传入store_id参数，并且与本地store._id不同，调用odata接口获取space信息并写入globalData.store
- card 初始化
  - 如果options传入card_id参数，并且与本地不同，调用odata接口获取space信息并写入globalData.card

### globalData
- user 当前用户信息
  - _id
  - auth_token
  - open_id
  - union_id
  - session_key
  - name
  - mobile
  - sex
- space 当前访问的商户
  - _id
  - name
- store 当前访问的门店
  - _id
  - name
- card 当前访问的会员卡
  - _id
  - name
  - card_no


### 数据缓存
app.onLaunch 事件中，localStorage.globalData 写入 app.globalData
app.onHide 事件中，app.globalData 写入 localStorage.globalData


### ODATA接口
$.parent 中提供以下接口，如果接口失败，统一显示错误提示，并返回-1。 如果接口成功，返回结果。
- 数据查询 query(object_name, query_options)
- 数据新增 insert(object_name, data)
- 数据修改 update(object_name, _id, data)
- 数据修改 delete(object_name, _id)
- 上传照片 uploadImages(file_name, file_path)，返回 cfs_images 对象

界面反馈
- 调用接口时，显示导航条加载动画：wx.showNavigationBarLoading()
- 接口调用完成时，隐藏导航条加载动画：wx.hideNavigationBarLoading()
