import dayjs from 'dayjs'
const getNow = () => dayjs().format('YYYY-MM-DD HH:mm:ss')
const dateUtlls = {
  getNow
}
export default dateUtlls
