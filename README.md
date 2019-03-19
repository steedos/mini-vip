# 华炎微站、微商城小程序

华炎微站是华炎公司最新发布的的自助式微站解决方案，帮助用户0成本搭建移动互联网时代的移动信息门户和电子商务平台。

华炎微站的小程序端和服务端的源码都是完全公开的。并已经服务于多个大型项目。

### 界面效果图
![界面效果图](docs/images/ui1.jpg)

### 微信扫码访问小程序
![界面效果图](docs/images/qrcode.jpg)

### 动态界面
华炎微站的后台管理界面，均根据服务端配置的数据模型自动生成，当服务端的数据模型发生变更时，无需修改小程序端的代码。

# 服务端

华炎微站服务端基于Creator快速开发平台构建。可通过以下地址访问数据模型设计。

### 商户
- [商户](https://github.com/steedos/creator/blob/master/packages/steedos-creator/models/space.coffee)
- [员工](https://github.com/steedos/creator/blob/master/packages/steedos-creator/models/space_user.coffee)
- [门店](https://github.com/steedos/creator/tree/master/packages/steedos-vip-card/models)
- [门店WIFI](https://github.com/steedos/creator/blob/master/packages/steedos-vip-card/models/vip_wifi.coffee)

### 微站
- [文章](https://github.com/steedos/creator/blob/master/packages/steedos-post/models/post.coffee)
- [栏目](https://github.com/steedos/creator/blob/master/packages/steedos-post/models/post_category.coffee)
- [评论](https://github.com/steedos/creator/blob/master/packages/steedos-post/models/post_comments.coffee)
- [主菜单](https://github.com/steedos/creator/blob/master/packages/steedos-vip-card/models/vip_menu.coffee)

### 微商城
- [商品](https://github.com/steedos/creator/blob/master/packages/steedos-vip-card/models/vip_product.coffee)
- [分类](https://github.com/steedos/creator/blob/master/packages/steedos-vip-card/models/vip_product_category.coffee)
- [订单](https://github.com/steedos/creator/blob/master/packages/steedos-vip-card/models/vip_order.coffee)
- [会员卡](https://github.com/steedos/creator/blob/master/packages/steedos-vip-card/models/vip_card.coffee)

### API 接口
对于以上定义的数据模型，Creator自动生成基于国际标准[ODATA](http://www.odata.org/)协议的API接口。华炎微站小程序基于ODATA接口查询Creator中的业务数据并执行增删改操作。
- [身份验证](https://github.com/steedos/help/blob/master/zh-cn/creator/odata_auth.md): 访问ODATA接口必须提供用户身份信息，用户只能在权限范围内进行数据查询和修改
- [获取数据字典](https://github.com/steedos/help/blob/master/zh-cn/creator/odata_metadata.md)：通过接口获取业务数据的数据结构
- [业务数据查询](https://github.com/steedos/help/blob/master/zh-cn/creator/odata_query.md): 通过接口查询业务数据，可执行多字段组合查询
- [业务数据新增](https://github.com/steedos/help/blob/master/zh-cn/creator/odata_add.md)：通过接口新增一条业务数据记录
- [业务数据编辑](https://github.com/steedos/help/blob/master/zh-cn/creator/odata_edit.md)：通过接口编辑更新指定一条业务数据记录
- [业务数据删除](https://github.com/steedos/help/blob/master/zh-cn/creator/odata_delete.md)：通过接口删除指定的一条业务数据记录


### 关于Steedos 对象服务器

Steedos 是华炎公司整合近20年的系统开发经验，推出的一套极简开发工具。IT人员的核心任务不再是编码，而是转变为和业务人员沟通业务需求，并配置业务对象。只需要业务对象确定了，Steedos即可自动生成手机、平板、电脑三合一的业务系统，包含完整的数据浏览、管理、统计分析功能。

![界面效果图](https://www.steedos.com/cn/help/creator/images/mac_ipad_iphone_home.png)

最重要的是，当业务人员提出需求变更时，也只需简单的调整业务模型即可完成，不再需要繁重的编码、调试、测试、发布等一整套复杂的流程。

我们的数据统计显示，Steedos可以节约软件开发成本80%，周期更可以缩短到1周以内。

  - 列表: 快速浏览、查询业务数据
  - 查看: 查看业务数据的详细信息，以及相关的子表数据
  - 编辑: 编辑业务数据，管理员可设定用户可修改的字段
  - 搜索: 可执行多关键词组合检索，可一次性在所有业务对象中搜索数据
  - 统计: 用户可创建列表、分组报表、二维表进行统计分析，并可自动生成图形化报表
  - 附件: 可以管理具体的业务对象的附件，附件支持版本控制
  - 讨论，可以针对具体的业务数据进行讨论和回复
  - 任务: 可以针对具体的业务数据创建待办任务
  - 数据导入: 如果您的Excel表格中已经有初始业务数据，可以快速导入系统中
  - 修改历史: 自动记录用户对业务数据的修改历史
  - 回收站: 系统内置回收站功能，对于误删除的记录可以一键恢复

[了解更多](https://steedos.github.io/)

