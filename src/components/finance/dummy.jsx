import React, { useState } from 'react';
import './financePage.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { GiReceiveMoney } from "react-icons/gi";
import { BsCurrencyRupee } from "react-icons/bs";
import { FaMoneyBillAlt } from "react-icons/fa";
import { AiOutlineCalendar } from 'react-icons/ai';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { fireDB, collection, query, where, getDocs } from '../firebase/FirebaseConfig';

function FinancePage() {
    const [startDate, setStartDate] = useState(new Date());
    const [dataIncome, setDataIncome] = useState(initialDataIncome);
    const [totalIncome, setTotalIncome] = useState(0);

    useEffect(() => {
        // Function to fetch the income data
        const fetchIncomeData = async () => {
            try {
                const dispatchInvoicesRef = collection(fireDB, 'Dispatch_Invoices');
                const dispatchQuery = query(dispatchInvoicesRef, where('invStatus', '==', 'Dispatched'));
                const dispatchSnapshot = await getDocs(dispatchQuery);

                // Temporary object to store the sum of income per month
                const incomeByMonth = {
                    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0,
                    '11': 0, '12': 0
                };

                dispatchSnapshot.forEach(doc => {
                    const invoiceData = doc.data();
                    const invoiceDate = invoiceData.invoiceDate;  // Format: "2024-10-15"
                    const total = invoiceData.total;  // The total value to sum up

                    // Extract the month (e.g., "2024-10-15" -> "10")
                    const month = invoiceDate.split('-')[1];

                    // Add the total to the corresponding month in the incomeByMonth object
                    if (incomeByMonth[month] !== undefined) {
                        incomeByMonth[month] += total;
                    }
                });

                // Update dataIncome based on the fetched data
                const updatedDataIncome = Object.keys(incomeByMonth).map(month => ({
                    name: month,
                    income: incomeByMonth[month],
                }));

                setDataIncome(updatedDataIncome);

                // Calculate total income from all months
                const total = Object.values(incomeByMonth).reduce((acc, curr) => acc + curr, 0);
                setTotalIncome(total);

            } catch (error) {
                console.error('Error calculating income:', error);
            }
        };

        // Fetch the income data when the component is mounted
        fetchIncomeData();
    }, []);

    return (
        <>
            <div className="finance-cards" id="main">
                <div className="single-card">
                    <div className="icon">
                        <div>
                            <h3>{totalIncome}</h3>
                            <p>Total Income</p>
                        </div>
                        <FaMoneyBillAlt className="icons" />
                    </div>
                    <div className="graph">
                        <ResponsiveContainer width="100%" height={30}>
                            <AreaChart data={dataIncome}>
                                <Tooltip />
                                <Area type="monotone" dataKey="income" stroke="#8884d8" fill="#8884d8" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FinancePage;
