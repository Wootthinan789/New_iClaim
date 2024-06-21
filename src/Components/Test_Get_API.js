import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './Style/Profile.css';

const Test_Get_API = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [keyIds, setKeyIds] = useState([]); // Assuming this holds the mapping of hospitals to tokens
  const usernameJson = { username: "exampleUser" }; // Example username

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

  const handleCheckboxChange = (event, index) => {
    const isChecked = event.target.checked;
    setCheckedItems(prevState => ({
      ...prevState,
      [index]: isChecked
    }));

    if (isChecked) {
      const checkboxData = data[index];
      const id_hospital = checkboxData.id_hospital;
      const img_6_Array = checkboxData.img_6;
      const title = checkboxData.title;
      const token = keyIds.find((hospital) => hospital.id === id_hospital)?.token;

      const selectedCheckbox = {
        id_hospital: id_hospital,
        img_6_Array: img_6_Array,
        token: token,
        user_name: usernameJson.username,
        menu: "External",
        title: title
      };

      setSelectedCheckboxes(prevState => ({
        ...prevState,
        [index]: selectedCheckbox
      }));
    } else {
      setSelectedCheckboxes(prevState => {
        const newState = { ...prevState };
        delete newState[index];
        return newState;
      });
    }
  };

  const handleSelectAll = () => {
    if (Object.keys(checkedItems).length === filteredData.length) {
      setCheckedItems({});
      setSelectedCheckboxes({});
    } else {
      const newCheckedItems = {};
      const newSelectedCheckboxes = {};

      filteredData.forEach((item, index) => {
        newCheckedItems[index] = true;

        const id_hospital = item.id_hospital;
        const img_6_Array = item.img_6;
        const title = item.title;
        const token = keyIds.find((hospital) => hospital.id === id_hospital)?.token;

        newSelectedCheckboxes[index] = {
          id_hospital: id_hospital,
          img_6_Array: img_6_Array,
          token: token,
          user_name: usernameJson.username,
          menu: "External",
          title: title
        };
      });

      setCheckedItems(newCheckedItems);
      setSelectedCheckboxes(newSelectedCheckboxes);
    }
  };

  const filteredData = data ? data.filter(item => {
    return item.hospital.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>TEST API</h1>
      <input
        style={{ textAlign: "center" }}
        type="text"
        placeholder="ค้นหาด้วยชื่อโรงพยาบาล"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Selected Hospitals: {Object.keys(selectedCheckboxes).length}</p> {/* Display count */}
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={Object.keys(checkedItems).length === filteredData.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Index</th>
                <th>Name Hospital</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody className="scrollable-container">
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!checkedItems[index]}
                      onChange={(e) => handleCheckboxChange(e, index)}
                    />
                  </td>
                  <td>{index + 1}</td> {/* Display the index + 1 */}
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
