//
//  Libraries
//
import { useState, useEffect } from 'react'
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone'
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
//
//  Pages
//
import RowEntry from './RowEntry'
//
//  Components
//
import Controls from '../components/controls/Controls'
import Notification from '../components/Notification'
import ConfirmDialog from '../components/ConfirmDialog'
import Popup from '../components/Popup'
import PageHeader from '../components/PageHeader'
import useTable from '../components/useTable'
//
//  Services
//
import * as rowService from '../services/rowService'
import MyQueryPromise from '../services/MyQueryPromise'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3)
  },
  searchInput: {
    fullwidth: true
  },
  newButton: {
    position: 'absolute',
    right: '10px'
  }
}))
//
//  Table Heading
//
const headCells = [
  { id: 'qid', label: 'ID' },
  { id: 'qowner', label: 'Owner' },
  { id: 'qkey', label: 'Key' },
  { id: 'qtitle', label: 'Title' },
  { id: 'qdetail', label: 'Question' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
//
// Constants
//
let g_log1 = true
//=====================================================================================
export default function RowList() {
  //.............................................................................
  //.  GET ALL
  //.............................................................................
  const getRowAllData = () => {
    //
    //  Process promise
    //
    if (g_log1) console.log('getRowAllData')
    var myPromise = MyQueryPromise(rowService.getRowAll())
    //
    //  Initial status
    //
    if (g_log1) console.log('Initial pending:', myPromise.isPending()) //true
    if (g_log1) console.log('Initial fulfilled:', myPromise.isFulfilled()) //false
    if (g_log1) console.log('Initial rejected:', myPromise.isRejected()) //false
    //
    //  Resolve Status
    //
    myPromise.then(function (data) {
      if (g_log1) console.log('myPromise ', myPromise)
      if (g_log1) console.log('Final fulfilled:', myPromise.isFulfilled()) //true
      if (g_log1) console.log('Final rejected:', myPromise.isRejected()) //false
      if (g_log1) console.log('Final pending:', myPromise.isPending()) //false
      if (g_log1) console.log('data ', data)
      //
      //  No data
      //
      if (!data) {
        console.log('No Data returned')
        setRecords([])
      } else {
        //
        //  Get Count
        //
        const rtn_length = data.length
        if (g_log1) console.log(`Rows (${rtn_length}) SELECTED in Database`)
        setRecords(data)
      }
    })
  }
  //.............................................................................
  //
  //  Styles
  //
  const classes = useStyles()
  //
  //  State
  //
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [records, setRecords] = useState([])
  const [filterFn, setFilterFn] = useState({
    fn: items => {
      return items
    }
  })
  const [openPopup, setOpenPopup] = useState(false)
  //.............................................................................
  //
  //  Notification
  //
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    severity: 'info'
  })
  //.............................................................................
  //
  //  Confirm Delete dialog box
  //
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: ''
  })
  //.............................................................................
  //
  //  Populate the Table
  //
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn)
  //.............................................................................
  //
  //  Search
  //
  const handleSearch = e => {
    let target = e.target
    setFilterFn({
      fn: items => {
        if (target.value === '') return items
        else
          return items.filter(x =>
            x.qdetail.toLowerCase().includes(target.value)
          )
      }
    })
  }
  //.............................................................................
  //
  //  Update Database
  //
  const addOrEdit = (row, resetForm) => {
    if (row.qid === 0) rowService.insertRow(row)
    else rowService.updateRow(row)
    resetForm()
    setRecordForEdit(null)
    setOpenPopup(false)
    setRecords(getRowAllData())
    setNotify({
      isOpen: true,
      message: 'Submitted Successfully',
      severity: 'success'
    })
  }
  //.............................................................................
  //
  //  Data Entry Popup
  //
  const openInPopup = row => {
    setRecordForEdit(row)
    setOpenPopup(true)
  }
  //.............................................................................
  //
  //  Delete Row
  //
  const onDelete = qid => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    rowService.deleteRow(qid)
    setRecords(getRowAllData())
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      severity: 'error'
    })
  }
  //...................................................................................
  //
  //  Initial Data Load
  //
  useEffect(() => {
    getRowAllData()
    // eslint-disable-next-line
  }, [])
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <PageHeader
        title='Questions'
        subTitle='Data Entry and Maintenance'
        icon={<PeopleOutlineTwoToneIcon fontSize='large' />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.MyInput
            label='Search'
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            onChange={handleSearch}
          />
          <Controls.MyButton
            text='Add New'
            variant='outlined'
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={() => {
              setOpenPopup(true)
              setRecordForEdit(null)
            }}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.qid}>
                <TableCell>{row.qid}</TableCell>
                <TableCell>{row.qowner}</TableCell>
                <TableCell>{row.qkey}</TableCell>
                <TableCell>{row.qtitle}</TableCell>
                <TableCell>{row.qdetail}</TableCell>
                <TableCell>
                  <Controls.MyActionButton
                    color='primary'
                    onClick={() => {
                      openInPopup(row)
                    }}
                  >
                    <EditOutlinedIcon fontSize='small' />
                  </Controls.MyActionButton>
                  <Controls.MyActionButton
                    color='secondary'
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Are you sure to delete this record?',
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          onDelete(row.qid)
                        }
                      })
                    }}
                  >
                    <CloseIcon fontSize='small' />
                  </Controls.MyActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup
        title='Question Form'
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <RowEntry recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  )
}
