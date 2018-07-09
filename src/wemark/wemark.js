var Remarkable = require('./remarkable');
var parser = new Remarkable({
	html: true
});

function parse(md, page, options){

	if(!options) options = {};
	if(!options.name) options.name = 'wemark';

	var tokens = parser.parse(md, {});

	// markdwon渲染列表
	var renderList = [];
	// 图片高度数组
	var imageHeight = {};
	// 返回的数据
	var ret = {
		renderList: renderList,
		imageHeight: imageHeight
	};

	var env = [];
	// 记录当前list深度
	var listLevel = 0;
	// 记录第N级ol的顺序
	var orderNum = [0, 0];
	var tmp;

	// 转换PC站点URL为小程序Path，如果无法转换则返回空
	// 如果以'/pages/'开头，则直接返回url
	// 如果格式为：http://{space_id}.hotoa.com/{object_name}/{record_id}，则转换成对应小程序路径
	// 小程序路径规则：
	// 如果object_name为空，返回工作区主页=/pages/space/index?space_id={space_id}
	// 如果record_id为空，object_name不为空，返回object主页（显示object列表）=/pages/{object_name}/index?space_id={space_id}
	// 如果record_id不为空，返回record页=/pages/{object_name}/view?space_id={space_id}&{object_name}_id={record_id}
	var convertPath = function(url){
		var path = "";
		if(!url){
			return path;
		}

		var reg = /^\/pages\//;
		if (reg.test(url)) {
		  return url;
		}

		reg = /^http(s?):\/\/\w+\.hotoa\.com/;
		if(!reg.test(url)){
			return path;
		}
		// reg = /http(s?):\/\/(?<space_id>\w+)\.hotoa\.com(\/(?<object_name>\w+))?(\/(?<record_id>\w+))?/;
		// 不支持上述的分组命名来捕获匹配，只能用下面的分组索引的方式来解决
		reg = /http(?:s?):\/\/(\w+)\.hotoa\.com(?:\/(\w+))?(?:\/(\w+))?/;
		//该正则匹配的数组结果为['匹配的完整url','space_id','object_name','record_id']
		var matchs = url.match(reg);
		var space_id = matchs[1];
		var object_name = matchs[2];
		var record_id = matchs[3];
		if (object_name) {
			if (record_id) {
				path = "/pages/" + object_name + "/view?space_id=" + space_id + "&" + object_name + "_id=" + record_id;
			}
			else{
				path = "/pages/" + object_name + "/index?space_id=" + space_id;
			}
		}
		else{
			path = "/pages/space/index?space_id=" + space_id;
		}
		return path;
	}

	// 获取inline内容
	var getInlineContent = function(inlineToken){
		var ret = [];
		var tempType;
		var tempUrl;

		if(inlineToken.type === 'htmlblock'){
			// 匹配video
			// 兼容video[src]和video > source[src]
			var videoRegExp = /<video.*?src\s*=\s*['"]*([^\s^'^"]+).*?(poster\s*=\s*['"]*([^\s^'^"]+).*?)?(?:\/\s*\>|<\/video\>)/g;

			var match;
			var html = inlineToken.content.replace(/\n/g, '');
			while(match = videoRegExp.exec(html)){
				if(match[1]){
					var retParam = {
						type: 'video',
						src: match[1]
					};
					
					if(match[3]) {
						retParam.poster = match[3];
					}
					
					ret.push(retParam);
				}
			}
		}else{
			inlineToken.children && inlineToken.children.forEach(function(token, index){
				if(['text', 'code'].indexOf(token.type) > -1){
					ret.push({
						type: tempType || token.type,
						content: token.content,
						url: tempUrl
					});
					tempType = '';
				}
				else if(['softbreak', 'hardbreak'].indexOf(token.type) > -1){ 
					ret.push({ type: 'text', content: '\r\n\r\n' }); 
					tempType = ''; 
				}
				else if(token.type === 'del_open'){
					tempType = 'deleted';
				}else if(token.type === 'strong_open'){
					tempType = 'strong';
				}else if(token.type === 'em_open'){
					tempType = 'em';
				} else if (token.type === 'link_open') {
					tempUrl = convertPath(token.href);
					if (tempUrl){
						tempType = 'link';
					}
				}else if(token.type === 'image'){
					var imageSrc = token.src;
					// 配置了imagePathPrefix则加上前缀
					if (options.imagePathPrefix && !/^\w+:\/\//.test(imageSrc)) {
						imageSrc = options.imagePathPrefix + imageSrc;
					}
					ret.push({
						type: tempType || token.type,
						url: tempUrl,
						src: imageSrc,
						alt: token.alt
					});
				}
			});
		}

		return ret;
	};

	var getBlockContent = function(blockToken, index){
		if(blockToken.type === 'htmlblock'){
			return getInlineContent(blockToken);
		}else if(blockToken.type === 'heading_open'){
			return {
				type: 'h' + blockToken.hLevel,
				content: getInlineContent(tokens[index+1])
			};
		}else if(blockToken.type === 'paragraph_open'){
			var type = 'p';
			var prefix = '';
			if(env.length){
				prefix = env.join('_') + '_';
			}

			var content = getInlineContent(tokens[index+1]);

			// 处理ol前的数字
			if(env[env.length - 1] === 'li' && env[env.length - 2] === 'ol'){
				content.unshift({
					type:'text',
					content:orderNum[listLevel - 1] + '. '
				});
			}

			return {
				type: prefix + 'p',
				content: content
			};
		}else if(blockToken.type === 'fence'){
			return {
				type: 'code',
				content: blockToken.content
			};
		}else if(blockToken.type === 'bullet_list_open'){
			env.push('ul');
			listLevel++;
		}else if(blockToken.type === 'ordered_list_open'){
			env.push('ol');
			listLevel++;
		}else if(blockToken.type === 'list_item_open'){
			env.push('li');
			if(env[env.length - 2] === 'ol' ){
				orderNum[listLevel - 1]++;
			}
		}else if(blockToken.type === 'list_item_close'){
			env.pop();
		}else if(blockToken.type === 'bullet_list_close'){
			env.pop();
			listLevel--;
		}else if(blockToken.type === 'ordered_list_close'){
			env.pop();
			listLevel--;
			orderNum[listLevel] = 0;
		}else if(blockToken.type === 'blockquote_open'){
			env.push('blockquote');
		}else if(blockToken.type === 'blockquote_close'){
			env.pop();
		}else if(blockToken.type === 'tr_open'){
			tmp = {
				type: 'table_tr',
				content:[]
			};
			return tmp;
		}else if(blockToken.type === 'th_open'){
			tmp.content.push({
				type: 'table_th',
				content: getInlineContent(tokens[index+1]).map(function(inline){return inline.content;}).join('')
			});
		}else if(blockToken.type === 'td_open'){
			tmp.content.push({
				type: 'table_td',
				content: getInlineContent(tokens[index+1]).map(function(inline){return inline.content;}).join('')
			});
		}
	};

	tokens.forEach(function(token, index){
		var blockContent = getBlockContent(token, index);
		if(!blockContent) return;
		if(!Array.isArray(blockContent)){
			blockContent = [blockContent];
		}
		blockContent.forEach(function(block){
			if(Array.isArray(block.content)){
				block.isArray = true;
			}else{
				block.isArray = false;
			}
			renderList.push(block);
		});
	});

	// var obj = {};
	// obj[options.name] = ret;
	// page.setData(obj);

	page[options.name] = ret;
	page.$apply();
}

module.exports = {
	parse: parse
};
