import React, { useEffect, useState, useContext } from 'react';
import Table from './Table.jsx';
import { AppContext } from './AppContext.jsx';
import './Form.css';

const Form = ({ data }) => {
    const { user } = useContext(AppContext);

    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState({ type: "", text: "" });

    const [showTable, setShowTable] = useState({});

    function handleRowClick(data, name) {
        setFormData(prev => ({...prev, [name]: data}));
        setShowTable(prev => ({...prev, [name]: !showTable[name]}));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log('Sending form:', formData);
    
        try {
            const response = await fetch(`http://localhost:3000/api/${data.name}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                setMessage({ type: "error", text: "Failed to submit." });
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setMessage({ type: "success", text: "Submitted successfully!" });
            const responseData = await response.json();
            console.log('Response Message:', responseData);
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred." });
            console.error('Error:', error.message);
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };
    

    useEffect(() => {
        setFormData({})
        setShowTable({})
        if (data !== null) {
            data.columns.map(column => {
                if (column.type === 'table') {
                    setShowTable(prev => ({...prev, [column.name]: false}))
                }
            })
        }
    }, [data])

    return (
        <>
            {data !== null &&
            <div className='form-container'>
                <h1 className='form-title'>{data.title}</h1>
                <form onSubmit={handleSubmit}>
                    {data.columns.map((column, index) => (
                        <div key={index} className='form-group'>
                            <label>{column.name}: </label>
                            {column.type === 'table' ? 
                            <>
                                <input
                                    onClick={() => setShowTable(prev => ({...prev, [column.name]: !showTable[column.name]}))}
                                    required
                                    readOnly
                                    type={column.type}
                                    value={formData[column.name] ? Object.values(formData[column.name])[1] : ''}
                                />
                                {showTable[column.name] && <Table name={column.name} handleRowClick={(item) => handleRowClick(item.data, column.name)} />}
                            </>
                            :
                            <input
                                required
                                type={column.type}
                                value={formData[column.name] || ""}
                                onChange={(e) => 
                                    setFormData(prev => ({...prev, [column.name]: e.target.value}))
                                }
                            />}
                        </div>
                    ))}
                    <button className='form-button' type="submit">Submit</button>
                </form>
            </div>  }
            <div>
                {message.text && (
                    <div
                    style={{
                        color: message.type === "success" ? "green" : "red",
                        backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
                        padding: "10px",
                        border: `1px solid ${
                        message.type === "success" ? "#c3e6cb" : "#f5c6cb"
                        }`,
                        borderRadius: "4px",
                        maxWidth: "300px",
                        margin: "0 auto",
                        textAlign: "center",
                    }}
                    >
                    {message.text}
                    </div>
                )}
            </div>
        </>
    );
}

export default Form;
