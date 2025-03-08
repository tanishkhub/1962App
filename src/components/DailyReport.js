import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DailyReport.css'; // Import the custom CSS file for page break styles

const DailyReport = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [dynamicDate, setDynamicDate] = useState('');
    const [attendance, setAttendance] = useState([]);
    const [ticketDetails, setTicketDetails] = useState([]);
    const [collectionSummary, setCollectionSummary] = useState([]);
    const [expandedRows, setExpandedRows] = useState(new Set()); // State to track expanded rows
    const [showForm, setShowForm] = useState(true); // State to control form visibility

    const carVehicleMapping = {
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
        13: 'राहतगढ',
    };

    const updateDynamicDate = (date) => {
        const currentDate = date ? new Date(date) : new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const currentDayOfWeek = days[currentDate.getDay()];
        const currentDay = currentDate.getDate();
        const currentMonth = months[currentDate.getMonth()];
        const currentYear = currentDate.getFullYear();

        setDynamicDate(`${currentDayOfWeek}, ${currentDay} ${currentMonth} ${currentYear}`);
    };

    const handleDateSubmit = async (event) => {
        event.preventDefault();
        updateDynamicDate(selectedDate);

        try {
            const response = await fetch(`https://1962logsapi.vercel.app/api/tickets/date?date=${selectedDate}`);
            const data = await response.json();

            if (response.ok) {
                setAttendance(data.map(ticket => ({
                    carNumber: carVehicleMapping[ticket.carNumber],
                    doctor: ticket.doctorAttendance,
                    paravet: ticket.assistantAttendance,
                    driver: ticket.driverAttendance,
                    comment: ticket.comment,
                })));

                setTicketDetails(data.map(ticket => ({
                    carNumber: carVehicleMapping[ticket.carNumber],
                    newTicket: ticket.newTicket,
                    prevPending: ticket.prevPendingTicket,
                    pending: ticket.pendingTicket,
                    attended: ticket.attendedTicket,
                    cancelled: ticket.cancelledTicket,
                })));

                setCollectionSummary(data.map(ticket => ({
                    carNumber: carVehicleMapping[ticket.carNumber],
                    generalAnimals: ticket.generalAnimals,
                    dogs: ticket.dogs,
                    otherAnimals: ticket.otherAnimals,
                    collected: ticket.collected,
                    toBeDeposited: ticket.toBeDeposited,
                })));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        updateDynamicDate();
    }, []);

    const printReport = () => {
        // Hide the form
        setShowForm(false);

        // Trigger the print dialog
        
        window.print();

        // Show the form again after a brief delay
        setTimeout(() => {
            setShowForm(true);
        }, 1000); // Delay in milliseconds (1 second)
    };

    const toggleRow = (index) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(index)) {
            newExpandedRows.delete(index); // Collapse row if it is already expanded
        } else {
            newExpandedRows.add(index); // Expand row if it is collapsed
        }
        setExpandedRows(newExpandedRows);
    };

    return (
        <div className="container bg-light p-5 rounded shadow-lg">
            <section className="mb-5">
                <header className="text-center">
                    <h1 className="display-4 text-primary">1962: Animal Mobile Medical Ambulance Report</h1>
                    <h1 className="h4 text-secondary mt-2">{dynamicDate}</h1>
                </header>

                <main className="mt-4">
                    {showForm && (
                        <form id="date-form" className="d-flex flex-column flex-md-row justify-content-center align-items-center mb-4" onSubmit={handleDateSubmit}>
                            <label htmlFor="report-date" className="form-label me-2">Select Date:</label>
                            <input
                                type="date"
                                id="report-date"
                                name="report-date"
                                className="form-control w-auto"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary ms-3 mt-2 mt-md-0">
                                Submit
                            </button>
                            <div>&nbsp;</div>
                            <button
                                type="button" 
                                onClick={printReport} 
                                className="btn btn-primary"
                            >
                                Print
                            </button>
                        </form>
                    )}
                </main>
            </section>

            <section className="mb-5 page-break">
                {/* Ticket Detail Section */}
                <h2 className="h3 text-dark mb-3">Ticket Detail</h2>
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Location</th>
                            <th>New Ticket</th>
                            <th>Prev Pending</th>
                            <th>Pending</th>
                            <th>Attended</th>
                            <th>Cancelled</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticketDetails.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.carNumber}</td>
                                <td>{row.newTicket}</td>
                                <td>{row.prevPending}</td>
                                <td>{row.pending}</td>
                                <td>{row.attended}</td>
                                <td>{row.cancelled}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="page-break">
                {/* Collection Summary Section */}
                <h2 className="h3 text-dark mb-3">Collection Summary</h2>
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Vikas Khand</th>
                            <th>General Animals</th>
                            <th>Dogs</th>
                            <th>Other Animals</th>
                            <th>Amount Collected</th>
                            <th>Amount to Deposit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collectionSummary.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.carNumber}</td>
                                <td>{row.generalAnimals}</td>
                                <td>{row.dogs}</td>
                                <td>{row.otherAnimals}</td>
                                <td>{row.collected}</td>
                                <td>{row.toBeDeposited}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="page-break">
                {/* Attendance Section */}
                <h2 className="h3 text-dark mb-3">Attendance</h2>
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Vikas Khand</th>
                            <th>Doctor</th>
                            <th>Paravet</th>
                            <th>Driver</th>
                            <th>Comments</th> {/* New Comments column */}
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.carNumber}</td>
                                <td>{row.doctor}</td>
                                <td>{row.paravet}</td>
                                <td>{row.driver}</td>
                                <td className="wrap-text" onClick={() => toggleRow(index)} style={{ cursor: 'pointer' }}>
    {expandedRows.has(index) 
        ? row.comment || "No Comments" // Display the comment or "No Comments"
        : (row.comment ? row.comment.slice(0, 50) + '...' : 'No Comments')}
</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default DailyReport;
