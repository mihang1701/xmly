//下载列表
//https://www.ximalaya.com/revision/album/v1/getTracksList?albumId=42840618&pageNum=1&pageSize=100
//albumId 专辑id


//音频地址信息
//https://mpay.ximalaya.com/mobile/track/pay/365008470/1621084295873?device=pc&isBackend=true&_=1621084295873
//付费、vip专辑，仍然需要通过解密
var getMp3Url = function () {

    var Z = function (t, e) {
        return $(t) || Q(t, e) || J()
    };
    var $ = function (t) {
        if (Array.isArray(t))
            return t
    }
    function St(t, e) {
        for (var r, n = [], i = 0, o = "", a = 0; 256 > a; a++)
            n[a] = a;
        for (a = 0; 256 > a; a++)
            i = (i + n[a] + t.charCodeAt(a % t.length)) % 256,
                r = n[a],
                n[a] = n[i],
                n[i] = r;
        for (var s = i = a = 0; s < e.length; s++)
            i = (i + n[a = (a + 1) % 256]) % 256,
                r = n[a],
                n[a] = n[i],
                n[i] = r,
                o += String.fromCharCode(e.charCodeAt(s) ^ n[(n[a] + n[i]) % 256]);
        return o
    }
    var _t = St("xm", "Ä[ÜJ=Û3Áf÷N")
        , kt = [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]
        , At = function (t) {
            var e = St(function (t, e) {
                for (var r = [], n = 0; n < t.length; n++) {
                    for (var i = "a" <= t[n] && "z" >= t[n] ? t[n].charCodeAt() - 97 : t[n].charCodeAt() - "0".charCodeAt() + 26, o = 0; 36 > o; o++)
                        if (e[o] == i) {
                            i = o;
                            break
                        }
                    r[n] = 25 < i ? String.fromCharCode(i - 26 + "0".charCodeAt()) : String.fromCharCode(i + 97)
                }
                return r.join("")
            }("d" + _t + "9", kt), function (t) {
                if (!t)
                    return "";
                var e, r, n, i, o, a = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
                for (i = (t = t.toString()).length,
                    n = 0,
                    o = ""; n < i;) {
                    do {
                        e = a[255 & t.charCodeAt(n++)]
                    } while (n < i && -1 == e); if (-1 == e)
                        break;
                    do {
                        r = a[255 & t.charCodeAt(n++)]
                    } while (n < i && -1 == r); if (-1 == r)
                        break;
                    o += String.fromCharCode(e << 2 | (48 & r) >> 4);
                    do {
                        if (61 == (e = 255 & t.charCodeAt(n++)))
                            return o;
                        e = a[e]
                    } while (n < i && -1 == e); if (-1 == e)
                        break;
                    o += String.fromCharCode((15 & r) << 4 | (60 & e) >> 2);
                    do {
                        if (61 == (r = 255 & t.charCodeAt(n++)))
                            return o;
                        r = a[r]
                    } while (n < i && -1 == r); if (-1 == r)
                        break;
                    o += String.fromCharCode((3 & e) << 6 | r)
                }
                return o
            }(t)).split("-")
                , r = Z(e, 4)
                , n = r[0];
            return {
                sign: r[1],
                buy_key: n,
                token: r[2],
                timestamp: r[3]
            }
        }

    function xt(t) {
        this._randomSeed = t,
            this.cg_hun()
    }
    xt.prototype = {
        cg_hun: function () {
            this._cgStr = "";
            var t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890"
                , e = t.length
                , r = 0;
            for (r = 0; r < e; r++) {
                var n = this.ran() * t.length
                    , i = parseInt(n);
                this._cgStr += t.charAt(i),
                    t = t.split(t.charAt(i)).join("")
            }
        },
        cg_fun: function (t) {
            t = t.split("*");
            var e = ""
                , r = 0;
            for (r = 0; r < t.length - 1; r++)
                e += this._cgStr.charAt(t[r]);
            return e
        },
        ran: function () {
            return this._randomSeed = (211 * this._randomSeed + 30031) % 65536,
                this._randomSeed / 65536
        },
        cg_decode: function (t) {
            var e = ""
                , r = 0;
            for (r = 0; r < t.length; r++) {
                var n = t.charAt(r)
                    , i = this._cgStr.indexOf(n);
                -1 !== i && (e += i + "*")
            }
            return e
        }
    };

    return function (t) {
        function toUrl() {
        }
        toUrl.stringfy = function (t) { var e = []; for (var r in t) if (t.hasOwnProperty(r)) { var n = encodeURIComponent(t[r]), i = encodeURIComponent(r); e.push("".concat(i, "=").concat(n)) } return e.join("&") }
        var i = t.seed
            , o = t.fileId
            , a = t.ep
            , s = t.duration
            , u = t.domain
            , l = t.apiVersion
            , c = function (t, e) {
                var r = new xt(t).cg_fun(e);
                return "/" === r[0] ? r : "/".concat(r)
            }(i, o)
            , f = At(a);
        f.duration = s;
        var d = u
            , h = "".concat(d, "/download/").concat(l).concat(c)
            , p = "".concat(h, "?").concat(toUrl.stringfy(f));
        return p;
    }
}();

module.exports = {
    getMp3Url
}
 

/* util._randomSeed = test.seed;
util.cg_hun();
h = "".concat(d, "/download/").concat(l).concat(c);
p = "".concat(h, "?").concat(e.stringfy(f));
console.log(At(test.ep)); */
//var getUrl = getMp3Url();
//console.log(getMp3Url(test));
//https://audiopay.cos.tx.xmcdn.com/download/1.0.0/storages/0b35-audiopay/5D/CB/CMCoOSYDpOnTADCwUgBvIsul.m4a?sign=791dfea7de1dae46ea715caeff6f3f28&buy_key=FM&token=7734&timestamp=1621084296&duration=393