import moment from 'moment'

export function wireMomentJs() {
  moment.locale('cs')
}

export function timeFromNow(time) {
  return moment(time).fromNow()
}
