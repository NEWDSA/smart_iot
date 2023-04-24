export function fileUrl() {
    if (process.env.NODE_ENV === 'development') {
        return 'http://192.168.8.179:4000/api/v1/'
    }
    const url = window.location.host.replace(':50000',':4000')
    // http://192.168.8.208:50000/api/v1/static/img/1675672332485103.jpg
    return 'http://' + url + '/api/v1/'
  }

  export function fileUrlNoapi() {
    if (process.env.NODE_ENV === 'development') {
        return 'http://192.168.8.179:4000/'
    }
    const url = window.location.host.replace(':50000',':4000')
    // http://192.168.8.208:50000/api/v1/static/img/1675672332485103.jpg
    return 'http://' + url + '/'
  }