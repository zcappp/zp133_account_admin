import React from "react"
import css from "../css/zp133_账号登录管理.css"

const TYPES = { register: "注册", changephone: "更改手机号", changemail: "更改邮箱", resetpassword: "重置密码", forgetpassword: "忘记密码" }
let rf, exc, rd, P, T, type, visible, account

function render() {
    if (!T.length) return <div>请右键配置属性</div>
    if (type && !T.includes(type) && !type.includes("login")) return <div>{"当前配置不允许" + type}</div>
    if (type === "注册") return rRegister()
    if (type === "更改手机号" || type === "更改邮箱") return rChange()
    if (type === "重置密码") return rReset()
    if (type === "忘记密码") return rForget()
    return <div className={"zp133" + type}>
        {(T.includes("微信扫码登录") && (T.includes("手机号登录") || T.includes("邮箱登录"))) && <div className="zp133toggle"><div onClick={() => {type = (type === "wxlogin" ? "formlogin" : "wxlogin"); rd()}}><svg viewBox="0 0 1024 1024"><path d={LoginType[type]}></path></svg></div></div>}
        {rLogin()}
    </div>
}

function init(ref) {
    rf = ref
    exc = ref.exc
    rd = ref.render
    P = ref.props
    T = P.type || []
    type = exc('$query').zp133
    if (Object.values(TYPES).includes(type)) {
        //
    } else if (TYPES[type]) {
        type = TYPES[type]
    } else {
        if (T.includes("微信扫码登录")) {
            type = "wxlogin"
            setTimeout(() => {
                log($(".zp133wxqr"))
                rf.render()
            }, 9)
        } else {
            type = "formlogin"
        }
    }
    account = T.includes("手机号登录") && T.includes("邮箱登录") ? "手机号 / 邮箱" : (T.includes("手机号登录") ? "手机号" : (T.includes("邮箱登录") ? "邮箱" : ""))
}

function rLogin() {
    if (type === "wxlogin") return <div className="zp133wxqr">
        <h2>微信登录</h2>
        {rd({ t: "WxQRLogin", s: "padding: 0px 25px;", p: { onEnd: P.onEnd } })}
        <h4>打开微信扫一扫即可登录</h4>
    </div>
    return <React.Fragment>
        <div><input className="zp133phone zinput" placeholder={account}/></div>
        <div>
            <input type={visible ? "" : "password"} className="zp133passwd zinput" placeholder="密码"/>
            <i onClick={() => {visible = !visible; rd()}}>{visible ? eye : eye0}</i>
        </div>
        <div onClick={login} className="zbtn zprimary">登录</div>
        <div className="zp133foot">
            {T.includes("注册") && !T.includes("微信扫码登录") && <a onClick={() => {type = "注册"; rd()}}>注册</a>}
            {T.includes("忘记密码") && <a onClick={() => {type = "忘记密码"; rd()}}>忘记密码</a>}
        </div>
    </React.Fragment>
}

function login() {
    const phone = $(".zp133phone").value
    const passwd = $(".zp133passwd").value
    if (!phone) return invalid("zp133phone", "请输入" + account)
    if (!passwd) return invalid("zp133passwd", "请输入密码")
    exc('$me.login(phone, passwd)', { phone, passwd }, onEnd)
}

function rRegister() {
    return <div className="zp133register">
        <div><input className="zp133phone zinput" placeholder={account}/></div>
        <div className="zp133code">
            <input type="tel" className="zinput" placeholder="验证码"/>
            <button className="zbtn" onClick={sendCode}>获取验证码</button>
        </div>
        <div>
            <input type={visible ? "" : "password"} className="zp133passwd zinput" placeholder="密码，至少8个字符,须包含数字、大小写字母"/>
            <i onClick={() => {visible = !visible; rd()}}>{visible ? eye : eye0}</i>
        </div>
        {!!P.agreeURL && <div><input type="checkbox" id="zp133agree"/><label htmlFor="zp133agree">已阅读并同意<a href={P.agreeURL} target="_blank">《{P.agreeName || "用户服务协议"}》</a></label></div>}
        <div onClick={register} className="zbtn zprimary">注册</div>
        <div className="zcenter">已有账号<a onClick={() => {type = "formlogin"; rd()}}> 去登录</a></div>
    </div>
}

function register() {
    const phone = $(".zp133phone").value
    const code = $(".zp133code input").value
    const passwd = $(".zp133passwd").value
    let isMobile
    if (exc('isMobile(phone)', { phone })) isMobile = true
    if (exc('isEmail(phone)', { phone })) isMobile = false
    if (isMobile === undefined) return invalid("zp133phone", "请输入" + account)
    if (!passwd) return invalid("zp133passwd", "请输入密码")
    if (passwd.length < 8 || !passwd.match(/[a-z]/g) || !passwd.match(/[A-Z]/g) || !passwd.match(/[0-9]/g)) return invalid("zp133passwd", "密码至少要由8个字符，并且须包含数字、大小写字母")
    if (P.agreeURL && !$("#zp133agree").checked) return exc('warn("请阅读并同意" + x)', { x: P.agreeName || "用户服务协议" })
    exc('$me.register(phone, code, passwd)', { phone, code, passwd }, onEnd)
}

function rChange() {
    return <div>
        <div><input className="zp133phone zinput" placeholder={type.replace("更改", "")}/></div>
        <div className="zp133code">
            <input type="tel" className="zinput" placeholder="验证码"/>
            <button className="zbtn" onClick={sendCode}>获取验证码</button>
        </div>
        <div onClick={change} className="zbtn zprimary">{type}</div>
    </div>
}

function change() {
    const phone = $(".zp133phone").value
    const code = $(".zp133code input").value
    let Q = { phone, code }
    exc('isMobile(phone)', { phone }) ? exc('$me.changePhone(phone, code)', { phone, code }, onEnd) : exc('$me.changeMail(phone, code)', { phone, code }, onEnd)
}

function rReset() {
    return <div className="zp133register">
        <div><input className="zp133phone zinput" placeholder={account}/></div>
        <div className="zp133code">
            <input type="tel" className="zinput" placeholder="验证码"/>
            <button className="zbtn" onClick={sendCode}>获取验证码</button>
        </div>
        <div>
            <input type={visible ? "" : "password"} className="zp133passwd zinput" placeholder="新密码，至少8个字符,须包含数字、大小写字母"/>
            <i onClick={() => {visible = !visible; rd()}}>{visible ? eye : eye0}</i>
        </div>
        <div onClick={reset} className="zbtn zprimary">重置密码</div>
    </div>
}

function reset() {
    const phone = $(".zp133phone").value
    const code = $(".zp133code input").value
    const passwd = $(".zp133passwd").value
    if (!passwd) return invalid("zp133passwd", "请输入密码")
    if (passwd.length < 8 || !passwd.match(/[a-z]/g) || !passwd.match(/[A-Z]/g) || !passwd.match(/[0-9]/g)) return invalid("zp133passwd", "密码至少要由8个字符，并且须包含数字、大小写字母")
    exc('$me.changePassword(phone, code, passwd)', { phone, code, passwd }, onEnd)
}

function rForget() {
    return <div className="zp133forget">
        <div><input className="zp133mail zinput" placeholder="邮箱"/></div>
        <div className="zp133Mcode">
            <input type="tel" className="zinput" placeholder="邮箱验证码"/>
            <button className="zbtn" onClick={e => sendCode(e, "zp133mail", "zp133Mcode")}>获取邮箱验证码</button>
        </div>
        <div><input className="zp133phone zinput" placeholder="手机号"/></div>
        <div className="zp133code">
            <input type="tel" className="zinput" placeholder="手机验证码"/>
            <button className="zbtn" onClick={sendCode}>获取手机验证码</button>
        </div>
        <div>
            <input type={visible ? "" : "password"} className="zp133passwd zinput" placeholder="新密码，至少8个字符,须包含数字、大小写字母"/>
            <i onClick={() => {visible = !visible; rd()}}>{visible ? eye : eye0}</i>
        </div>
        <div onClick={forget} className="zbtn zprimary">重置密码</div>
    </div>
}

function forget() {
    const phone = $(".zp133phone").value
    const phoneCode = $(".zp133code input").value
    const mail = $(".zp133mail").value
    const mailCode = $(".zp133Mcode input").value
    const passwd = $(".zp133passwd").value
    if (!passwd) return invalid("zp133passwd", "请输入密码")
    if (passwd.length < 8 || !passwd.match(/[a-z]/g) || !passwd.match(/[A-Z]/g) || !passwd.match(/[0-9]/g)) return invalid("zp133passwd", "密码至少要由8个字符，并且须包含数字、大小写字母")
    exc('$me.forgetPassword(phone, phoneCode, mail, mailCode, passwd)', { phone, phoneCode, mail, mailCode, passwd }, onEnd)
}

function sendCode(e, input = "zp133phone", btn = "zp133code") {
    const to = $("." + input).value
    let isMobile
    if (exc('isMobile(to)', { to })) isMobile = true
    if (exc('isEmail(to)', { to })) isMobile = false
    if (isMobile === undefined) return invalid(input, "请输入" + (input == "zp133phone" ? "手机号" : "邮箱"))
    if (e.target.innerText.includes("已发送")) return
    e.target.classList.add("zdisable")
    let countdown = 100
    exc(isMobile ? '$me.sendCode(to)' : '$mail.sendCode(to, $appName + "验证码")', { to }, r => {
        if (!r) exc('warn("发送失败")')
        const timer = setInterval(() => {
            let el = $("." + btn + " .zbtn")
            if (!el || !countdown) {
                if (!countdown) el.innerText = "重新获取验证码"
                if (el) el.classList.remove("zdisable")
                return clearInterval(timer)
            }
            countdown -= 1
            el.innerText = "已发送(" + countdown + "s)"
        }, 1000)
    })
}

function invalid(cx, msg) { // = exc('addRemoveClass(".zp133phone", "zinvalid")')
    const el = $("." + cx)
    el.classList.add("zinvalid")
    exc('warn(msg)', { msg })
    setTimeout(() => el.classList.remove("zinvalid"), 5000)
}

function onEnd($x) {
    if (P.onEnd) exc(P.onEnd, { ...rf.ctx, $x, type }, () => exc("render()"))
}

$plugin({
    id: "zp133",
    props: [{
        prop: "type",
        type: "check",
        label: "启用功能",
        items: ["微信扫码登录", "手机号登录", "邮箱登录", "注册", "更改手机号", "更改邮箱", "重置密码", "忘记密码"],
    }, {
        prop: "onEnd",
        type: "exp",
        label: "onEnd表达式",
        ph: "如果登陆成功$x里有用户信息，失败则无$x"
    }, {
        prop: "agreeName",
        type: "text",
        label: "协议名",
        ph: "注册时要求同意的用户协议"
    }, {
        prop: "agreeURL",
        type: "text",
        label: "协议URL",
        ph: "注册时要求同意的用户协议"
    }],
    render,
    init,
    css
})

const eye = <svg className="zsvg" viewBox="0 0 1024 1024"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"/></svg>
const eye0 = <svg className="zsvg" viewBox="0 0 1024 1024"><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5zm-63.57-320.64L836 122.88a8 8 0 0 0-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 0 0 0 11.31L155.17 889a8 8 0 0 0 11.31 0l712.15-712.12a8 8 0 0 0 0-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 0 0-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 0 1 146.2-106.69L401.31 546.2A112 112 0 0 1 396 512z"/><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 0 0 227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 0 1-112 112z"/></svg>
const LoginType = {
    wxlogin: "M754.35352138 866.02957754v89.32816934H307.67464795V866.04225313h446.67887343zM955.35774688 62A44.67042247 44.67042247 0 0 1 1000.02816934 106.67042247v625.34788769a44.67042247 44.67042247 0 0 1-44.67042247 44.67042246H106.67042247A44.67042247 44.67042247 0 0 1 62 732.01831016V106.67042247A44.67042247 44.67042247 0 0 1 106.67042247 62h848.6873244zM151.34084492 642.69014082v44.65774687h759.34647862V642.69014082H151.34084492z m0-89.34084493h759.34647862V151.34084492H151.34084492v402.00845098z",
    formlogin: "M170.6752 469.3248h298.6496V170.6752H170.6752v298.6496zM128 85.3248h384c23.552 0 42.6752 19.1232 42.6752 42.6752v384c0 23.552-19.1232 42.6752-42.6752 42.6752H128c-23.552 0-42.6752-19.1232-42.6752-42.6752V128c0-23.552 19.1232-42.6752 42.6752-42.6752zM256 256h128v128h-128v-128zM170.6752 725.3248v128h128v-128h-128zM128 640h213.3248c23.552 0 42.6752 19.0976 42.6752 42.6752V896c0 23.552-19.0976 42.6752-42.6752 42.6752H128c-23.552 0-42.6752-19.1232-42.6752-42.6752v-213.3248C85.3248 659.1232 104.448 640 128 640zM725.3248 170.6752v128h128v-128h-128z m-42.6496-85.3504H896c23.552 0 42.6752 19.1232 42.6752 42.6752v213.3248c0 23.552-19.1232 42.6752-42.6752 42.6752h-213.3248c-23.552 0-42.6752-19.0976-42.6752-42.6752V128c0-23.552 19.0976-42.6752 42.6752-42.6752z m42.6496 640v128h128v-128h-128zM682.6752 640H896c23.552 0 42.6752 19.0976 42.6752 42.6752V896c0 23.552-19.1232 42.6752-42.6752 42.6752h-213.3248C659.1232 938.6752 640 919.552 640 896v-213.3248c0-23.552 19.0976-42.6752 42.6752-42.6752z m-213.3504 0h85.3504v85.3248h-85.3504V640z m0 149.3248h85.3504v149.3504h-85.3504v-149.3504zM640 469.3248h85.3248v85.3504H640v-85.3504z m149.3248 0h149.3504v85.3504h-149.3504v-85.3504z"
}