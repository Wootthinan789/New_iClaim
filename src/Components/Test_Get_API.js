import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './Style/Profile.css';

const Test_Get_API = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:443/iClaim/list/hospital');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data ? data.filter(item => {
    return item.hospital.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>TEST API</h1>
      <input
        style={{textAlign:"center"}}
        type="text"
        placeholder="ค้นหาด้วยชื่อโรงพยาบาล"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Name Hospital</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody className="scrollable-container">
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.hospital}</td>
                  <td>{item.token}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Test_Get_API;
