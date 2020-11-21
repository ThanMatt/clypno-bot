import moment from 'moment'
/**
 * @param {Number} numberOfDays
 */
export const dateDiff = (numberOfDays) => {
  const filteredDate = moment(new Date()).subtract(numberOfDays, 'days').endOf('day').format('YYYY-MM-DD h:m:ss')
  return new Date(filteredDate).toISOString()
}
