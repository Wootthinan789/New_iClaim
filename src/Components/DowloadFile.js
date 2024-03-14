import React from "react";
import ExcelJS from 'exceljs';

const Download_File = () => {
    const createExcelFile = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        
        // เพิ่มข้อมูลลงในชีท
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 32 },
            { header: 'Age', key: 'age', width: 10 }
        ];
        worksheet.addRow({ id: 1, name: 'John Doe', age: 30 });
        worksheet.addRow({ id: 2, name: 'Jane Doe', age: 25 });
        
        // สร้าง Excel file และดาวน์โหลด
        workbook.xlsx.writeBuffer() 
            .then(buffer => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'example.xlsx';
                a.click();
                URL.revokeObjectURL(url);
            })
            .catch(err => {
                console.error('Error:', err);
            });
    }
    
    return (
        <div>
            <h1 style={{textAlign:'center'}}>Download File Excel</h1>
            <div style={{textAlign:'center',fontSize:'14px'}}>
            <button style={{cursor:'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', padding: '10px 20px'}}
            onClick={createExcelFile}
            >
                    Download Excel
            </button>
            </div>
        </div>
    )
}

export default Download_File;
