Creator.Objects.vip_store =
	name: "vip_store"
	label: "门店"
	icon: "apps"
	fields:
        name:
            label:'店名'
            type:'text'
        description:
            label:'描述'
            type:'text'
        location:
            label:'位置'
            type:'location'
        contact:
            type:'text'
            label:'联系人'
        phone:
            type:'text'
            label:'联系电话'
        merchant:
            label:'商户'
            type:'master_detail'
            reference_to:'vip_merchant'
