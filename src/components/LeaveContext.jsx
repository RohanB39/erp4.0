import React, { createContext, useState } from 'react';

export const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
    const [leaveData, setLeaveData] = useState(null);

    return (
        <LeaveContext.Provider value={{ leaveData, setLeaveData }}>
            {children}
        </LeaveContext.Provider>
    );
};
