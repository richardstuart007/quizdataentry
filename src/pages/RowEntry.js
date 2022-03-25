//
//  Libraries
//
import { useEffect } from 'react'
import { Grid } from '@mui/material'
//
//  Controls
//
import Controls from '../components/controls/Controls'
import { useForm, Form } from '../components/useForm'

const initialFValues = {
  id: 0,
  qowner: 'public',
  qkey: '',
  qtitle: '',
  qdetail: '',
  qhyperlink1: '',
  qhyperlink2: '',
  qanswer_correct: '',
  qanswer_bad1: '',
  qanswer_bad2: '',
  qanswer_bad3: '',
  qgroup1: '',
  qgroup2: ''
}

export default function RowEntry(props) {
  const { addOrEdit, recordForEdit } = props
  //
  //  Validate the fields
  //
  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ('qowner' in fieldValues)
      temp.qowner = fieldValues.qowner ? '' : 'This field is required.'
    if ('qkey' in fieldValues)
      temp.qkey = fieldValues.qkey ? '' : 'This field is required.'
    if ('qdetail' in fieldValues)
      temp.qdetail = fieldValues.qdetail ? '' : 'This field is required.'
    if ('qanswer_correct' in fieldValues)
      temp.qanswer_correct = fieldValues.qanswer_correct
        ? ''
        : 'This field is required.'
    if ('qanswer_bad1' in fieldValues)
      temp.qanswer_bad1 = fieldValues.qanswer_bad1
        ? ''
        : 'This field is required.'
    if ('qkey' in fieldValues)
      temp.qgroup1 = fieldValues.qgroup1 ? '' : 'This field is required.'
    setErrors({
      ...temp
    })

    if (fieldValues === values) return Object.values(temp).every(x => x === '')
  }

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate)
  //
  //  Submit form
  //
  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      addOrEdit(values, resetForm)
    }
  }
  //
  //  On change of record, set State
  //
  useEffect(() => {
    if (recordForEdit !== null)
      setValues({
        ...recordForEdit
      })
    // eslint-disable-next-line
  }, [recordForEdit])
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          <Controls.MyInput
            name='qowner'
            label='Owner'
            value={values.qowner}
            onChange={handleInputChange}
            error={errors.qowner}
          />
        </Grid>

        <Grid item xs={6}>
          <Controls.MyInput
            name='qkey'
            label='Key'
            value={values.qkey}
            onChange={handleInputChange}
            error={errors.qkey}
          />
        </Grid>

        <Grid item xs={12}>
          <Controls.MyInput
            name='qtitle'
            label='Title'
            value={values.qtitle}
            onChange={handleInputChange}
            error={errors.qtitle}
          />
        </Grid>

        <Grid item xs={12}>
          <Controls.MyInput
            name='qdetail'
            label='Question'
            value={values.qdetail}
            onChange={handleInputChange}
            error={errors.qdetail}
          />
        </Grid>

        <Grid item xs={12}>
          <Controls.MyInput
            name='qanswer_correct'
            label='Correct Answer'
            value={values.qanswer_correct}
            onChange={handleInputChange}
            error={errors.qanswer_correct}
          />
        </Grid>

        <Grid item xs={12}>
          <Controls.MyInput
            name='qanswer_bad1'
            label='Bad Answer 1'
            value={values.qanswer_bad1}
            onChange={handleInputChange}
            error={errors.qanswer_bad1}
          />
        </Grid>

        <Grid item xs={12}>
          <Controls.MyInput
            name='qanswer_bad2'
            label='Bad Answer 2'
            value={values.qanswer_bad2}
            onChange={handleInputChange}
            error={errors.qanswer_bad2}
          />
        </Grid>

        <Grid item xs={12}>
          <Controls.MyInput
            name='qanswer_bad3'
            label='Bad Answer 3'
            value={values.qanswer_bad3}
            onChange={handleInputChange}
            error={errors.qanswer_bad3}
          />
        </Grid>

        <Grid item xs={12}>
          <Controls.MyInput
            name='qhyperlink1'
            label='HyperLink 1'
            value={values.qhyperlink1}
            onChange={handleInputChange}
            error={errors.qhyperlink1}
          />
        </Grid>

        <Grid item xs={12}>
          <Controls.MyInput
            name='qhyperlink2'
            label='HyperLink 2'
            value={values.qhyperlink2}
            onChange={handleInputChange}
            error={errors.qhyperlink2}
          />
        </Grid>

        <Grid item xs={6}>
          <Controls.MyInput
            name='qgroup1'
            label='Group 1'
            value={values.qgroup1}
            onChange={handleInputChange}
            error={errors.qgroup1}
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.MyInput
            name='qgroup2'
            label='Group 2'
            value={values.qgroup2}
            onChange={handleInputChange}
            error={errors.qgroup2}
          />
        </Grid>

        <Grid item xs={6}>
          <div>
            <Controls.MyButton type='submit' text='Submit' />
            <Controls.MyButton
              text='Reset'
              color='primary'
              onClick={resetForm}
            />
          </div>
        </Grid>
      </Grid>
    </Form>
  )
}
