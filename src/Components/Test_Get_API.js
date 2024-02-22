import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Style/Profile.css';

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectAllChecked, setSelectAllChecked] = useState(false); // เพิ่ม state สำหรับ checkbox เลือกทั้งหมด

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 10);
        setCurrentDate(formattedDate);
        const response = await fetch(`http://rpa-apiprd.inet.co.th:443/iClaim/list?date_on=${formattedDate}`);
        const data = await response.json();
        setCountries(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCheckboxChange = (title) => {
    setCountries(countries.map(country => {
      if (country.title === title) {
        return { ...country, checked: !country.checked }; // กำหนดค่า checked ของรายการที่เลือก
      }
      return country;
    }));
  };

  const handleSelectAllChange = () => {
    setSelectAllChecked(!selectAllChecked); // กำหนดสถานะการติ๊ก checkbox เลือกทั้งหมด
    setCountries(countries.map(country => ({
      ...country,
      checked: !selectAllChecked // กำหนดสถานะ checked ของทุกรายการตามสถานะ checkbox เลือกทั้งหมด
    })));
  };

  return (
    <div>
      <div style={{ position: "static", alignItems: "center", padding: '0px 50%' }}>
        <DatePicker className='Dashboard-Internal-button-date'
          selected={selectedDate} onChange={handleDateChange} dateFormat="dd/MM/yyyy" />
      </div>
      <h2>Name List {currentDate}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : countries && countries.length > 0 ? (
        <>
          <label>
            <input
              type="checkbox"
              checked={selectAllChecked}
              onChange={handleSelectAllChange}
            />
            Select All
          </label>
          <ul>
            {countries.map(country => (
              <li key={country.title}>
                <label>
                  <input
                    type="checkbox"
                    checked={country.checked || false} // ตรวจสอบสถานะ checked ของแต่ละรายการ
                    onChange={() => handleCheckboxChange(country.title)}
                  />
                  {country.title}
                </label>
                <img src={country.img_6} alt={country.title} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No data available for the selected date.</p>
      )}
    </div>
  );
};

export default CountryList;
