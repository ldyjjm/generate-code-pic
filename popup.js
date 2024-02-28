const getLocalIP = async () => {
  try {
      const url = 'http://localhost:7267/getCurrentIp?type=en0'
      const response = await fetch(url);
      return response.json()
  } catch (e) {
      return null
  }
}

const handleFn = async ()=>{
  const { data = [] } = await getLocalIP() || {};
    let ip = ''
    if (data?.length) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i]
            const reg = /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/
            if (reg.test(item.address)) {
                ip = item.address
                return ip
            }
        }
    }
    return ip
}
  
chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
    if (tabs.length > 0) {
      const currentTab = tabs[0];
      const currentURL = currentTab.url;
      const ipt = document.getElementById('ipt')
      let finalUrl = currentURL
      if(finalUrl.includes('localhost')){
        const ip = await handleFn() 
        finalUrl = finalUrl.replace('localhost',ip)
      }
      ipt.innerHTML = finalUrl
      new QRCode(document.getElementById("qrcode"), {
        text: finalUrl, // 设置要生成二维码的链接
        width: 200, // 设置二维码的宽度
        height: 200, // 设置二维码的高度
        colorDark : "#000000", // 设置二维码的前景色
        colorLight : "#ffffff", // 设置二维码的背景色
        correctLevel : QRCode.CorrectLevel.H // 设置二维码的纠错级别
      });
    }
});