let isLogin = _o.isLogin();
let startScene = 'scene-login';
if(isLogin == "true") {
    $('.profile-name').html(_o.getLoginUserName());
    startScene = 'scene-main';
}

_o.init({
    app: 'app',
    scenes : ['scene-main','scene-join','scene-login'],
    startScene: startScene,
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
            case '메인페이지':
                id = 'scene-main';
                break;
        default:
            id = 'scene-login';
            break;
    }
    _o.showScene(id);
}

function showMessage(msg, title) {
    _o.showMessageBox(msg, title);
    //alert(msg);
}

function join() {
    const id = $('#scene-join-id').val();
    if(!id || /\s{1,}/.test(id)) {
        showMessage('아이디를 빈칸 없이 입력해 주세요.', '회원 가입');
        return false;
    }
    const password = $('#scene-join-password').val();
    if(!password) {
        showMessage('비밀번호를 입력해 주세요.', '회원 가입');
        return false;
    }
    const name = $('#scene-join-name').val();
    if(!name || !/.{2,}/.test(name)) {
        showMessage('이름은 2글자 이상 입력해 주세요.', '회원 가입');
        return false;
    }
    createUser(id, password, name);
    // 로그인 화면으로 이동
    move('로그인');
}

function createUser(id, password, name) {
    _o.createUser(id, password, name);
}

function login() {
    const id = $('#scene-login-id').val();
    if(!id || /\s{1,}/.test(id)) {
        showMessage('아이디를 빈칸 없이 입력해 주세요.', '로그인');
        return false;
    }
    const password = $('#scene-login-password').val();
    if(!password) {
        showMessage('비밀번호를 입력해 주세요.', '로그인');
        return false;
    }
    const dbUser = _o.getUser(id);
    if(dbUser) {
        if(dbUser.password == password) {
            $('#scene-login-id').val('');
            $('#scene-login-password').val('');
            _o.setLogin(id, dbUser.name);
            showMessage(dbUser.name + '님 반갑습니다.', '로그인');
            $('.profile-name').html(dbUser.name);
            move('메인페이지');
        } else {
            showMessage('비밀번호가 일치하지 않습니다.', '로그인');
        }

    } else {
        showMessage('등록되어 있지 않은 아이디 입니다.', '로그인');
    }
}

function logout() {
    _o.logout();
    move();
}

function showSubmenu(tag) {
    $('.sidebar-menu-level-2').slideUp();
    $(tag).next().slideDown();
}


function loadMenu() {
    $.ajax({
        url : 'menu.html'
    }).done(function(data){
        console.log(data);
        const json = JSON.parse(data);    
        let html = `<ul class="sidebar-menu-level-1">`;
        
        // 메뉴 순환문
        for(const i in json) {
            html += `
                <li>
                    <div class="title" onclick="showSubmenu(this)"><i class="fab fa-apple"></i> ${json[i].title}</div>
                    <ul class="sidebar-menu-level-2">`;
            for(const x in json[i].submenu){
                // 서브 메뉴 순환문
                html += `   <li onclick="menuLink('${json[i].submenu[x].link}')">${json[i].submenu[x].name}</li>`;
                // 서브 메뉴 순환문 끝
            }
                    
            html += `</ul>
                </li>
                `;
        }
        // 메뉴 순환문 끝

        html += `</ul>`;
        $('.sidebar').html(html);
    });
}

loadMenu();
