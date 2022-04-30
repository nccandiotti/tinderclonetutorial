import React, { useState, useContext, useEffect } from "react"
import { UserContext } from "../../UserContext"
import { format } from "date-fns"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import Grid from "@mui/material/Grid"
import DateTimePicker from "@mui/lab/DateTimePicker"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import Alert from "@mui/material/Alert"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { DataGrid } from "@mui/x-data-grid"
import bohoart4 from "../../assets/pink.jpg"
import sun from "../../assets/sun.png"
import bohoart from "../../assets/bohoart4.png"
import bohoart2 from "../../assets/bohoart2.png"
import mcm1 from "../../assets/mcm1.png"
import flower from "../../assets/flower1.png"

function AdminPortal() {
  const { currentUser } = useContext(UserContext)
  const [usersArray, setUsersArray] = useState([])
  const [firstname, setFirstname] = useState(currentUser.firstname)
  const [lastname, setLastname] = useState(currentUser.lastname)
  const [email, setEmail] = useState(currentUser.email)
  const [phone, setPhone] = useState(currentUser.phone)
  const [showAlert, setShowAlert] = useState(true)
  const [salon, setSalon] = useState([])
  const studentInquiries = salon.student_inquiries
  const [appointments, setAppointments] = useState(salon.appointments)
  const [open, setOpen] = useState(false)
  const [openApptEdit, setOpenApptEdit] = useState(false)
  const [selectedApptid, setSelectedApptid] = useState(0)
  const [selectedApptFirstname, setSelectedApptFirstname] = useState("")
  const [selectedApptLastname, setSelectedApptLastname] = useState("")
  const [selectedApptTime, setSelectedApptTime] = useState("")
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [apptOpen, setApptOpen] = useState(false)
  const [dateValue, setDateValue] = useState("")
  const [time, setTime] = useState("")
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleApptClose = () => setApptOpen(false)
  const handleApptOpen = () => setApptOpen(true)
  const handleOpenApptEdit = () => {
    setOpenApptEdit(true)
    setShowAlert(true)
  }

  useEffect(() => {
    fetch("./salons")
      .then((r) => r.json())

      .then((data) => setSalon(data[0]))
  }, [])
  useEffect(() => {
    fetch("./appointments")
      .then((r) => r.json())

      .then((data) => setAppointments(data))
  }, [])

  useEffect(() => {
    fetch("./users")
      .then((r) => r.json())
      .then(setUsersArray)
  }, [])

  const handleCloseApptEdit = () => setOpenApptEdit(false)
  const toggleAlert = () => setShowAlert((prevstate) => !prevstate)

  function datePick(newDateValue) {
    setDateValue(newDateValue)
    const formattedDate = format(newDateValue, "EEEE, MMM d yyyy 'at' h:mmaaa")
    setTime(formattedDate.toString())
  }
  function filterWeekends(date) {
    return date.getDay() === 0
  }
  function handleApptPatch(e) {
    e.preventDefault()
    fetch(`/appointments/${selectedApptid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        time: time,
      }),
    }).then((r) => {
      if (r.ok) {
        r.json().then(setDateValue(null))
        setSelectedApptTime(time)
        handleApptClose()
      } else
        alert("This day/time is not available, please select another time.")
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    fetch(`/users/${currentUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
      }),
    }).then((r) => r.json)
    handleClose()
  }
  function handleEditAppointment(e) {
    handleOpenApptEdit()
    setSelectedApptFirstname(e.row.firstName)
    setSelectedApptLastname(e.row.lastName)
    setSelectedApptTime(e.row.time)
    setSelectedApptid(e.row.id)
    setSelectedGuest(usersArray.filter((user) => user.id === e.row.user_id))
  }

  const rows = appointments?.map((appt) => {
    return {
      id: appt.id,
      lastName: appt.lastname,
      firstName: appt.firstname,
      time: appt.time,
      desposit: appt.deposit_received,
      user_id: appt.user_id,
    }
  })

  const studentInquiryRows = studentInquiries?.map((inq) => {
    return {
      id: inq.id,
      lastName: inq.lastname,
      firstName: inq.firstname,
      lessonType: inq.lessonType,
      phone: inq.phone,
      travel: inq.travel,
    }
  })

  const studentInquiryColumnns = [
    {
      field: "lastName",
      headerName: "Last Name",
      width: 150,
    },
    { field: "firstName", headerName: "Last Name", width: 150 },
    {
      field: "lessonType",
      headerName: "Lesson Type",
      width: 150,
    },
    {
      field: "phone",
      headerName: "Phone Number",
      width: 200,
    },
    {
      field: "travel",
      headerName: "Travel ?",
      width: 100,
    },
  ]
  const columns = [
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
    },
    { field: "lastName", headerName: "Last name", width: 150 },
    {
      field: "time",
      headerName: "Time",
      type: "string",
      width: 300,
    },

    {
      field: "cancel",
      headerName: "Modify Appointment",
      width: 200,
      renderCell: (params) => (
        <strong>
          {params.value?.getFullYear() ?? ""}
          <Button
            variant="contained"
            color="warning"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={handleFirstDeleteButton}
          >
            Modify Appointment
          </Button>
        </strong>
      ),
    },
  ]

  function handleFirstDeleteButton(e) {
    toggleAlert()
  }

  function updateApptsArrayAfterDelete(id) {
    const filter = appointments.filter((appt) => appt.id !== id)
    return setAppointments(filter)
  }
  function handleHardDelete(e) {
    updateApptsArrayAfterDelete(selectedApptid)
    fetch(`/appointments/${selectedApptid}`, {
      method: "DELETE",
    }).then(setShowAlert(!showAlert))
    handleCloseApptEdit()
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          sx={{
            backgroundColor: "#b5b8a3",
            borderRadius: "10px",
            color: "white",
          }}
          onClick={handleOpen}
        >
          Edit Profile
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          {/* <Container component="main" maxWidth="s">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255)",
                padding: "40px",
                borderRadius: "20px",
              }}
            >
              <Typography
                sx={{ fontFamily: "Sacramento", color: " #807b67" }}
                variant="h2"
              >
                My Profile Details
              </Typography>

              <FormControl>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
                        name="firstName"
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
                        name="firstName"
                        fullWidth
                        id="firstName"
                        label="Last Name"
                        autoFocus
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="email"
                        fullWidth
                        id="email"
                        label="Email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="phone"
                        fullWidth
                        id="phone"
                        label="Phone Number"
                        autoFocus
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    onChange={handleSubmit}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, backgroundColor: "#b26446 " }}
                  >
                    Submit
                  </Button>
                  <Button
                    type="onClick"
                    onChange={() => handleClose()}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, backgroundColor: "#b26446 " }}
                  >
                    cancel
                  </Button>
                  <Grid container justifyContent="flex-end"></Grid>
                </Box>
              </FormControl>
            </Box>
          </Container> */}
        </Modal>

        {/* ---------------------------------------------------------------- */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
          }}
        >
          <Typography variant="h2" sx={{ fontFamily: "Montserrat" }}>
            Student Education Inquiries
          </Typography>

          <div
            style={{
              borderRadius: "20px",
              backgroundColor: "#edccb9",
              height: 400,
              width: "80%",
              display: "flex",
            }}
          >
            <DataGrid
              sx={{
                borderRadius: "20px",
                borderColor: "#9f6755",
                boxShadow: 2,
                padding: "10px",
                borderRadius: "20px",
              }}
              rows={studentInquiryRows}
              columns={studentInquiryColumnns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        </div>
        <div
          style={{
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* ---------------------------------------------------------------- */}
          <Typography variant="h2" sx={{ fontFamily: "Montserrat" }}>
            Appointments
          </Typography>

          <div
            style={{
              borderRadius: "20px",
              backgroundColor: "#edccb9",
              height: 400,
              width: "80%",
              display: "flex",
            }}
          >
            <DataGrid
              sx={{
                boxShadow: 2,
                border: "none",
                padding: "10px",
                borderRadius: "20px",
              }}
              // onSelectionModelChange={}
              onCellClick={handleEditAppointment}
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Modal
            open={openApptEdit}
            onClose={handleCloseApptEdit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255)",
                padding: "40px",
                borderRadius: "20px",
              }}
            >
              <Typography
                sx={{ fontFamily: "Sacramento" }}
                id="modal-modal-title"
                variant="h3"
              >
                Modify Appointment
              </Typography>
              <br />
              <br />
              <Typography
                id="modal-modal-title"
                variant="body"
                sx={{ fontFamily: "Montserrat" }}
              >{`Guest : ${selectedApptFirstname} ${selectedApptLastname}`}</Typography>
              <Typography
                id="modal-modal-title"
                variant="body"
                sx={{ fontFamily: "Montserrat" }}
              >{`Time : ${selectedApptTime} `}</Typography>
              <Button
                id="modal-modal-description"
                sx={{ mt: 2, color: "#b26446" }}
                onClick={handleApptOpen}
              >
                Reschedule
              </Button>
              <Modal
                open={apptOpen}
                onClose={handleApptClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Container component="main" maxWidth="s">
                  <CssBaseline />
                  <Box
                    sx={{
                      marginTop: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "rgba(255, 255, 255)",
                      padding: "40px",
                      borderRadius: "20px",
                    }}
                  >
                    <Typography component="h1" variant="h5">
                      Schedule
                    </Typography>

                    <FormControl>
                      <Box
                        component="form"
                        noValidate
                        onSubmit={handleApptPatch}
                        sx={{ mt: 3 }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={6}>
                            <DateTimePicker
                              sx={{
                                button: {
                                  color: "white",
                                },
                              }}
                              minutesStep="0"
                              shouldDisableDate={filterWeekends}
                              minTime={new Date(0, 0, 0, 10)}
                              maxTime={new Date(0, 0, 0, 14)}
                              maxDate={new Date("2022-12-31")}
                              minDate={new Date()}
                              renderInput={(props) => <TextField {...props} />}
                              value={dateValue}
                              placeholder={selectedApptTime}
                              onChange={(newDateValue) => {
                                datePick(newDateValue)
                              }}
                            />
                          </Grid>

                          <Grid item xs={6} sm={6}>
                            <Button>10:00</Button>
                            <Button>11:00</Button> <Button>12:00</Button>{" "}
                            <Button>1:00</Button> <Button>2:00</Button>{" "}
                            <Button>3:00</Button> <Button>4:00</Button>{" "}
                          </Grid>
                        </Grid>

                        <Button
                          type="submit"
                          onChange={handleApptPatch}
                          fullWidth
                          variant="contained"
                          sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: "#b26446",
                          }}
                        >
                          Submit
                        </Button>

                        <Grid container justifyContent="flex-end"></Grid>
                      </Box>
                    </FormControl>
                  </Box>
                </Container>
              </Modal>{" "}
              {showAlert ? null : (
                <Alert severity="warning">
                  You are about to delete this appointment - this action{" "}
                  <strong> cannot </strong> be undone, are you sure you want to
                  proceed?
                  <Button onClick={handleHardDelete}>
                    Yes, Cancel Appointment
                  </Button>
                  <Button onClick={() => setShowAlert(true)}>Back</Button>
                </Alert>
              )}
              <Button
                style={{ color: "#b26446" }}
                onClick={handleFirstDeleteButton}
              >
                Cancel This Appointment
              </Button>
              <Typography
                id="modal-modal-title"
                variant="body"
                sx={{ fontFamily: "Montserrat" }}
              >
                Guest Pictures:{" "}
              </Typography>
              <br />
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {selectedGuest ? (
                  <>
                    <Grid item xs={2}>
                      <img
                        style={{
                          height: "250px",
                          width: "200px",

                          borderRadius: "100px",
                          objectFit: "cover",
                        }}
                        src={
                          selectedGuest[0]?.user_consults[0]?.mugshotone?.url
                            ? selectedGuest[0]?.user_consults[0].mugshotone.url
                            : bohoart4
                        }
                        alt="picture"
                      />{" "}
                    </Grid>
                    <Grid item xs={2}>
                      <img
                        style={{
                          height: "250px",
                          width: "200px",

                          borderRadius: "100px",
                          objectFit: "cover",
                        }}
                        src={
                          selectedGuest[0]?.user_consults[0]?.mugshottwo?.url
                            ? selectedGuest[0]?.user_consults[0].mugshottwo.url
                            : sun
                        }
                        alt="picture"
                      />{" "}
                    </Grid>
                    <Grid item xs={2}>
                      <img
                        style={{
                          height: "250px",
                          width: "200px",

                          borderRadius: "100px",
                          objectFit: "cover",
                        }}
                        src={
                          selectedGuest[0]?.user_consults[0]?.mugshotthree?.url
                            ? selectedGuest[0]?.user_consults[0].mugshotthree
                                .url
                            : bohoart
                        }
                        alt="picture"
                      />{" "}
                    </Grid>
                    <Grid item xs={2}>
                      <img
                        style={{
                          height: "250px",
                          width: "200px",

                          borderRadius: "100px",
                          objectFit: "cover",
                        }}
                        src={
                          selectedGuest[0]?.user_consults[0]?.mugshotfour?.url
                            ? selectedGuest[0]?.user_consults[0].mugshotfour.url
                            : flower
                        }
                        alt="picture"
                      />{" "}
                    </Grid>
                    <Grid item xs={2}>
                      <img
                        style={{
                          height: "250px",
                          width: "200px",

                          borderRadius: "100px",
                          objectFit: "cover",
                        }}
                        src={
                          selectedGuest[0]?.user_consults[0]?.mugshotfive?.url
                            ? selectedGuest[0]?.user_consults[0].mugshotfive.url
                            : bohoart2
                        }
                        alt="picture"
                      />{" "}
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Grid item xs={2}>
                        <img
                          style={{
                            height: "250px",
                            width: "200px",

                            borderRadius: "100px",
                            objectFit: "cover",
                          }}
                          src={
                            selectedGuest[0]?.user_images[0]?.picture?.url
                              ? selectedGuest[0]?.user_images[0].picture.url
                              : mcm1
                          }
                          alt="picture"
                        />{" "}
                      </Grid>
                      <Grid item xs={2}>
                        <img
                          style={{
                            height: "250px",
                            width: "200px",

                            borderRadius: "100px",
                            objectFit: "cover",
                          }}
                          src={
                            selectedGuest[0]?.user_images[0]?.picturetwo?.url
                              ? selectedGuest[0]?.user_images[0].picturetwo.url
                              : sun
                          }
                          alt="picture"
                        />{" "}
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <p>This guest has not uploaded any pictures yet!</p>
                )}
              </Grid>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  )
}

export default AdminPortal
