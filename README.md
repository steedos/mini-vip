# 会员服务台

### 系统表结构
- 会员卡：https://github.com/steedos/creator/blob/vip/packages/steedos-vip-card/models/vip_card.coffee
- 消费记录：https://github.com/steedos/creator/blob/vip/packages/steedos-vip-card/models/vip_billing.coffee
- 卡类型：https://github.com/steedos/creator/blob/vip/packages/steedos-vip-card/models/vip_category.coffee
- 优惠券：https://github.com/steedos/creator/blob/vip/packages/steedos-vip-card/models/vip_coupon.coffee
- 积分：https://github.com/steedos/creator/blob/vip/packages/steedos-vip-card/models/vip_points.coffee
- 门店：https://github.com/steedos/creator/blob/vip/packages/steedos-vip-card/models/vip_store.coffee
- 门店wifi：https://github.com/steedos/creator/blob/vip/packages/steedos-vip-card/models/vip_wifi.coffee
- 热点信息：https://github.com/steedos/creator/tree/vip/packages/steedos-post/models
- 评论：指的是对热点信息的评论https://github.com/steedos/creator/blob/vip/packages/steedos-post/models/post_comments.coffee
- 收藏：指的是对热点信息的收藏https://github.com/steedos/creator/blob/vip/packages/steedos-post/models/post_star.coffee
- 活动： https://github.com/steedos/creator/blob/vip/packages/steedos-vip-card/models/vip_event.coffee

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
index 卡券助手，浏览我的所有会员卡

me 我的
- me/index 卡券助手/我的资料
- me/profile 编辑我的资料

space/ 商户
- space/index 商户主页，最上面显示3条最新的动态，下面显示联系方式
- space/apps 商户服务台
- space/list 管理商户
- space/register 商户入驻

card/ 会员卡
- card/index 商户会员卡，显示我在此商户的会员卡信息
- card/activate 激活会员卡（如果没有卡）
- card/recharge 会员卡充值
- card/billing 会员卡消费记录

store/ 门店
- store/index 门店列表
- store/view 门店显示

post/ 动态
- post/index 最新动态
- post/view 查看动态
- post/add 发布动态
- post/comment 评论

wifi/
- wifi/index 连接WIFI

record/ Object自动生成表单
- record/list
- record/add
- record/edit
- record/view
- record/search

edit/ 编辑控件
- edit/select
- edit/lookup

### 应用初始化 onLaunch
- 在App的onLaunch函数中调用 login(options) 进行登录。
  - wx.login() 获取 code
  - 调用接口 /mini/vip/sso?code=xxx&old_user_id=yyy&old_auth_token=yyy&space_id=zzz
  - 在服务端使用 code 去服务器获取 open_id，session_key
  - 根据open_id + appId 获取用户，如果获取不到，则新增用户，并生成新auth_token并返回 open_id, user_id, auth_token
  - 判断 open_id 与 old_user_id 如果是同一个人
     - 如果auth_token有效，直接返回 open_id, user_id, auth_token
     - 如果auth_token失效，生成新的auth_token并返回 open_id, user_id, auth_token
  - 如果不是同一个人，则以open_id找到的用户为准，生成新的auth_token并返回 open_id, user_id, auth_token
  - 如果当前用户不属于对应工作区，自动加入，space_user.profile = "guest"
  - 前台获取返回结果并写入 globalData.user 对象


### 页面初始化 onLoad
  - 定义为异步： async onLoad()
  - 如果 query 传入 space_id, store_id，则调用cache函数初始化相关对象。


### 读取记录并缓存
在页面中可以调用方法 await this.$parent.cache(object_name, _id) 获取对象缓存数据。
- 先判断 globalData[object_name] 存在且不为空对象，表示有缓存
- 如果不传入 id，直接返回本地数据
- 判断缓存的对象 id 是否相同，如果相同直接返回
- 如果不同，调用get接口获取数据并保存到 globalData[object_name]
- 如果接口调用失败，也保存一个空对象到 globalData[object_name], 避免页面调用时报错
对于不需要缓存的数据，请使用标准的 this.$parent.get 函数

### globalData
- userInfo wx.getUserInfo返回的userInfo
  - avatarUrl
  - city
  - ...
  - province
- space_id 当前用户进入的space
- user 当前用户信息
  - _id
  - auth_token
  - open_id
  - union_id
  - session_key
  - name
  - mobile
  - sex
- {object_name} 每个对象会缓存最近一条记录
  - _id
  - name
  - ...
  - modified


### 本地存储
- globalData 缓存
  - app.onLaunch 事件中，localStorage.globalData 写入 app.globalData
  - app.onHide 事件中，app.globalData 写入 localStorage.globalData
- 列表缓存，直接写入 localStorage[object_name]


### API 接口
this.$parent 中提供以下接口，如果接口失败，统一显示错误提示，并返回-1。 如果接口成功，返回结果。
- 查询列表 await query(object_name, query_options)
- 记录读取 await get(object_name, _id)
- 数据新增 await insert(object_name, data)
- 数据修改 await update(object_name, _id, data)
- 数据修改 await delete(object_name, _id)
- 上传照片 await uploadImages(file_name, file_path)，返回 cfs_images 对象

### 界面反馈
- 调用接口时，显示导航条加载动画：wx.showNavigationBarLoading()
- 接口调用完成时，隐藏导航条加载动画：wx.hideNavigationBarLoading()

### 信息发布
type 分类，每种type在前台用不同的页面风格显示
- announcements 公告
- about 关于我们
- news 新闻
- employees 团队
- products 产品
- services 服务
- course 线上课程
- activity 线下活动
- jobs 工作机会
- help 帮助
- coupon 优惠卷
- red_packet 红包

mine_type 内容样式 每种分类在详细页有不同的风格显示
- article 文章，文章的最后可以配照片，列表显示第一张照片、文章和摘要。一篇文章最多可以传9个照片。点开详细信息可以看到照片。
- photo 照片，列表页显示为各照片的缩略图，点击可滑动显示当前文章的所有照片。一篇文章最多可以传9个照片。
- video 视频，列表页显示为视频，点击即播放视频，只能传一个附件
- music 音乐，列表点击可以播放，只能传一个附件

### 统一登录界面，确保手机号唯一
- 禁止在非手机号登录界面通过`<button open-type="getPhoneNumber"></button>`获取用户手机号，应该使用`globalData.user.mobile`
- 凡是需要用户输入的界面，请在onLoad函数中添加这个代码：`this.$parent.checkMobile();`
- 禁止非手机号登录接口修改user.mobile

