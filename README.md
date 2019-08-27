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


### 关于Steedos低代码开发平台

使用Steedos“低代码”开发平台，开发人员通过少量代码就可以构建企业级应用程序，一方面可以降低企业应用开发人力成本，另一方面可以将原有数月甚至数年的开发时间成倍缩短，从而帮助企业实现降本增效的价值。

![界面效果图](https://www.steedos.com/cn/help/creator/images/mac_ipad_iphone_home.png)

当业务需求扩张时，Steedos “低代码”平台创建的应用程序，可以轻松地进行定制和强化。例如，如果用户有了新的需求，那么开发人员可以在几个小时内完成应用程序的修改，以满足这些需求。

我们的数据统计显示，Steedos可以节约软件开发成本80%，周期更可以缩短到1周以内。

[了解更多](http://developer.steedos.com/)

