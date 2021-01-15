// 즉시 실행되는 명령어들
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

loadMenu();

let isSpreadbarClicked = false;
let spreadbarClickOffset;
$('.spreadbar').on('mousedown', function(event){
    isSpreadbarClicked = true;
    spreadbarClickOffset = event.pageX;
});
$('.main-container').on('mouseup', function(event){
    isSpreadbarClicked = false;
});
$('.main-container').on('mousemove', function(event){
    if(isSpreadbarClicked) {
        const deltaX = spreadbarClickOffset - event.pageX;
        console.log('마우스 이동중 : ' + (deltaX));
        const w = $('.sidebar').width() - deltaX;
        if(w >= 150 && w <= 300){
            $('.sidebar').width(w);
        }
        spreadbarClickOffset = event.pageX;
    }
});

// 여기 아래에는 함수 정의
function toggleSidebar() {
    showSubmenu();
    $('.sidebar, .toolbar').toggleClass('shrink');
}
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
    // 모든 서브메뉴를 닫기 전에 열어야할 서브메뉴가 이전에 열려있었는지 확인
    const submenu = $(tag).next();
    const isShow = submenu.is(':visible');

    // 모든 서브메뉴를 닫아 줌
    $('.sidebar-menu-level-2').slideUp();

    // 특정 서브메뉴가 닫혀 있을경우에만 열어 줌
    if(!isShow) {
        $(tag).next().slideDown();
    }
}


function loadMenu() {
    $.ajax({
        url : 'menu.html?v=3'
    }).done(function(data){
        console.log(data);
        const json = JSON.parse(data);    
        let html = `<ul class="sidebar-menu-level-1">`;
        
        // 메뉴 순환문
        for(const i in json) {
            html += `
                <li>
                    <div class="title" onclick="showSubmenu(this)"><i class="fab fa-apple"></i><span class="text">${json[i].title}</span></div>
                    <ul class="sidebar-menu-level-2">`;
            for(const x in json[i].submenu){
                // 서브 메뉴 순환문
                html += `   <li onclick="menuLink('${json[i].submenu[x].id}', '${json[i].submenu[x].name}', '${json[i].submenu[x].link}')">${json[i].submenu[x].name}</li>`;
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

function menuLink(id, title, link) {
    if(link == "#") {
        showMessage('서비스 준비중입니다.', '죄송합니다.');
        return;
    }
    const found = $(`.tab-button[data-id="${id}"]`);
    if(found.length > 0) {
        selectTabButton(id, title, link);
    } else {
        $('.tab-button').removeClass('selected');
        $('.inner-page').hide();
        const html = `<div class="tab-button selected" data-id="${id}" onclick="selectTabButton('${id}','${title}','${link}');">${title} <span onclick="closeTab('${id}','${title}','${link}');event.stopPropagation();"><i class="fas fa-window-close"></i></span></div>`;
        $('.tabbar').append(html);
        const page = `<iframe src="${link}" data-id="${id}" frameborder='0' class="inner-page" style="width:100%;height:100%" ></iframe>`;
        $('.page-content').append(page);
        stack.push(id);
    }
    console.log(stack);
}
function selectTabButton(id, title, link) {
    $('.tab-button').removeClass('selected');
    $('.inner-page').hide();
    $(`.tab-button[data-id="${id}"]`).addClass('selected');
    $(`.inner-page[data-id="${id}"]`).show();
    const index = stack.indexOf(id);
    stack.splice(index, 1);
    stack.push(id);
    console.log(`selectTabButton`);
}
function closeTab(id, title, link) {
    $(`.tab-button[data-id="${id}"], .inner-page[data-id="${id}"]`).remove();
    console.log(`closeTab`);
    const index = stack.indexOf(id);
    const isLast = index == stack.length - 1;
    stack.splice(index, 1);
    if(isLast) {
        const nextId = stack[stack.length - 1];
        $(`.tab-button[data-id="${nextId}"]`).addClass('selected');
        $(`.inner-page[data-id="${nextId}"]`).show();
    }
}
let stack = [];