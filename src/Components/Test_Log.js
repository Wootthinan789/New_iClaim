import React, { useState, useEffect } from "react";
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';

const Test_Log = () => {
    const [logData, setLogData] = useState(null);
    const [selectedType, setSelectedType] = useState('Internal');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [selectedType, selectedDate]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await axios.get(`http://rpa-apiprd.inet.co.th:443/iClaim/list/log?data_type=${selectedType}&date=${formattedDate}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch logs');
            }
            const data = response.data.filter(log => {
                const logDate = new Date(log.Date_on);
                return logDate.toISOString().split('T')[0] === formattedDate;

            });
            setLogData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching logs:', error);
            setLoading(false);
        }
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const downloadExcel = () => {
        const excelData = logData.map(log => ({
            Date: log.Date_on,
            List: log.List,
            Status: log.Status,
            User: log.User_name,
            Remark: log.Remark,
            DataType: log.Data_Type
        }));
    
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    
        const formattedSelectedDate = selectedDate.toISOString().split('T')[0].replace(/-/g, '');
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        XLSX.writeFile(wb, `Log_Data_${year}-${month}-${day}_${selectedType}.xlsx`);
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
                <p style={{ textAlign: "center" }}>Loading...</p>
            ) : (
                logData && Array.isArray(logData) && (
                    <div>
                        <ul>
                            {logData.map((log, index) => (
                                <li key={index} style={{display:'flex',gap:'0', margin:'5px'}}>
                                    <p style={{marginRight: '50px'}}>Date: {log.Date_on}</p>
                                    <p style={{marginRight: '50px'}}>List: {log.List}</p>
                                    <p style={{marginRight: '50px'}}>Status: {log.Status}</p>
                                    <p style={{marginRight: '50px'}}>User: {log.User_name}</p>
                                    <p style={{marginRight: '50px'}}>Remark: {log.Remark}</p>
                                    <p style={{marginRight: '50px'}}>Data Type: {log.Data_Type}</p>
                                </li>
                            ))}
                        </ul>
                        <div style={{textAlign:'center',fontSize:'14px'}}>
                            <button style={{cursor:'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', padding: '10px 20px'}} onClick={downloadExcel}>
                                Download Excel
                            </button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

export default Test_Log;
