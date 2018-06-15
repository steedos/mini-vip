const formatTime = (date, joiner, hideSecond) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    if(!joiner){
      joiner = '/'
    }
    if(hideSecond){
      return [year, month, day].map(formatNumber).join(joiner) + ' ' + [hour, minute].map(formatNumber).join(':')
    }else{
      return [year, month, day].map(formatNumber).join(joiner) + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
  };

  const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n
  };

  const isTempFile = filePath => {
    return (new RegExp(":\/\/")).test(filePath)
  };

  const formatImageUrl = (src, baseUrl) => {
    if((new RegExp(":\/\/")).test(src)){
      return src;
    }else if(src){
      return baseUrl + "/api/files/images/" + src;
    }
  };

  function formatVideoUrl(src, baseUrl) {
    if(src){
      if((new RegExp(":\/\/")).test(src)){
        return src;
      }else {
        return baseUrl + "/api/files/videos/" + src;
      }
    }
    else{
      return "https://lg-769qcuso-1253849369.cos.ap-shanghai.myqcloud.com/empty.png";
    }
  }

  module.exports = {
    formatTime: formatTime,
    formatImageUrl: formatImageUrl,
    isTempFile: isTempFile,
    formatVideoUrl: formatVideoUrl
  };
