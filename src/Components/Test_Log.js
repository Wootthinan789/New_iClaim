import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Test_Log = () => {
    const [logs, setLogs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [putdate, setPutDate] = useState(selectedDate.toISOString().slice(0, 10));

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = date.toISOString().slice(0, 10);
        setPutDate(formattedDate);
        fetchLogs(); // เรียกใช้งาน fetchLogs() เพื่อดึงข้อมูลใหม่เมื่อมีการเลือกวันที่ใหม่
    };

    useEffect(() => {
        // เรียก API เมื่อ component ถูกโหลด
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await axios.get(`http://rpa-apiprd.inet.co.th:443/iClaim/list/log?date=${putdate}`);
            setLogs(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const filteredLogs = logs.filter(log => log.Date_on.slice(0, 10) === putdate); // กรองข้อมูลเฉพาะที่มีวันที่ตรงกับวันที่ที่เลือกไว้

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Welcome To Test Log API</h1>
            <div className='Fixlocation'>
                <DatePicker className='Dashboard-Internal-button-date'
                    selected={selectedDate} onChange={handleDateChange} dateFormat="dd/MM/yyyy" />
            </div>
            <ul>
                {filteredLogs.map((log, index) => (
                    <li key={index}>
                        Date: {log.Date_on}, Status: {log.Status}, User: {log.User_name}, Remark: {log.Remark}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Test_Log;
