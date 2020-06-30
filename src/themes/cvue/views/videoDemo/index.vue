<template>
    <div>
        <video width="320px" height="200px" controls ref="videoPlayer" loop :src="shareVideoLink">
            您的浏览器不支持 HTML5 video 标签。
        </video>
    </div>
</template>
<script>
export default {
    name: 'video',
    data () {
        return {
            shareVideoLink: '/static/movie.mp4'
        }
    },
    mounted () {
        var videoPlayer = this.$refs.videoPlayer
        // videoPlayer.play()
        videoPlayer.currentTime = 10
        videoPlayer.addEventListener('timeupdate', function () {
            console.log(Math.floor(videoPlayer.duration))
        })
    }
}
</script>
<style>

</style>
