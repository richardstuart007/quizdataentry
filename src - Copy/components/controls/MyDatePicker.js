import { LocalizationProvider, DatePicker } from '@mui/lab'
import DateFnsUtils from '@date-io/date-fns'
import { TextField } from '@mui/material'

export default function MyDatePicker(props) {
  const { name, label, value, onChange, ...other } = props
  console.log(name, label, value)

  const convertToDefEventPara = (name, value) => ({
    target: {
      name,
      value
    }
  })
  console.log(convertToDefEventPara(name, value))

  return (
    <LocalizationProvider utils={DateFnsUtils}>
      <DatePicker
        disableToolbar
        variant='inline'
        inputVariant='outlined'
        label={label}
        format='MMM/dd/yyyy'
        name={name}
        value={value}
        {...other}
        onChange={date => onChange(convertToDefEventPara(name, date))}
        renderInput={params => <TextField {...params} />}
      />
    </LocalizationProvider>
  )
}
