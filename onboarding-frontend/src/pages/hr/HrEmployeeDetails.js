import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function HrEmployeeDetails() {

  const { email } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/employees/${email}`
      );
      setEmployee(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!employee) return <h3 style={{ padding: "30px" }}>Loading...</h3>;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <h2 style={{ marginTop: "20px" }}>Employee Details</h2>

      <hr />

      <p><b>Employee ID:</b> {employee.employeeId}</p>
      <p><b>Name:</b> {employee.name}</p>
      <p><b>Email:</b> {employee.email}</p>
      <p><b>Contact:</b> {employee.contactNumber}</p>

      <p><b>Department:</b> {employee.department}</p>
      <p><b>Designation:</b> {employee.designation}</p>
      <p><b>Employment Type:</b> {employee.employmentType}</p>

      <p><b>Work Location:</b> {employee.workLocation}</p>
      <p><b>Work Mode:</b> {employee.workMode}</p>

      <p><b>Date of Joining:</b> {employee.dateOfJoining}</p>
      <p><b>Reporting Time:</b> {employee.reportingTime}</p>

      <hr />

      <h3>Manager Details</h3>

      <p><b>Manager Name:</b> {employee.managerName}</p>
      <p><b>Manager Email:</b> {employee.managerEmail}</p>
      <p><b>Manager Contact:</b> {employee.managerContact}</p>

      <hr />

      <p><b>Accommodation:</b> {employee.accommodation}</p>
      <p><b>Official Email:</b> {employee.officialEmail}</p>

      <p>
        <b>Status:</b>{" "}
        <span style={{ color: "green", fontWeight: "bold" }}>
          {employee.status}
        </span>
      </p>

    </div>
  );
}

export default HrEmployeeDetails;
