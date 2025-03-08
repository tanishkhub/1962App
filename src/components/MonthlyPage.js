import React, { useState } from 'react';
import axios from 'axios';
import './MonthlyPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MonthlyPage = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFetchRecords = async () => {
        if (!fromDate || !toDate) {
            alert("Please select both From Date and To Date.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`https://1962logsapi.vercel.app/api/tickets/date-range`, {
                params: { fromDate, toDate },
            });
            setRecords(response.data);
        } catch (error) {
            console.error('Error fetching records:', error);
            alert(error.response?.data?.message || 'Failed to fetch records');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        document.body.classList.add('printing');
        const style = document.createElement('style');
        style.innerHTML = '@media print { @page { size: landscape; } }';
        document.head.appendChild(style);
        window.print();
        document.body.classList.remove('printing');
        document.head.removeChild(style);
    };

    const handleDownloadPDF = () => {
        // Capture the element containing the records
        const input = document.getElementById('pdf-content');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('landscape');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('monthly-records.pdf');
            })
            .catch((err) => {
                console.error("Error generating PDF", err);
                alert("Failed to generate PDF");
            });
    };

    const carNameMapping = {
        1: 'केसली',
        2: 'मालथौन',
        3: 'सागर 1',
        4: 'रहली',
        5: 'देवरी',
        6: 'जैसीनगर',
        7: 'खुरई',
        8: 'वण्‍डा',
        9: 'शाहगढ',
        10: 'सागर 2',
        11: 'सागर HQ',
        12: 'बीना',
        13: 'राहतगढ'
    };

    return (
        <div className="container my-4">
            <h2 className="text-center text-primary mt-4">Monthly Records</h2>

            <div id="date-selector" className="d-flex align-items-center mb-4">
                <label htmlFor="from-date" className="font-weight-bold me-2">From Date:</label>
                <input
                    type="date"
                    id="from-date"
                    name="from-date"
                    className="form-control me-3"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />

                <label htmlFor="to-date" className="font-weight-bold me-2">To Date:</label>
                <input
                    type="date"
                    id="to-date"
                    name="to-date"
                    className="form-control me-3"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />

                <button
                    onClick={handleFetchRecords}
                    className="btn btn-primary mx-2 hide-on-print"
                >
                    Fetch Records
                </button>
                <button
                    onClick={handlePrint}
                    className="btn btn-primary hide-on-print"
                >
                    Print
                </button>
                <button
                    onClick={handleDownloadPDF}
                    className="btn btn-primary hide-on-print"
                >
                    Download PDF
                </button>
            </div>

            {/* Wrap the content you want in the PDF in a container with an ID */}
            <div id="pdf-content">
                <div className="table-responsive">
                    <table className="table table-bordered text-center">
                        <thead className="table-light">
                            <tr>
                                <th style={{ textAlign: "center" }}>Location</th>
                                <th style={{ textAlign: "center" }}>Total New Tickets</th>
                                <th style={{ textAlign: "center" }}>Total Attended Tickets</th>
                                <th style={{ textAlign: "center" }}>Total Cancelled Tickets</th>
                                <th style={{ textAlign: "center" }}>Total Amount Collected</th>
                                <th style={{ textAlign: "center" }}>Total To Deposit</th>
                                {["DOCTOR", "PARAVET", "DRIVER"].map(role => (
                                    <React.Fragment key={role}>
                                        <th colSpan="5" style={{ textAlign: "center" }}>{role}</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                            <tr>
                                {["", "", "", "", "", ""].map((_, idx) => 
                                    <th key={idx} style={{ textAlign: "center" }}></th>
                                )}
                                {[...Array(3)].map((_, index) => 
                                    ["P", "A", "L", "WO", "LH"].map(status => (
                                        <th key={`${index}-${status}`} style={{ textAlign: "center" }}>{status}</th>
                                    ))
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="20">Loading...</td></tr>
                            ) : records.length > 0 ? (
                                records.map((record) => (
                                    <tr key={record.carNumber}>
                                        <td>{carNameMapping[record.carNumber] || record.carNumber}</td>
                                        <td>{record.totalNewTickets}</td>
                                        <td>{record.totalAttendedTickets}</td>
                                        <td>{record.totalCancelledTickets}</td>
                                        <td>{record.totalCollected}</td>
                                        <td>{record.totalToDeposit}</td>
                                        {["doctor", "assistant", "driver"].map(role => (
                                            ["Present", "Absent", "Leave", "WL", "LH"].map(status => (
                                                <td key={`${role}${status}`}>{record[`${role}${status}`]}</td>
                                            ))
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="20">No records found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MonthlyPage;
