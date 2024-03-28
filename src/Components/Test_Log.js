import React, { useState, useEffect } from "react";
import axios from "axios";

const Test_Log = () => {
    const [hospitalList, setHospitalList] = useState([]);
    const [selectedHospitals, setSelectedHospitals] = useState({});
    const [selectAll, setSelectAll] = useState(false);

    const fetchHospitalList = async () => {
        try {
            const response = await axios.get(
                "http://rpa-apiprd.inet.co.th:443/iClaim/list/hospital"
            );
            // แปลงรายการโรงพยาบาลให้อยู่ในรูปแบบของ object โดยใช้ id เป็น key
            const hospitalsObject = response.data.reduce((acc, hospital) => {
                acc[hospital.id] = hospital;
                return acc;
            }, {});
            setHospitalList(hospitalsObject);
        } catch (error) {
            console.error("Error fetching hospital list:", error);
        }
    };

    useEffect(() => {
        fetchHospitalList();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedHospitals(prevState => {
            if (prevState[id]) {
                // ถ้าโรงพยาบาลมีอยู่แล้วใน selectedHospitals ให้นำออก
                const updatedState = { ...prevState };
                delete updatedState[id];
                console.log(updatedState); // เพิ่มบรรทัดนี้
                return updatedState;
            } else {
                // ถ้าโรงพยาบาลยังไม่มีอยู่ใน selectedHospitals ให้เพิ่มเข้าไป
                const updatedState = { ...prevState, [id]: hospitalList[id] };
                console.log(updatedState); // เพิ่มบรรทัดนี้
                return updatedState;
            }
        });
    };
    const handleSelectAll = () => {
        setSelectAll(prevState => !prevState);
        setSelectedHospitals(prevState => {
            if (!selectAll) {
                console.log(hospitalList)
                return hospitalList;
            } else {
                return {};
            }
        });
    };

    

    const handleSend = async () => {
        try {
            // ทำการแปลง object เป็น array เพื่อนำไปใช้งานหรือส่งข้อมูล
            const selectedHospitalsArray = Object.values(selectedHospitals);
            // ส่งข้อมูลตามต้องการ
            const data = {
                message: selectedHospitalsArray
            };
            console.log(data)
            // ส่งข้อมูลไปยัง API
            await axios.post("http://localhost:443/send-message", data);
            console.log("Data sent successfully");
        } catch (error) {
            console.error('Error sending data:', error.message);
        }
    };
    

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>TEST API LOG</h1>
            <button onClick={handleSend}>Send</button>
            <label>
                <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectAll}
                />
                Select All
            </label>
            <table style={{ margin: "auto" }}>
                <thead>
                    <tr>
                        <th style={{ padding: "0 50px" }}>ID</th>
                        <th style={{ padding: "10px" }}>Token</th>
                        <th style={{ padding: "10px" }}>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(hospitalList).map(id => (
                        <tr key={id}>
                            <td style={{ padding: "0 50px" }}>{hospitalList[id].id}</td>
                            <td>{hospitalList[id].token}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange(id)}
                                    checked={!!selectedHospitals[id]}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Test_Log;
