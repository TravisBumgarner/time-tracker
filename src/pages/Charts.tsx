import moment, { type Moment } from 'moment'

import { useState } from 'react'
import { formatDateKeyLookup } from 'utilities'
import ChartHoursPerProject from './ChartHoursPerProject'

enum View {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    AllTime = 'allTime'
}

const getDateRange = (view: View, date: Date) => {
    const mDate = moment(date)

    let start: Moment
    let end: Moment

    switch (view) {
        case View.Daily: {
            start = mDate.startOf('day')
            end = mDate.endOf('day')
            break
        }
        case View.Weekly: {
            start = mDate.startOf('week')
            end = mDate.endOf('week')
            break
        }
        case View.Monthly: {
            start = mDate.startOf('month')
            end = mDate.endOf('month')
            break
        }
        case View.AllTime: {
            start = moment(0)
            end = moment()
            break
        }
    }

    return {
        start: formatDateKeyLookup(start),
        end: formatDateKeyLookup(end)
    }
}

const Charts = () => {
    const [currentView, setCurrentView] = useState<View>(View.Weekly)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(new Date(e.target.value))
    }

    const { start, end } = getDateRange(currentView, selectedDate)

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
            <ChartHoursPerProject start={start} end={end} />
        </div>
    )
}

export default Charts
