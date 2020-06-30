<template>
  <div class="custom-video-outer-box" @mouseover="videoMouseOver">
    <video-player
      class="video-player-box"
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
      customEventName="customstatechangedeventname"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
      @ended="onPlayerEnded($event)"
      @waiting="onPlayerWaiting($event)"
      @playing="onPlayerPlaying($event)"
      @loadeddata="onPlayerLoadeddata($event)"
      @timeupdate="onPlayerTimeupdate($event)"
      @statechanged="playerStateChanged($event)"
      @ready="playerReadied"
    >
      <!-- @canplay="onPlayerCanplay($event)" -->
      <!-- @canplaythrough="onPlayerCanplaythrough($event)" -->
    </video-player>
    <!-- 底部进度条 start -->
    <transition name="fade">
      <div class="bottomCtrl" v-show="isBottomCtrlShow" id="bottomCtrl">
        <!--  -->
        <!-- <div class="bottomCtrl" v-show="false"> -->
        <!-- <div class="bottomCtrl"  > -->

        <Slider
          v-model="playerCtrl.currentTimeInt"
          class="progress-slider"
          :max="playerCtrl.durationInt"
          :tip-format="progressTipFormat"
          @on-change="progressChange"
        ></Slider>
        <div class="clearfix">
          <div class="left">
            <!-- 暂停 -->
            <span v-on:click="play" v-if="!playerCtrl.isPlay" class="icon">
              <Icon type="play"></Icon>
            </span>
            <!-- 播放 -->
            <span v-else v-on:click="pause" class="icon">
              <Icon type="stop"></Icon>
            </span>
            <!-- 下一曲 -->
            <span class="icon" v-on:click="nextClick">
              <Icon type="skip-forward"></Icon>
            </span>
            <span class="time">{{playerCtrl.currentTime}}/{{playerCtrl.duration}}</span>
          </div>
          <div class="right clearfix">
            <div class="voice-box clearfix left">
              <!-- 音量 -->
              <Icon type="volume-medium" class="left icon"></Icon>
              <Slider
                v-model="playerCtrl.voiceSlider"
                class="voice-slider left"
                max="100"
                @on-change="volumeChange"
              ></Slider>
            </div>
            <!-- 全屏 -->
            <span class="icon left" @click="fullScreenHandle">
              <Icon type="crop" class="full-screen"></Icon>
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template> 
<script>
/* eslint-disable*/
import Icon from './icon'
import Slider from './slide'
export default {
  name: "video",
  components: {
    Icon,
    Slider
  },
  data() {
    return {
      message: "Hi from Vue",
      // videojs options
      playerOptions: {
        height: "360",
        autoplay: true,
        muted: true,
        language: "en",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: "video/mp4",
            // mp4
            src: "http://vjs.zencdn.net/v/oceans.mp4"
            // webm
            // src:
            //   "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }
        ],
        poster:
          "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg"
      },
      isBottomCtrlShow: true,
      playerCtrl: '',
      progressTipFormat: ''
    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    }
  },
  methods: {
    volumeChange () {},
    // 播放
    play() {
      this.player.play();
    },
    // 暂停
    pause() {
      this.player.pause();
    },
    //下一曲
    nextClick() {
      console.log("自定义", "下一曲点击");
    },
    //全屏
    fullScreenHandle() {
      console.log("全屏");
      if (!this.player.isFullscreen()) {
        this.player.requestFullscreen();
        this.player.isFullscreen(true);
      } else {
        this.player.exitFullscreen();
        this.player.isFullscreen(false);
      }
    },
    onPlayerTimeupdate(player) {
      // this.playerCtrl.currentTime = player.currentTime();
      // this.playerCtrl.currentTimeInt = Math.floor(player.currentTime());
      // console.log("当前音量", player.volume());
    },
    progressChange(val) {
      this.player.currentTime(val);
      this.playerCtrl.currentTimeInt = val;
      this.playerCtrl.currentTime = val;
    },
    // listen event
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    onPlayerEnded(player) {
      // console.log('player ended!', player)
    },
    onPlayerLoadeddata(player) {
      // console.log('player Loadeddata!', player)
    },
    onPlayerWaiting(player) {
      // console.log('player Waiting!', player)
    },
    onPlayerPlaying(player) {
      // console.log('player Playing!', player)
    },
    // onPlayerTimeupdate(player) {
    //   // console.log('player Timeupdate!', player.currentTime())
    // },
    onPlayerCanplay(player) {
      // console.log('player Canplay!', player)
    },
    onPlayerCanplaythrough(player) {
      // console.log('player Canplaythrough!', player)
    },
    // or listen state event
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },
    // player is ready
    playerReadied(player) {
      // seek to 10s
      console.log("example player 1 readied", player);
      // player.currentTime(10);
      // console.log('example 01: the player is readied', player)
    },
    videoMouseOver () {}
  }
};
</script>
<style  lang="scss">
.video-player-box {
  height: 100% !important;
  width: 100% !important;
}

.bottomCtrl {
  line-height: 60px;
  height: 60px;
  overflow: visible;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: rgba(45, 45, 45, 0.92);
  width: 100%;
  padding: 0 50px;
  color: #fff;
  z-index: 999999999999999;

  .icon {
    font-size: 16px;
    line-height: 60px;
    cursor: pointer;
  }

  .icon + .icon {
    margin-left: 20px;
  }
}
.custom-video-outer-box {
  position: relative;
  height: 100%;
  width: 100%;
}
.progress-slider {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  height: 18px;
  line-height: 18px;
  .ivu-slider-wrap {
    margin: 0 !important;
    border-radius: 0 !important;
  }
  .ivu-slider-button-wrap {
    line-height: normal !important;
  }
  .ivu-slider-button {
    height: 8px !important;
    width: 8px !important;
  }
}
.voice-box {
  .voice-slider {
    width: 100px;
    margin-left: 20px;
  }
  .ivu-slider-wrap {
    margin: 27px 0 !important;
  }
}
.time {
  margin-left: 25px;
}
.full-screen {
  margin-left: 25px;
  line-height: 60px;
}

.ivu-progress-outer {
  padding: 0 10px !important;
}

.vjs-big-play-button {
  height: 80px !important;
  width: 80px !important;
  line-height: 80px !important;
  text-align: center;
  background: rgba(0, 0, 0, 0.8) !important;
  border-radius: 50% !important;
  top: 50% !important;
  left: 50% !important;
  margin-left: -40px !important;
  margin-top: -40px !important;
}
#vjs_video_3 {
  max-height: 100% !important;
  width: 100% !important;
  height: 100% !important;
}
.video-player-box > div {
  height: 100% !important;
  width: 100% !important;
}
.video-js .vjs-big-play-button {
  font-size: 5em !important;
}
video {
  max-height: 100% !important;
}
</style>
