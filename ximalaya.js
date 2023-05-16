const {
    getMp3Url
} = require("./util");
//SuperAgent是一个轻量级、灵活的、易读的、低学习曲线的客户端请求代理模块，使用在NodeJS环境中。
let superagent = require('superagent');
var fs = require('fs');
const request = require('request')
var j = request.jar()
var {cookie} = require("./config") //这里配置cookie
var cookie = request.cookie(cookie)
j.setCookie(cookie, "", function (err, cookie) { })
//获取某一个音频的播放地址或者播放信息
async function getDetail(trackId, cookie,isPaid) {
    var url = "";
    if(isPaid){//付费音频
       url = "https://mpay.ximalaya.com/mobile/track/pay/" + trackId + "/"+ new Date().getTime() +"?device=pc&isBackend=true";
    }else{
        url = "https://www.ximalaya.com/revision/play/v1/audio?id=" + trackId + "&ptype=1";
    }
    return new Promise((reslove, reject) => {
        superagent
            .get(url)
            .set({
                "Accept": "application/json",
                "Accept-Encoding": "gzip, deflate, br",
                //"Host": "www.vcg.com",
                //"Referer": 'https://www.vcg.com',
                //"X-Forwarded-For": "122.235.188.119",
                "Cookie": cookie,
            })
            .end((err, res) => {
                if (!err) {
                    reslove(JSON.parse(res.text));
                } else {
                    reject(err);
                    if (err) {
                        throw Error(err);
                        return
                    }

                }
            })
    })

}
//抓取专辑下载音频
function get(option) {
    var albumId = option.albumId ;
    var pageSize = option.pageSize || 100;
    var pageNum = option.pageNum || 1;
    var cookie = option.cookie;
    superagent.get("https://www.ximalaya.com/revision/album/v1/getTracksList?albumId=" + albumId + "&pageNum="+ pageNum +"&pageSize=" + pageSize)
        .set({
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate, br",
            //"Host": "www.vcg.com",
            //"Referer": 'https://www.vcg.com',
            //"X-Forwarded-For": "122.235.188.119",
            "Cookie": cookie,
        })
        .end(async function (err, res) {
            // 抛错拦截
            if (err) {
                throw Error(err);
                return
            }
            var obj = JSON.parse(res.text).data.tracks;
            fs.appendFile("./" + obj[0].albumTitle.replace(/[\\\\/:*?\"<>|]/g, "") + ".json", JSON.stringify(res.text), 'utf-8', function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("保存数据成功！")
                }
            });
            
            for (let index = 0; index < obj.length; index++) {
                let tmp = await getDetail(obj[index].trackId, cookie,obj[index].isPaid);
                if (tmp.ret != 0 && tmp.ret !=200) { //需付费购买
                    console.log('------------需付费---------------');
                    console.log(tmp)
                    return;
                }else if(tmp.ret == 999){
                    console.log('------------今天下载频繁---------------');
                    console.log(tmp)
                    return;
                }
                var albumTitle = obj[index].albumTitle.replace(/[\\\\/:*?\"<>|]/g, "");
                if (!fs.existsSync('./' + albumTitle + '/')) {
                    fs.mkdirSync('./' + albumTitle + '/');
                }
                var mediaUrl = "";
                if(obj[index].isPaid){
                    mediaUrl = getMp3Url(tmp)
                }else{
                    mediaUrl = tmp.data.src;
                }
                downLoadMp3(mediaUrl, obj[index].title.replace(/[\\\\/:*?\"<>|]/g, ""), './' + albumTitle + "/", cookie);
                console.log(mediaUrl);
            }
            if(Math.ceil(JSON.parse(res.text).data.trackTotalCount/pageSize) > option.pageNum){
                option.pageNum++;
                get(option);
            }        
            
        });
}
//音频下载管道
var downLoadMp3 = function (dir, name, filePath, cookie) {
    request({
        url: dir,
        jar: j
    }).pipe(fs.createWriteStream(filePath + name + '.m4a')).on('close', function () {
        console.log('saved' + name)
    })
}

//列表 albumId 专辑id pageSize 列表尺寸
//var url = 'https://www.ximalaya.com/revision/album/v1/getTracksList?albumId=42840618&pageNum=1&pageSize=100';
//音频信息  token/mp3url等
//https://mpay.ximalaya.com/mobile/track/pay/365008470/1621084295873?device=pc&isBackend=true
//免费专辑 https://www.ximalaya.com/revision/play/v1/audio?id=319475252&ptype=1

//调用
get({
    albumId:42840618, //专辑id
    pageSize:30,//分页
    pageNum:1, //起始页码
    cookie:cookie //登陆后喜马拉雅cookie
})
