import React, { useState, useEffect } from "react";
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

const Test_Log = () => {
    const [logData, setLogData] = useState(null);
    const [selectedType, setSelectedType] = useState('Internal'); // ประเภทที่ถูกเลือกเริ่มต้น
    const [selectedDate, setSelectedDate] = useState(new Date()); // วันที่ที่เลือกเริ่มต้น
    const [loading, setLoading] = useState(true); // เพิ่ม state สำหรับการโหลดข้อมูล

    useEffect(() => {
        fetchLogs();
    }, [selectedType, selectedDate]); // เรียก fetchLogs ใหม่เมื่อ selectedType หรือ selectedDate เปลี่ยนแปลง
    
    console.log(selectedType)
    const fetchLogs = async () => {
        try {
            setLoading(true); // เริ่มโหลดข้อมูล
            // กำหนดวันที่ในรูปแบบ YYYY-MM-DD
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await axios.get(`http://rpa-apiprd.inet.co.th:443/iClaim/list/log?data_type=${selectedType}&date=${formattedDate}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch logs');
            }
            const data = response.data.filter(log => {
                // ดึงวันที่จากข้อมูลและแปลงเป็นวันที่ใน JavaScript Date object
                const logDate = new Date(log.Date_on);
                // ทำการเปรียบเทียบเฉพาะวันที่ (ไม่สนใจเวลา)
                return logDate.toISOString().split('T')[0] === formattedDate;
            });
            setLogData(data);
            setLoading(false); // เมื่อโหลดข้อมูลเสร็จเปลี่ยนเป็น false
        } catch (error) {
            console.error('Error fetching logs:', error);
            setLoading(false); // เมื่อเกิด error เปลี่ยนเป็น false เช่นกัน
        }
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div>
            <h1 style={{textAlign:'center'}}> TEST LOG API</h1>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="logType">Choose a log type:</label>
                <select id="logType" value={selectedType} onChange={handleTypeChange}>
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="logDate">Choose a date:</label>
                <input type="date" id="logDate" value={selectedDate.toISOString().split('T')[0]} onChange={(e) => handleDateChange(new Date(e.target.value))} />
            </div>
            {loading ? (
                <p style={{ textAlign: "center" }}>Loading...</p> // แสดง Loading ถ้ากำลังโหลดข้อมูล
            ) : (
                logData && Array.isArray(logData) && (
                    <div>
                        <ul>
                            {logData.map((log, index) => (
                                <li key={index}>
                                    <p>Date: {log.Date_on}</p>
                                    <p>List: {log.List}</p>
                                    <p>Status: {log.Status}</p>
                                    <p>User: {log.User_name}</p>
                                    <p>Remark: {log.Remark}</p>
                                    <p>Data Type: {log.Data_Type}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            )}
        </div>
    );
}

export default Test_Log;
