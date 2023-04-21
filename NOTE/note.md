## Note 
### Commands
```shell
py -3 -m venv venv
```

```shell
venv\Scripts\activate
```

```shell
pip install Flask
pip install Flask-Cors
pip install Flask-HTTPAuth
pip install Flask-Migrate
pip install Flask-SQLAlchemy
```

model
```shell
flask db init
flask db migrate
flask db upgrade
```

```shell
flask --debug run
```

### DONE
老人和员工的注册，登录
获取与修改信息
修改密码

service_type
脚本生成固定的几个类型（或者数据库定死）
由于频繁使用（前端反复用到），这个数据不在数据库中写死，直接内存中写死
两可之间，还是数据库中放

service
服务员可以 添加，修改，删除 （支持的service）
客户可以查看，搜索，筛选

#### service_record
status  状态，
0代表客户发起，
1代表接受，2代表拒绝，
3代表客户取消, 4代表 服务人员取消，
5代表 完成（服务人员要填写价格，时间，备注），6代表评价完成， 客户评分并写评论

用户（老人）可以
1. 购买服务，生成 service_record
2. 查看购买过的服务 service_records， 联系服务员
3. 可以取消 （状态由 1 -> 3 )
4. 可以评价 ( 状态由 5 -> 6 )  客户评分并写评论

服务员可以
0. 查看 老人们的 服务记录申请
1. 接受 ( 状态由 0 -> 1 )
2. 拒绝 ( 状态由 0 -> 2 )
3. 取消 ( 状态由 1 -> 4 )
4. 完成 ( 状态由 1 -> 5 )   服务人员要填写价格，时间，备注

### TODO
并且可以选择（购买），选择后生成 service_record
service_record 相关操作
- 服务员查看，确认 / 拒绝
- 确认后，老人取消 / 服务员取消

- 服务删除 改为 服务下架

### TEST
POSTMAN 测试说明

> 需要reset数据库再运行

#### Create Users
创建老人和服务员

#### Care Add Service
服务员创建服务, 修改与删除服务

#### Elder buy service
测试 service record 的 购买（生成）
搜索展示


### Others
用户的删除功能暂时不做
牵涉比较麻烦

逼不得已。。。只能写出奇葩的解决方案
两个api的model中有互相引用，导致import错误
所以将导致互相引用的部分，用函数传参的思路解决。
方案暂时解决了问题。。。

### Question
一个账号，可以绑定几个老人


用户是否拆分
- 不拆分，用字段去区分老人和服务员
- 拆分，如何处理登录部分逻辑, 初步猜想： 分成两个api去处理


### Data
