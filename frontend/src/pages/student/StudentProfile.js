import React, { useState } from "react";
import styled from "styled-components";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Container,
  Paper,
  Button,
  Input,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";

import axios from "axios";
import {
  getFailed,
  getError,
  stuffDone,
} from "../../redux/studentRelated/studentSlice";
const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
const StudentProfile = () => {
  const [gender, setGender] = useState("");
  const handleChange = (event) => {
    setGender(event.target.value);
  };
  const dispatch = useDispatch();
  const { currentUser, response, error } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [dob, setDob] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const sclassName = currentUser.sclassName;
  const studentSchool = currentUser.school;

  const date = new Date(currentUser.dob).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const updateProfile = async () => {
    setLoading(true);
    const inputDate = new Date(dob).toLocaleDateString();
    try {
      const data = {
        email: email,
        phone: phone,
        address: address,
        emergencyContact: emergencyContact,
        dob: inputDate.valueOf(),
        gender: gender,
      };
      console.log(data);

      const result = await axios.put(
        `${REACT_APP_BASE_URL}/Student/profile/${currentUser._id}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (result) {
        setEmail(result.email || currentUser.email);
        setPhone(result.phone || currentUser.phone);
        setAddress(result.address || currentUser.address);
        setEmergencyContact(
          result.emergencyContact || currentUser.emergencyContact
        );
        setDob(dayjs(result.dob || currentUser.dob));
        setGender(result.gender || currentUser.gender);
      }

      if (result.data.message) {
        dispatch(getFailed(result.data.message));
      } else {
        dispatch(stuffDone());
      }
    } catch (error) {
      dispatch(getError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="md">
        <StyledPaper elevation={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Avatar alt="Student Avatar" sx={{ width: 150, height: 150 }}>
                  {String(currentUser.name).charAt(0)}
                </Avatar>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography variant="h5" component="h2" textAlign="center">
                  {currentUser.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography
                  variant="subtitle1"
                  component="p"
                  textAlign="center"
                >
                  Student Sch.Id: {currentUser.rollNum}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography
                  variant="subtitle1"
                  component="p"
                  textAlign="center"
                >
                  Course: {sclassName.sclassName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography
                  variant="subtitle1"
                  component="p"
                  textAlign="center"
                >
                  College: {studentSchool.schoolName}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </StyledPaper>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personal Information:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Date of Birth:</strong> {date}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Gender:</strong> {currentUser.gender}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Email:</strong> {currentUser.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Phone:</strong> {currentUser.phone}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Address:</strong> {currentUser.address}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Emergency Contact:</strong>{" "}
                  {currentUser.emergencyContact}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card
          style={{ padding: "20px", maxWidth: "600px", margin: "20px auto" }}
        >
          <form noValidate autoComplete="off">
            {/* Email Input */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Email</InputLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter Email"
              />
            </FormControl>

            {/* Phone Input */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Phone</InputLabel>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="Enter Phone"
              />
            </FormControl>

            {/* Address Input */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Address</InputLabel>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                placeholder="Enter Address"
              />
            </FormControl>

            {/* Emergency Contact Input */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Emergency Contact</InputLabel>
              <Input
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                type="text"
                placeholder="Enter Emergency Contact"
              />
            </FormControl>

            {/* Date of Birth Picker */}
            <FormControl fullWidth margin="normal">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={dob}
                  onChange={(newValue) => setDob(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>

            {/* Gender Selection */}
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel id="gender-label">Select Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender-select"
                value={gender}
                onChange={handleChange}
                label="Select Gender" // This ensures the label floats above the dropdown
              >
                <MenuItem value="" disabled>
                  Select gender
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            {gender && (
              <p style={{ marginTop: "10px" }}>You selected: {gender}</p>
            )}

            {/* Update Profile Button */}
            <Button
              onClick={updateProfile}
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "20px" }}
              disabled={loading} // Disable button during async call
            >
              {loading ? "Updating..." : "Update Profile"}{" "}
              {/* Button text based on loading state */}
            </Button>
          </form>
        </Card>
      </Container>
    </>
  );
};

export default StudentProfile;

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`;
