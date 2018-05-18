Creator.Objects.post_comments =
	name: "post_comments"
	label: "评论"
	icon: "apps"
    enable_files:true
	fields:
        content:
            label:'评论内容'
            type:'textarea'
            required:true
        post_id:
            label:'评论对象'
            type:'lookup'
            reference_to:'vip_post'
