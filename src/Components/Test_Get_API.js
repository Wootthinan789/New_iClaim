import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test_Get_API = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:443/get/data/hospital/government');
        setHospitals(response.data);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลโรงพยาบาล:', error);
      }
    };
    fetchData();
  }, []);

  // Handle checkbox state and selected hospitals
  const handleCheckboxChange = (hospitalId, token) => {
    setSelectedHospitals(prev => {
      if (prev.some(hospital => hospital.Hospital_Government === hospitalId)) {
        return prev.filter(hospital => hospital.Hospital_Government !== hospitalId); // unselect hospital
      } else {
        return [...prev, { Hospital_Government: hospitalId, token }]; // select hospital
      }
    });
  };

  // Log selected hospitals whenever it changes
  useEffect(() => {
    console.log('Selected Hospitals:', selectedHospitals);
  }, [selectedHospitals]);

  return (
    <div>
      {/* ช่องค้นหา */}
      <input
        type="text"
        placeholder="ค้นหาโรงพยาบาล..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* แสดงรายการโรงพยาบาล */}
      <ul>
        {hospitals
          .filter(hospital => hospital.Hospital_Government && hospital.Hospital_Government.includes(searchTerm))
          .map(hospital => (
            <li key={hospital.Hospital_Government}>
              <input
                type="checkbox"
                checked={selectedHospitals.some(h => h.Hospital_Government === hospital.Hospital_Government)}
                onChange={() => handleCheckboxChange(hospital.Hospital_Government, hospital.Token_Government)}
              />
              {hospital.Hospital_Government}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Test_Get_API;
