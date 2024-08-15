import { useState } from 'react'

enum View {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    AllTime = 'allTime'
}

const Charts = () => {
    const [currentView, setCurrentView] = useState<View>(View.Weekly)
    const [data, setData] = useState([])
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(new Date(e.target.value))
    }

    return (
        <div>
            <div>
                <button onClick={() => { setCurrentView(View.Daily) }}>Daily</button>
                <button onClick={() => { setCurrentView(View.Weekly) }}>Weekly</button>
                <button onClick={() => { setCurrentView(View.Monthly) }}>Monthly</button>
                <button onClick={() => { setCurrentView(View.AllTime) }}>All Time</button>
            </div>
            <div>
                <input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={handleDateChange} />
            </div>
            <div>
                {/* <Chart data={data} view={currentView} selectedDate={selectedDate} /> */}
            </div>
        </div>
    )
}

export default Charts
