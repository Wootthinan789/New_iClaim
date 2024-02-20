import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Style/Profile.css'

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(true); // เพิ่ม state เพื่อตรวจสอบสถานะการโหลดข้อมูล

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = date => {
    setSelectedDate(date);
    console.log(selectedDate)
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 10);
        setCurrentDate(formattedDate);
        const response = await fetch(`http://rpa-apiprd.inet.co.th:443/iClaim/list?date_on=${formattedDate}`);
        const data = await response.json();
        console.log(formattedDate)
        setCountries(data);
        setLoading(false); // ตั้งค่าสถานะการโหลดข้อมูลเมื่อโหลดเสร็จสมบูรณ์
      } catch (error) {
        console.error('Error fetching countries:', error);
        setLoading(false); // ตั้งค่าสถานะการโหลดข้อมูลเมื่อเกิดข้อผิดพลาด
      }
    };

    fetchCountries();
  }, []);

  return (
    <div>
          <div style={{position:"static",alignItems:"center",padding:'0px 50%'}}>
          <DatePicker className='Dashboard-Internal-button-date'
           selected={selectedDate} onChange={handleDateChange} dateFormat="dd/MM/yyyy"/>
        </div>
      <h2>Name List {currentDate}</h2>
      {loading ? ( // ตรวจสอบสถานะการโหลดข้อมูล
        <p>Loading...</p>
      ) : countries && countries.length > 0 ? ( // ตรวจสอบว่ามีข้อมูลอยู่หรือไม่
        <ul>
          {countries.map(country => (
            <li key={country.title}>
              <h3>{country.title}</h3>
              <img src={country.title} alt={country.title}/>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available for the selected date.</p>
      )}
    </div>
  );
};

export default CountryList;
