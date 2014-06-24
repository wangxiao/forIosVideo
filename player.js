// 闭包，避免影响外层代码
void function(window){
    // 声明 ios webview 方法作用域
    window.wandoujia = window.wandoujia || {};

    // 播放器的 video 元素
    var videoDom;
    var MAX_TIME = 10000;
    var timer = 0;
    function getVideoDom() {
        videoDom = document.documentElement.getElementsByTagName('video')[0];
        if (!videoDom && (timer < MAX_TIME)) {
            setTimeout(function() {
                getVideoDom();
                timer += 50;
            }, 50);
        }
        if (videoDom) {
            sendToNative('onready');
        }
        return videoDom;
    }

    // 告诉 native
    function sendToNative(data) {
        window.location = "wdjplayer://" + data;
    }
    getVideoDom();

    // 播放相关方法，暴露给 native
    wandoujia.ios = {
        hasVideo: function() {
            return !!videoDom;
        },
        play: function() {
            videoDom.play();
        },
        // 重新加载视频元素
        load: function() {
            videoDom.load();
        },
        pause: function() {
            videoDom.pause();
        },
        currentTime: function(time) {
            if (arguments.length) {
                videoDom.currentTime = time;
            } else {
                return videoDom.currentTime;
            }
        },
        // 返回总时长
        duration: function() {
            return videoDom.duration;
        },
        isPaused: function() {
            return videoDom.paused;
        }
    };

    // 需要的回调
    videoDom.addEventListener('play', function() {
        sendToNative('onplay');
    });

    videoDom.addEventListener('ended', function() {
        sendToNative('onended');
    });
    
    videoDom.addEventListener('pause', function() {
       sendToNative('onpause');
    });

}(window);