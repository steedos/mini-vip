const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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

  module.exports = {
    formatTime: formatTime,
    formatImageUrl: formatImageUrl,
    isTempFile: isTempFile,
  };
