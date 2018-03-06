module.exports = function likes(oldlikes) {

    this.likes = oldlikes.likes || 0;
    this.totallikes = oldlikes.totallikes || 0;
    this.negativeLikes = oldlikes.negativeLikes || 0;

    this.getallLikes = function(id) {
        var sotoredlikes = this.likes[id] = { like: 0, dislike: 0 };
        sotoredlikes.like++;
        this.totallikes += like;
    }




}