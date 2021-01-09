class Hoyaa {

    __fitScreen(id) {				        // 화면을 꽉차게 한다.
        const bh = $(window).height();		// 브라우저의 높이 구하기
        $('#' + id).height(bh); 
    }

    init(opt) {
        this.fitScreen(opt['app']);
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

    // 메세지 박스 보이기
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
}

const _o = new Hoyaa();
