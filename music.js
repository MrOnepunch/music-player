var log = function() {
    console.log.apply(console, arguments)
}

//设置进度条的播放
var playerSetTime = function(value) {
    var player = $('#id-audio-player')[0]
    var time = player.duration * value / 100
    player.currentTime = time
}

//鼠标点击歌曲名字切换歌曲
var bindSwitch = function () {
    var player = $('#id-audio-player')[0]
    log('player', player)
    //点击切换歌曲
    $('song').on('click', function(e) {
        var self = $(e.target)
        var song = self.text()
        log('click', song)
        //切换歌曲
        player.src = `songs/${song}.mp3`
        //点击出现歌曲名字
        $('#id-song-name').text(song)
        //点击获得当前index
        var clickIndex = self[0].id.slice(-1)
        log('clickIndex', clickIndex)
        //点击列表 更换封面
        $('#id-img-musicBg')[0].src = `images/${song}.jpg`
        $('#id-img-player')[0].src = `images/${song}.jpg`

        $('#id-img-player').removeClass()
        $('#id-img-player').addClass('img-rolling')
        $('.img-rolling').css('animation-play-state', 'running')
        //将点击的下标和当前下标统一
        var b = self.closest('.play-list')[0]
        b.dataset.index = clickIndex
        player.play()
    })
}

//播放列表的CSS实现
var musiclistEvent = function() {
    $(".play-list").on("click", "li", function() {
        if(!$(this).hasClass("li-active")) {
            $('li').removeClass("li-active")
            $('li').find("img").css('display', "none")

            $(this).addClass("li-active")
            $(this).find("img").css('display', "inline-block")
        }
    })
}

//音乐进度条实现点哪播哪
var bindTimeSlider = function() {
    var player = $('#id-audio-player')[0]
    $('#id-input-slider').on('change', function(e) {
        var value = e.target.value
        log('改变', typeof value, value)
        //根据百分比设置player的播放时间
        playerSetTime(parseInt(value))
    })
}


//单曲播放
// var singlePlay = function() {
//     var player = $('#id-audio-player')[0]
//     player.loop = '0'
// }
//
// //随机播放
// var randomPlay = function() {
//
// }
//
// //顺序播放
// var orderPlay = function() {
//
// }
//
// //单曲循环播放s
// var loopPlay = function() {
//     var player = $('#id-audio-player')[0]
//     player.loop = '1'
// }

//播放器事件
var bindAudioEvents = function() {
    //进度条随着播放移动
    $('#id-audio-player').on('timeupdate', function(e) {
        var player = e.target
        var value = player.currentTime / player.duration
        setSlider(value)
        //设置当前时间
        var time = labelFromTime(player.currentTime)
        $('#id-time-current').text(time)
    })
    //音乐播放完之后的事件，播放状态
    $('#id-audio-player').on('ended', function() {
        log('播放模式', playerMode)
    })
    //加载音乐后的事件
    $('#id-audio-player').on('canplay', function(e) {
        var player = e.target
        log('can play', player.duration)
        //滑条归位
        $('#id-input-slider').val(0)
        //时间重置
        var time = labelFromTime(player.duration)
        $('#id-time-duration').text(time)
    })
}

var prevSong = function() {
    log('上一首')
}

var nextSong = function() {
    log('下一首')
}

//暂停播放
var pauseSong = function(button) {
    var player = $('#id-audio-player')[0]
    player.pause()
    log('暂停', player.paused)
    //设置当前按钮
    button.dataset.action = 'play'
    button.src = 'images/play.png'
    //设置唱片旋转停止
    $('.img-rolling').css('animation-play-state', 'paused')
}

//开始播放
var playSong = function(button) {
    var player = $('#id-audio-player')[0]
    player.play()
    log('播放', player.play)
    //设置当前按钮
    button.dataset.action = 'pause'
    button.src = 'images/pause.png'
    //设置唱片旋转
    $('#id-img-player').addClass('img-rolling')
    $('.img-rolling').css('animation-play-state', 'running')

}

//绑定播放状态
var bindPlayEvents = function() {
    //绑定按键用对象方法
    $('.player-buttons').on('click', 'img', function(e) {
        var button = e.target
        var type = button.dataset.action
        var actions = {
            prev: prevSong,
            next: nextSong,
            play: playSong,
            pause: pauseSong,
        }
        var action = actions[type]
        action(button)
    })
    //绑定下一首按键
    $('#id-button-down').on('click', function(e) {
        //定义一个a来取到data
        var a = $('.play-list-container').find('.play-list')[0]
        //总歌曲数
        var numberOfSongs = parseInt(a.dataset.songs)
        log('歌曲总数', numberOfSongs)
        //当前歌曲小标
        var indexOfSongs = parseInt(a.dataset.index)
        log('当前播放歌曲下标', indexOfSongs)
        //下一首歌曲下标
        var nextIndex = (indexOfSongs + 1 + numberOfSongs) % numberOfSongs
        a.dataset.index = nextIndex
        log('下一首歌下标', nextIndex)
        var nextSongIdSelector = '#id-song-' + String(nextIndex)
        log('nextSongIdSelector', nextSongIdSelector)
        //歌曲名字的改变
        var songName = $(nextSongIdSelector).text()
        log('songName', songName)
        $('#id-song-name').text(songName)
        //改变歌曲的图片
        $('#id-img-musicBg')[0].src = `images/${songName}.jpg`
        $('#id-img-player')[0].src = `images/${songName}.jpg`

        $('#id-img-player').removeClass()
        $('#id-img-player').addClass('img-rolling')
        $('.img-rolling').css('animation-play-state', 'running')
        //歌曲播放
        var player = $('#id-audio-player')[0]
        player.src = `songs/${songName}.mp3`
        player.play()
    })
    //绑定上一首事件
    $('#id-button-up').on('click', function(e) {
        //定义一个a来取到data
        var a = $('.play-list-container').find('.play-list')[0]
        //总歌曲数
        var numberOfSongs = parseInt(a.dataset.songs)
        log('歌曲总数', numberOfSongs)
        //当前歌曲小标
        var indexOfSongs = parseInt(a.dataset.index)
        log('当前播放歌曲下标', indexOfSongs)
        //上一首歌曲下标
        var lastIndex = (indexOfSongs - 1 + numberOfSongs) % numberOfSongs
        a.dataset.index = lastIndex
        log('上一首歌下标', lastIndex)
        var lastSongIdSelector = '#id-song-' + String(lastIndex)
        log('lastSongIdSelector', lastSongIdSelector)
        //歌曲名字的改变
        var songName = $(lastSongIdSelector).text()
        log('songName', songName)
        $('#id-song-name').text(songName)
        //改变歌曲的图片
        $('#id-img-musicBg')[0].src = `images/${songName}.jpg`
        $('#id-img-player')[0].src = `images/${songName}.jpg`

        $('#id-img-player').removeClass()
        $('#id-img-player').addClass('img-rolling')
        $('.img-rolling').css('animation-play-state', 'running')
        //歌曲播放
        var player = $('#id-audio-player')[0]
        player.src = `songs/${songName}.mp3`
        player.play()
    })
}

//用全局变量设定默认播放模式
// var playerMode = 'single'

//绑定歌曲模式
var bindModeEvents = function() {
    $("#footer-mode").on('click', function() {
        let img = $("#footer-mode").attr("src")
        let loop = "images/onebyone.png"
        if (img == loop) {
            $("#footer-mode").attr("src","images/cyclic.png")
            $('#id-audio-player')[0].loop = true
        } else {
            $("#footer-mode").attr("src","images/onebyone.png")
            $('#id-audio-player')[0].loop = false
        }
    })
}

//切换显示播放列表
var toggleList = function() {
    $("#id-img-src").on('click', function() {
        $(".play-list-container").addClass("listActive")
    })
    $('.musicBg').on('click', function() {
        $(".play-list-container").removeClass("listActive")
    })
}

//滑条移动辅助数
var setSlider = function(value) {
    // log(value, typeof value)
    var v = value * 100
    $('#id-input-slider').val(v)
}

//显示时间函数
var labelFromTime = function(time) {
    var minutes = Math.floor(time / 60)
    var seconds = Math.floor(time % 60)
    return `${minutes}:` + zfill(seconds)
}

//时间 0位补齐函数
var zfill = function(seconds) {
    var t = `${seconds}`
    if (seconds < 10 ) {
        return t = `${'0'+seconds}`
    }
    return t
}

//红心按钮的绑定
var loveButton = function() {
    $("#footer-love").on('click', function() {
        let img = $("#footer-love").attr("src")
        let love = "images/love.png"
        if (img == love) {
            $("#footer-love").attr("src","images/loved.png")
        } else {
            $("#footer-love").attr("src","images/love.png")
        }
    })
}

//所有绑定事件
var bindEvents = function() {
    bindSwitch()
    bindTimeSlider()
    bindAudioEvents()
    bindPlayEvents()
    bindModeEvents()
    loveButton()
    toggleList()
    musiclistEvent()
}

//主函数
var __main = function() {
    bindEvents()
}

__main()
