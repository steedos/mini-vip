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

### 本地储存的数据
- X-Space-Id 当前（或最近一次）访问的商户ID
- X-User-Id
- X-Auth-Token
- {spaceId} 记录工作区信息
  - name 工作区名称
- {spaceId}-user 记录用户信息
   - name 用户在当前工作区的名称
   - modified 记录修改信息
- {spaceId}-card 记录卡信息
   - name 商户名称
   - cards 在商户中办理的卡ID数组，目前只允许有一个
   
   
### 标准函数
- vip.getSpaceId()
- vip.getUserId()
- vip.getAuthToken()
- vip.getSpaceName()
- vip.getCard()
