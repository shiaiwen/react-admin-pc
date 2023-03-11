import dayjs from 'dayjs'
const getNow = () => dayjs().format('YYYY-MM-DD HH:mm:ss')
const getStringTime = val => dayjs(val * 1).format('YYYY-MM-DD HH:mm:ss')

const dateUtlls = {
  getNow,
  getStringTime
}
export default dateUtlls
