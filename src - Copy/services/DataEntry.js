//
//  Libraries
//
import { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Container, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
//
//  Sub Components
//
import { DataEntryFields } from './DataEntryFields'
import DataEntryPanel from './DataEntryPanel'
import Controls from '../../components/controls/Controls'
//..............................................................................
//.  Initialisation
//.............................................................................
//
// Constants
//
const { URL_QUESTIONS } = require('../constants.js')
const sqlClient = 'Quiz/DataEntry'
const sqlTable = 'questions'
const g_log1 = true
const g_log2 = false
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  formWrapper: {
    // marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(1)
  }
}))
//.............................................................................
//.  Data Input Fields
//.............................................................................
//
//  Initial Values
//
const initialValues = {
  qowner: 'public',
  qkey: 'Test1',
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
//
//  Saved Values on Submit
//
const savedValues = {
  qowner: '',
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
//
// Current Key values
//
let c_qid = 0
let c_qowner = ''
let c_qkey = ''
//
// Previous Key values
//
let p_qid = 0
let p_qowner = ''
let p_qkey = ''
//
//  Database return ID
//
let rtn_qid = 0
//.............................................................................
//.  Input field validation
//.............................................................................
const validationSchema = Yup.object({
  qowner: Yup.string().required('Required'),
  qkey: Yup.string().required('Required'),
  qdetail: Yup.string().required('Required'),
  qanswer_correct: Yup.string().required('Required'),
  qanswer_bad1: Yup.string().required('Required'),
  qgroup1: Yup.string().required('Required')
})
//===================================================================================
function DataEntry() {
  //
  //  Style classes
  //
  const classes = useStyles()
  //
  // Row of data
  //
  const [qid, setQid] = useState(0)
  const [formValues, setFormValues] = useState(initialValues)
  //
  // Form Message
  //
  const [form_message, setForm_message] = useState('')
  //...................................................................................
  //.  Form Submit
  //...................................................................................
  const onSubmitForm = (values, submitProps) => {
    //
    //  Save data
    //
    savedValues.qowner = values.qowner
    savedValues.qkey = values.qkey
    savedValues.qtitle = values.qtitle
    savedValues.qdetail = values.qdetail
    savedValues.qhyperlink1 = values.qhyperlink1
    savedValues.qhyperlink2 = values.qhyperlink2
    savedValues.qanswer_correct = values.qanswer_correct
    savedValues.qanswer_bad1 = values.qanswer_bad1
    savedValues.qanswer_bad2 = values.qanswer_bad2
    savedValues.qanswer_bad3 = values.qanswer_bad3
    savedValues.qgroup1 = values.qgroup1
    savedValues.qgroup2 = values.qgroup2
    //
    //  Current Key values
    //
    c_qid = qid
    c_qowner = savedValues.qowner
    c_qkey = savedValues.qkey
    //
    //  Update database
    //
    databaseUpdate()
    //
    //  Update Key values
    //
    if (rtn_qid > 0) {
      setQid(rtn_qid)
      c_qid = rtn_qid
      p_qid = rtn_qid
      p_qowner = savedValues.qowner
      p_qkey = savedValues.qkey
    }
    //
    //  Reset form
    //
    submitProps.setSubmitting(false)
    submitProps.resetForm()
    setFormValues(initialValues)
  }
  //...................................................................................
  //.  Add to the database
  //...................................................................................
  const databaseUpdate = () => {
    //
    //  slqAction: UPDATE/UPSERT
    //
    let sqlAction
    c_qid === p_qid && c_qowner === p_qowner && c_qkey === p_qkey
      ? (sqlAction = 'UPDATE')
      : (sqlAction = 'UPSERT')
    //
    //  UPDATE
    //
    let bodySql
    if (sqlAction === 'UPDATE') {
      const sqlWhere = `qid = ${p_qid}`
      bodySql = JSON.stringify({
        sqlClient: sqlClient,
        sqlAction: sqlAction,
        sqlTable: sqlTable,
        sqlWhere: sqlWhere,
        sqlRow: savedValues
      })
    }
    //
    //  UPSERT
    //
    else {
      bodySql = JSON.stringify({
        sqlClient: sqlClient,
        sqlAction: sqlAction,
        sqlTable: sqlTable,
        sqlKeyName: ['qowner', 'qkey'],
        sqlRow: savedValues
      })
    }
    //
    //  Update database
    //
    fetch(URL_QUESTIONS, {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: bodySql
    })
      .then(response => response.json())
      .then(responseJson => {
        //
        //  No data returned - error object instead
        //
        if (!responseJson[0]) {
          const { returnCatchFunction, returnMessage } = responseJson
          const message = `Error(${returnMessage}) function(${returnCatchFunction})`
          console.log('return data', responseJson)
          setForm_message(message)
          throw message
        }
        //
        //  Data returned
        //
        const returnObj = responseJson[0]
        //
        //  ID returned from DB update
        //
        rtn_qid = 0
        if (returnObj) {
          rtn_qid = returnObj.qid
        }
        //
        //  Message
        //
        let formMessageUpdate
        formMessageUpdate = !returnObj
          ? 'Row NOT added to database'
          : (formMessageUpdate =
              rtn_qid === p_qid
                ? `Row (${rtn_qid}) UPDATED in Database`
                : (formMessageUpdate =
                    rtn_qid < p_qid
                      ? `Row (${rtn_qid}) UPSERTED in Database`
                      : `Row (${rtn_qid}) ADDED to Database`))
        setForm_message(formMessageUpdate)
        //
        //  Update Key values
        //
        if (rtn_qid > 0) {
          setQid(rtn_qid)
          c_qid = rtn_qid
          p_qid = rtn_qid
          p_qowner = savedValues.qowner
          p_qkey = savedValues.qkey
        }
      })
      .catch(err => {
        setForm_message(err.message)
        console.log(err)
      })
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <Grid container>
      <Container>
        <div className={classes.formWrapper}>
          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={onSubmitForm}
            enableReinitialize
          >
            <Form>
              <Grid container spacing={2}>
                {/*.................................................................................................*/}
                {/*  Form Title */}
                {/*.................................................................................................*/}
                <Grid item xs={12}>
                  <Typography variant='subtitle1' gutterBottom>
                    Question Data Entry
                  </Typography>
                </Grid>
                {/*.................................................................................................*/}

                <DataEntryPanel EntryFields={DataEntryFields} />
                {/*.................................................................................................*/}
                {/*  Message */}
                {/*.................................................................................................*/}
                <Grid item xs={12}>
                  <label className='message' htmlFor='text'>
                    {form_message}
                  </label>
                </Grid>

                {/*.................................................................................................*/}
                <Grid item xs={12}>
                  <Controls.Qbutton
                    text='Load Saved'
                    onClick={() => setFormValues(savedValues)}
                  />
                  <Controls.Qbutton
                    text='Reset'
                    onClick={() => setFormValues(initialValues)}
                  />
                  <Controls.Qbutton
                    type='submit'
                    text='Submit'
                    value='Submit'
                  />
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </div>
      </Container>
    </Grid>
  )
}

export default DataEntry
