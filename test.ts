import moment from 'moment-timezone'

const date1 = '2013-06-01T06:00:00+08:00'
const date2 = '2013-06-01T06:00:00+00:00'

var m1 = moment.parseZone(date1)
var m2 = moment.parseZone(date2)

console.log(m1)
console.log(m2)

var a = m1.isSame(m2) // true

console.log('a', a)

console.log(m1.isAfter(m2))
