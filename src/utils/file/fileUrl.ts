export function fileUrl() {
    if (process.env.NODE_ENV === 'development') {
        return 'http://192.168.8.180:4000/api/v1/'
    }

    return '/api/v1/'
  }