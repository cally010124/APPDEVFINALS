import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COURSE_MAP = {
  'BSIT': 'Bachelor of Science in Information Technology',
  'BSOA': 'Bachelor of Office Administration',
  'BSED': 'Bachelor of Secondary Education',
  'BEED': 'Bachelor of Elementary Education',
  'BSBA': 'Bachelor of Science in Business Administration',
  'BSHM': 'Bachelor of Science in Hospitality Management',
  'BSCRIM': 'Bachelor of Science in Criminology',
  'BSCS': 'Bachelor of Science in Computer Science',
  'BSTM': 'Bachelor of Science in Tourism Management',
  // Add more as needed
};

const getAutoRemarks = (grade, originalRemarks) => {
  const num = parseFloat(grade);
  if (!isNaN(num)) {
    if (num >= 1 && num <= 3) return 'PASSED';
    if (num >= 4 && num <= 5) return 'FAILED';
  }
  return originalRemarks || '';
};

const getCurrentDate = () => {
  const d = new Date();
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
};

// Helper to convert image to base64
const getBase64ImageFromUrl = async (imageUrl) => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const StudentDashboard = () => {
  const [grades, setGrades] = useState([]);
  const [studentInfo, setStudentInfo] = useState({ student_id: '', name: '', course: '', year: '', section: '' });
  const [loading, setLoading] = useState(true);
  const [sy, setSy] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        // Fetch student info
        const studentRes = await axios.get('http://localhost:5000/api/students/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudentInfo(studentRes.data);
        // Fetch grades
        const payload = JSON.parse(atob(token.split('.')[1]));
        const student_id = payload.student_id;
        const res = await axios.get(`http://localhost:5000/api/grades/student/${student_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGrades(res.data);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          alert('Session expired or unauthorized. Please log in again.');
          navigate('/student-login');
        } else {
          alert('Failed to fetch grades.');
        }
      }
      setLoading(false);
    };
    const fetchSy = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const res = await axios.get('http://localhost:5000/api/settings/sy', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.sy) setSy(res.data.sy);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          alert('Session expired or unauthorized. Please log in again.');
          navigate('/student-login');
        } else {
          setSy('1st Semester S.Y. 2024-2025');
        }
      }
    };
    fetchGrades();
    fetchSy();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/student-login');
  };

  // Compute GWA (weighted average)
  const computeGWA = () => {
    let totalUnits = 0;
    let weightedSum = 0;
    grades.forEach(g => {
      const gradeNum = parseFloat(g.grade);
      const unitsNum = parseFloat(g.units);
      if (!isNaN(gradeNum) && !isNaN(unitsNum)) {
        weightedSum += gradeNum * unitsNum;
        totalUnits += unitsNum;
      }
    });
    if (totalUnits === 0) return 'N/A';
    return (weightedSum / totalUnits).toFixed(2);
  };

  const getTotalUnits = () => {
    return grades.reduce((sum, g) => sum + (parseInt(g.units) || 0), 0);
  };

  // PDF Export
  const handleExportPDF = async () => {
    const doc = new jsPDF();
    // Logo and header in a table layout
    const imgUrl = `${process.env.PUBLIC_URL}/PTCLOGO.PNG`;
    const imgData = await getBase64ImageFromUrl(imgUrl);
    doc.addImage(imgData, 'PNG', 15, 10, 25, 25);
    doc.setFontSize(14);
    doc.text('PATEROS TECHNOLOGICAL COLLEGE', 50, 18);
    doc.setFontSize(10);
    doc.text('COLLEGE ST., STO. ROSARIO-KANLURAN', 50, 24);
    doc.text('PATEROS, METRO MANILA', 50, 29);
    doc.text('WEBSITE: paterostechnologicalcollege.edu.ph', 50, 34);
    doc.setFontSize(10);
    doc.text(getCurrentDate(), 180, 10, { align: 'right' });
    doc.setFontSize(12);
    doc.text('REPORT OF GRADE', 105, 44, { align: 'center' });
    // Student Info (aligned label and value on one line)
    doc.setFontSize(10);
    const labelX = 20;
    const valueX = 70;
    let y = 60;
    doc.setFont('helvetica', 'bold');
    doc.text('NAME OF STUDENT:', labelX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(studentInfo.name, valueX, y);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('COURSE:', labelX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(COURSE_MAP[studentInfo.course] || studentInfo.course, valueX, y);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('YEAR & SECTION:', labelX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${studentInfo.course} - ${studentInfo.year}${studentInfo.section}`, valueX, y);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('S.Y.:', labelX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(sy, valueX, y);
    // Table
    const tableData = grades.map(g => [g.subject_code || '', g.subject || '', g.units, g.grade, getAutoRemarks(g.grade, g.remarks)]);
    autoTable(doc, {
      head: [['SUBJECT CODE', 'SUBJECT TITLE', 'Units', 'GRADE', 'REMARKS']],
      body: tableData,
      startY: y + 15,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { halign: 'center' },
      columnStyles: {
        1: { halign: 'left' },
      },
      foot: [[ '', '', getTotalUnits().toString(), '', '' ]],
      footStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'bold' },
    });
    // GWA
    doc.text(`GWA: ${computeGWA()}`, 180, doc.lastAutoTable.finalY + 10, { align: 'right' });
    doc.save('report_of_grade.pdf');
  };

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      {/* Unified report box */}
      <div className="ptc-report-box">
        {/* Header row: logo left, school info center, date right */}
        <div className="ptc-header-flexrow">
          <img
            src={process.env.PUBLIC_URL + '/PTCLOGO.PNG'}
            alt="PTC Logo"
            className="ptc-header-logo"
          />
          <div className="ptc-header-center">
            <div className="ptc-school-title">PATEROS TECHNOLOGICAL COLLEGE</div>
            <div className="ptc-school-sub">COLLEGE ST., STO. ROSARIO-KANLURAN</div>
            <div className="ptc-school-sub">PATEROS, METRO MANILA</div>
            <div className="ptc-school-sub">
              WEBSITE: <span className="ptc-school-link">paterostechnologicalcollege.edu.ph</span>
      </div>
            <div className="ptc-report-title">REPORT OF GRADE</div>
        </div>
          <div className="ptc-header-date">{getCurrentDate()}</div>
      </div>
      {/* Student Info */}
        <table className="ptc-student-info-table">
            <tbody>
              <tr>
              <td className="ptc-student-info-label">NAME OF STUDENT:</td>
              <td className="ptc-student-info-value">{studentInfo.name}</td>
              </tr>
              <tr>
              <td className="ptc-student-info-label">COURSE:</td>
              <td className="ptc-student-info-value ptc-student-info-course">{COURSE_MAP[studentInfo.course] || studentInfo.course}</td>
              </tr>
              <tr>
              <td className="ptc-student-info-label">YEAR & SECTION:</td>
              <td className="ptc-student-info-value">{studentInfo.course} - {studentInfo.year}{studentInfo.section}</td>
              </tr>
              <tr>
              <td className="ptc-student-info-label">S.Y.:</td>
              <td className="ptc-student-info-value">{sy}</td>
              </tr>
            </tbody>
          </table>
      {/* Grades Table */}
          <div className="table-responsive d-flex justify-content-center">
            {loading ? (
              <p>Loading...</p>
            ) : grades.length === 0 ? (
              <p>No grades found.</p>
            ) : (
            <table className="ptc-grade-table">
              <thead>
                  <tr>
                    <th>SUBJECT CODE</th>
                    <th>SUBJECT TITLE</th>
                    <th>Units</th>
                    <th>GRADE</th>
                    <th>REMARKS</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade, idx) => (
                    <tr key={idx}>
                      <td>{grade.subject_code || ''}</td>
                    <td className="ptc-td-left">{grade.subject}</td>
                      <td>{grade.units}</td>
                      <td>{grade.grade}</td>
                      <td>{getAutoRemarks(grade.grade, grade.remarks)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        {/* GWA display moved inside container */}
        <div className="ptc-gwa-display">
          <strong>GWA: {computeGWA()}</strong>
        </div>
      </div>
      {/* Centered action buttons below the report box */}
      <div className="ptc-report-actions">
        <button className="btn btn-outline-danger ptc-action-btn" onClick={handleLogout}>
          Back
        </button>
        <button className="btn btn-primary ptc-action-btn" onClick={handleExportPDF}>
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard; 