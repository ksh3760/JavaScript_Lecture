class Hoyaa {

    __fitScreen(id) {
        const bh = $(window).height();
        $('#' + id).height(bh); 
    }

    init(opt) {
        //this.fitScreen(opt['app']);
        this.setSceneList(opt['scenes']);
        this.showScene(opt['startScene']);
    }

    fitScreen(id) {
        this.__fitScreen(id);
        $(window).on('resize', ()=>{ this.__fitScreen(id) });
    }

    setSceneList(scenes) {
        this.__sceneList = scenes;
    }
    
    showScene(id) {
        for(const i in this.__sceneList) {
            $('#' + this.__sceneList[i]).hide();
        }
        $('#' + id).show();
    }

    messageBoxId = 'message-box'

    showMessageBox(msg, title) { 
        const id = this.messageBoxId;
        $(`#${id} .message-title .text`).html(title || 'Hoyaa.js');
        $(`#${id} .message-text`).html(msg);
        $(`#${id}`).show().animate({
            top: '20px',
            opacity: 1
        }, 1000);
    }

    closeMessageBox() {
        const id = this.messageBoxId;
        $(`#${id}`).animate({
            top: '0px',
            opacity: 0
        }, 1000, function(){
            $(this).hide();
        });
    }

    createUser(id, password, name) {
        let db = localStorage.getItem('user') || "{}";
        db = JSON.parse(db);
        db[id] = {name, password};
        localStorage.setItem('user', JSON.stringify(db));
    }
    getUser(id) {
        let db = localStorage.getItem('user') || "{}";
        db = JSON.parse(db);
        return db[id];
    }
    getLoginUserName() {
        return sessionStorage.getItem('loginName') || "";
    }
    isLogin() {
        return sessionStorage.getItem('isLogin') || "false";
    }
    setLogin(id, name) {
        sessionStorage.setItem('isLogin', 'true');
        sessionStorage.setItem('loginId', id);
        sessionStorage.setItem('loginName', name);
    }
    logout() {
        sessionStorage.clear();
    }
}

const _o = new Hoyaa();