_o.init({
    app: 'app',
    scenes : ['scene-main','scene-join','scene-login'],
    startScene: 'scene-login',
});

function closeMessageBox() {
    _o.closeMessageBox();
}

function move(name) {
    let id;
    switch(name) {
        case '회원가입':
            id = 'scene-join';
            break;
        default:
            id = 'scene-login';
            break;
    }
    _o.showScene(id);
}