const { log } = console
const [day, month, year] = new Date().toLocaleDateString().split(("/"))

const FormatNumber = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2, });

const newMonth = FormatNumber.format(month)
const date = `${day}/${newMonth}/${year} / ${new Date().toTimeString()}`

log(date)