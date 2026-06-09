module.exports = function (API) {
  const { OperationType, VariableType, ConnectionState, AllowFlags, Direction, CollisionFlags, CameraFollow, BackgroundType, GamePlayState, Callback, Utils, Room, Replay, Query, Library, RoomConfig, Plugin, Renderer, Errors, Language, Impl } = API;

  Object.setPrototypeOf(this, Plugin.prototype);
  Plugin.call(this, "slidingAvatar", false, {
    version: "0.1.1",
    author: "JerryOldson & mtkcnl",
    description: `This plugin will slide the characters of your avatar.`,
    allowFlags: AllowFlags.JoinRoom | AllowFlags.CreateRoom
  });

  this.defineVariable({
    name: "avatar",
    description: "The avatar you want to have.",
    type: VariableType.String,
    value: "JerryOldson"
  });

  this.defineVariable({
    name: "slideInterval",
    description: "This variable is used to determine the frequency of sliding in miliseconds",
    type: VariableType.Number,
    value: 500,
    range: {
      min: 0,
      step: 1
    }
  });

  var that = this, avatarIndex = 0, interval;
  let avatarArr = Array.from(this.avatar);

  function slideAvatar() {
    if (that.active) {
      that.room.setAvatar(avatarArr[avatarIndex++]);
      if (avatarIndex === avatarArr.length) avatarIndex = 0;
    }
  };

  this.initialize = () => {
    Utils.runAfterGameTick(() => {
      interval = setInterval(slideAvatar, that.slideInterval);
    }, 1);
  };

  this.finalize = () => {
    that = null;
    avatarIndex = null;
    clearInterval(interval);
    interval = null;
  };

  this.onVariableValueChange = (addonObject, variableName, oldValue, newValue) => {
    if (addonObject == that) {
      switch (variableName) {
        case "slideInterval":
          clearInterval(interval);
          interval = setInterval(slideAvatar, newValue);
          break;
        case "avatar":
          avatarArr = Array.from(newValue);
          avatarIndex = 0;
        default:
          break;
      }
    }
  };

  // snapshot support

  this.takeSnapshot = function(){
    var { avatar, slideInterval } = that;
    return {
      avatar,
      slideInterval,
      avatarIndex,
      avatarArr
    };
  };

  this.useSnapshot = function(snapshot){
    var {
      avatar,
      slideInterval
    } = snapshot;
    Object.assign(that, {
      avatar,
      slideInterval
    });
    avatarIndex = snapshot.avatarIndex;
    avatarArr = snapshot.avatarArr;
  };
}