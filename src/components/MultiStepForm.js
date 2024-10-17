import React, { useState } from 'react';
import { Form, Button, FloatingLabel, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        carNumber: '',
        vehicleNumber: '',
        newTicket: '',
        prevPendingTicket: 0,
        pendingTicket: '',
        attendedTicket: '',
        cancelledTicket: '',
        generalAnimals: '',
        dogs: '',
        otherAnimals: '',
        generalAnimalAmount: '',
        dogsAmount: '',
        otherAnimalsAmount: '',
        collected: '',
        toBeDeposited: '',
        doctorAttendance: '',
        assistantAttendance: '',
        driverAttendance: '',
        comment: '',
        date: new Date().toISOString().split('T')[0] // Set default to current date in YYYY-MM-DD format
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const carVehicleMapping = {
        1: 'MP-02-ZA-0104 (केसली)',
        2: 'MP-02-ZA-0156 (मालथौन)',
        3: 'MP-02-ZA-0142 (सागर 1)',
        4: 'MP-02-ZA-0125 (रहली)',
        5: 'MP-02-ZA-0140 (देवरी)',
        6: 'MP-02-ZA-0126 (जैसीनगर)',
        7: 'MP-02-ZA-0151 (खुरई)',
        8: 'MP-02-ZA-0146 (वण्‍डा)',
        9: 'MP-02-ZA-0186 (शाहगढ)',
        10: 'MP-02-ZA-0139 (सागर 2)',
        11: 'MP-02-ZA-0199 (सागर HQ)',
        12: 'MP-02-ZA-0192 (बीना)',
        13: 'MP-02-ZA-0159 (राहतगढ)',
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Update pending ticket whenever there's a change in the relevant fields
        if (['newTicket', 'attendedTicket', 'cancelledTicket'].includes(name)) {
            const updatedData = { ...formData, [name]: value };
            setFormData((prevData) => ({
                ...updatedData,
                pendingTicket: updatePendingTicket(updatedData)
            }));
        }
    };

    const handleCarNumberChange = async (e) => {
        const selectedCarNumber = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            carNumber: selectedCarNumber,
            vehicleNumber: carVehicleMapping[selectedCarNumber] || '',
            prevPendingTicket: 0 
        }));

        if (selectedCarNumber) {
            const selectedDate = new Date(formData.date);
            const previousDate = new Date(selectedDate);
            previousDate.setDate(previousDate.getDate() - 1);
            const formattedPreviousDate = previousDate.toISOString();

            try {
                const response = await axios.get(`https://1962logsapi.vercel.app/api/tickets/latest/${selectedCarNumber}`, {
                    params: { date: formattedPreviousDate }
                });
                const prevPendingTicket = Math.max(response.data.pendingTicket || 0, 0);
                setFormData((prevData) => {
                    const updatedData = {
                        ...prevData,
                        prevPendingTicket,
                        pendingTicket: updatePendingTicket({ ...prevData, prevPendingTicket })
                    };
                    return updatedData;
                });
            } catch (error) {
                console.error('Error fetching the latest ticket:', error);
                setFormData((prevData) => ({
                    ...prevData,
                    prevPendingTicket: 0,
                    pendingTicket: updatePendingTicket({ ...prevData, prevPendingTicket: 0 })
                }));
            }
        }
    };
    
    const updatePendingTicket = (updatedData) => {
        // Extract values and convert to numbers, defaulting to 0 if not a valid number
        const newTicket = Number(updatedData.newTicket) || 0;
        const prevPendingTicket = Number(updatedData.prevPendingTicket) || 0;
        const attendedTicket = Number(updatedData.attendedTicket) || 0;
        const cancelledTicket = Number(updatedData.cancelledTicket) || 0;
    
        // Calculate new pending ticket
        const newPendingTicket = newTicket + prevPendingTicket - (attendedTicket + cancelledTicket);
    
        // Ensure the pending ticket is not negative
        return Math.max(newPendingTicket, 0); // Returns 0 if newPendingTicket is negative
    };
    
    

    const calculateAmounts = (updatedData) => {
        updatedData.generalAnimalAmount = updatedData.generalAnimals * 150;
        updatedData.dogsAmount = updatedData.dogs * 300;
        updatedData.otherAnimalsAmount = updatedData.otherAnimals * 150;
        updatedData.collected = updatedData.generalAnimalAmount + updatedData.dogsAmount + updatedData.otherAnimalsAmount;
        updatedData.toBeDeposited = updatedData.collected - updatedData.otherAnimalsAmount;
        return updatedData;
    };

    const handleGeneralAnimalsChange = (e) => {
        const numericValue = Number(e.target.value) || 0;
        setFormData((prevData) => calculateAmounts({ ...prevData, generalAnimals: numericValue }));
    };

    const handleDogsChange = (e) => {
        const numericValue = Number(e.target.value) || 0;
        setFormData((prevData) => calculateAmounts({ ...prevData, dogs: numericValue }));
    };

    const handleOtherAnimalsChange = (e) => {
        const numericValue = Number(e.target.value) || 0;
        setFormData((prevData) => calculateAmounts({ ...prevData, otherAnimals: numericValue }));
    };

    const handleAttendanceChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://1962logsapi.vercel.app/api/tickets', formData);
            console.log('Ticket saved:', response.data);
            setToastMessage('Form submitted successfully!');
            setToastType('success');
            setShowToast(true);

            // Reset form and go to the first step
            setFormData({
                carNumber: '',
                vehicleNumber: '',
                newTicket: '',
                prevPendingTicket: '',
                pendingTicket: '',
                attendedTicket: '',
                cancelledTicket: '',
                generalAnimals: '',
                dogs: '',
                otherAnimals: '',
                generalAnimalAmount: '',
                dogsAmount: '',
                otherAnimalsAmount: '',
                collected: '',
                toBeDeposited: '',
                doctorAttendance: '',
                assistantAttendance: '',
                driverAttendance: '',
                date: new Date().toISOString().split('T')[0]
            });
            setStep(1);
        } catch (error) {
            console.error('Error saving ticket:', error);
            setToastMessage('An error occurred while submitting the form.');
            setToastType('danger');
            setShowToast(true);
        }
    };

    const ticketDetailsForm = () => (
        <div>
            <h3 className="text-center mb-4">Ticket Details</h3>
            <Form>
            <FloatingLabel controlId="formDate" label="Date" className="mb-3">
                    <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </FloatingLabel>
                <FloatingLabel controlId="formCarNumber" label="Car Number" className="mb-3">
                    <Form.Select name="carNumber" value={formData.carNumber} onChange={handleCarNumberChange}>
                        <option>Select Car Number</option>
                        {Object.keys(carVehicleMapping).map((key) => (
                            <option key={key} value={key}>{`${key}. ${carVehicleMapping[key]}`}</option>
                        ))}
                    </Form.Select>
                </FloatingLabel>

                <FloatingLabel controlId="formVehicleNumber" label="Vehicle Number" className="mb-3">
                    <Form.Control
                        type="text"
                        name="vehicleNumber"
                        placeholder="Vehicle Number"
                        value={formData.vehicleNumber}
                        readOnly
                    />
                </FloatingLabel>

                <FloatingLabel controlId="formNewTicket" label="New Ticket" className="mb-3">
                    <Form.Control type="number" name="newTicket" placeholder="New Ticket" value={formData.newTicket} onChange={handleChange} />
                </FloatingLabel>

                <FloatingLabel controlId="formAttendedTicket" label="Attended Ticket" className="mb-3">
                    <Form.Control type="number" name="attendedTicket" placeholder="Attended Ticket" value={formData.attendedTicket} onChange={handleChange} />
                </FloatingLabel>

                <FloatingLabel controlId="formCancelledTicket" label="Cancelled Ticket" className="mb-3">
                    <Form.Control type="number" name="cancelledTicket" placeholder="Cancelled Ticket" value={formData.cancelledTicket} onChange={handleChange} />
                </FloatingLabel>

                <FloatingLabel controlId="formPendingTicket" label="Pending Ticket" className="mb-3">
                    <Form.Control type="number" name="pendingTicket" placeholder="Pending Ticket" value={formData.pendingTicket} onChange={handleChange} />
                </FloatingLabel>

                <FloatingLabel controlId="formPrevPendingTicket" label="Previous Pending Ticket" className="mb-3">
                    <Form.Control type="number" name="prevPendingTicket" placeholder="Previous Pending Ticket" value={formData.prevPendingTicket} onChange={handleChange} readOnly />
                </FloatingLabel>
            </Form>
        </div>
    );

    const animalCountAndAmountForm = () => (
        <div>
            <h3 className="text-center mb-4">Animal Count and Amount</h3>
            <Form>
                <FloatingLabel controlId="formGeneralAnimals" label="General Animals" className="mb-3">
                    <Form.Control
                        type="number"
                        name="generalAnimals"
                        placeholder="General Animals"
                        value={formData.generalAnimals}
                        onChange={handleGeneralAnimalsChange}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="formDogs" label="Dogs" className="mb-3">
                    <Form.Control
                        type="number"
                        name="dogs"
                        placeholder="Dogs"
                        value={formData.dogs}
                        onChange={handleDogsChange}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="formOtherAnimals" label="Other Animals" className="mb-3">
                    <Form.Control
                        type="number"
                        name="otherAnimals"
                        placeholder="Other Animals"
                        value={formData.otherAnimals}
                        onChange={handleOtherAnimalsChange}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="formGeneralAnimalAmount" label="General Animal Amount" className="mb-3">
                    <Form.Control
                        type="number"
                        name="generalAnimalAmount"
                        placeholder="General Animal Amount"
                        value={formData.generalAnimalAmount}
                        readOnly
                    />
                </FloatingLabel>

                <FloatingLabel controlId="formDogsAmount" label="Dogs Amount" className="mb-3">
                    <Form.Control
                        type="number"
                        name="dogsAmount"
                        placeholder="Dogs Amount"
                        value={formData.dogsAmount}
                        readOnly
                    />
                </FloatingLabel>

                <FloatingLabel controlId="formOtherAnimalsAmount" label="Other Animals Amount" className="mb-3">
                    <Form.Control
                        type="number"
                        name="otherAnimalsAmount"
                        placeholder="Other Animals Amount"
                        value={formData.otherAnimalsAmount}
                        readOnly
                    />
                </FloatingLabel>
            </Form>
        </div>
    );

    const attendanceForm = () => (
        <div>
            <h3 className="text-center mb-4">Attendance</h3>
            <Form>
                <FloatingLabel controlId="formDoctorAttendance" label="Doctor Attendance" className="mb-3">
                    <Form.Select
                        name="doctorAttendance"
                        value={formData.doctorAttendance}
                        onChange={handleAttendanceChange}
                    >
                        <option value="">Select Attendance</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="leave">Leave</option>
                        <option value="WL">Weekly Off</option>
                        <option value="LH">Local Holiday</option>
                    </Form.Select>
                </FloatingLabel>
    
                <FloatingLabel controlId="formAssistantAttendance" label="Assistant Attendance" className="mb-3">
                    <Form.Select
                        name="assistantAttendance"
                        value={formData.assistantAttendance}
                        onChange={handleAttendanceChange}
                    >
                        <option value="">Select Attendance</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="leave">Leave</option>
                        <option value="WL">Weekly Off</option>
                        <option value="LH">Local Holiday</option>
                    </Form.Select>
                </FloatingLabel>
    
                <FloatingLabel controlId="formDriverAttendance" label="Driver Attendance" className="mb-3">
                    <Form.Select
                        name="driverAttendance"
                        value={formData.driverAttendance}
                        onChange={handleAttendanceChange}
                    >
                        <option value="">Select Attendance</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="leave">Leave</option>
                        <option value="WL">Weekly Off</option>
                        <option value="LH">Local Holiday</option>
                    </Form.Select>
                </FloatingLabel>
                <FloatingLabel controlId="formComment" label="Comments (Optional)" className="mb-3">
                <Form.Control
                    as="textarea"
                    name="comment"
                    placeholder="Add any comments here"
                    value={formData.comment}
                    onChange={handleChange}
                    style={{ height: '100px' }}
                />
            </FloatingLabel>
            </Form>
        </div>
    );
    

    return (
        <div className="container mt-5 p-4 rounded shadow-lg bg-light">
            <ToastContainer position="top-end" className="p-3">
                <Toast
                    bg={toastType}
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                >
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            {step === 1 && ticketDetailsForm()}
            {step === 2 && animalCountAndAmountForm()}
            {step === 3 && attendanceForm()}

            <div className="d-flex justify-content-between mt-4">
                {step > 1 && (
                    <Button variant="outline-secondary" onClick={prevStep}>
                        Previous
                    </Button>
                )}
                {step < 3 ? (
                    <Button variant="outline-primary" onClick={nextStep}>
                        Next
                    </Button>
                ) : (
                    <Button variant="outline-success" onClick={handleSubmit}>
                        Submit
                    </Button>
                )}
            </div>
        </div>
    );
};

export default MultiStepForm;
