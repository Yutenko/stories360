export function getUrlParameter(name) {
 name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
 var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
 var results = regex.exec(location.search);
 return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function extractVideoID (url) {
 if (url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  if ( match && match[7].length == 11 ){
   return match[7];
  }
 }
 return ""
}

export function imageExists (path,cb) {
  const img = new Image()
  img.onload = cb(true)
  img.onerror = cb(false)
  img.src = path
}

export function youtubeTimeConverter (duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    return duration
}


export function secondsToHms (d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return `00${h}`.slice(-2) + ":" + `00${m}`.slice(-2) + ":" + `00${s}`.slice(-2);
}
