import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import moment, { type Moment } from 'moment'
import { useState } from 'react'
import { TDateISODate } from 'types'
import { formatDateKeyLookup } from 'utilities'
import ChartHoursPerProject from './ChartHoursPerProject'

enum View {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    AllTime = 'allTime'
}

const getDateRange = (view: View, dateStr: TDateISODate) => {
    let start: Moment
    let end: Moment

    const date = moment(dateStr)

    switch (view) {
        case View.Daily: {
            start = date.startOf('day')
            end = date.endOf('day')
            break
        }
        case View.Weekly: {
            start = date.startOf('week')
            end = date.endOf('week')
            break
        }
        case View.Monthly: {
            start = date.startOf('month')
            end = date.endOf('month')
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
    const [selectedDate, setSelectedDate] = useState<TDateISODate>(formatDateKeyLookup(moment().local()))

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(formatDateKeyLookup(moment(e.target.value)))
    }

    const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: View) => {
        if (newView !== null) {
            setCurrentView(newView)
        }
    }

    const handleCurrentDate = () => {
        setSelectedDate(formatDateKeyLookup(moment()))
    }

    const handlePreviousDate = () => {
        const mDate = moment(selectedDate)
        switch (currentView) {
            case View.Daily:
                setSelectedDate(formatDateKeyLookup(mDate.subtract(1, 'day').local()))
                break
            case View.Weekly:
                setSelectedDate(formatDateKeyLookup(mDate.subtract(1, 'week').local()))
                break
            case View.Monthly:
                setSelectedDate(formatDateKeyLookup(mDate.subtract(1, 'month').local()))
                break
            case View.AllTime:
                setSelectedDate(formatDateKeyLookup(mDate.subtract(1, 'year').local()))
                break
        }
    }

    const handleNextDate = () => {
        const mDate = moment(selectedDate)
        switch (currentView) {
            case View.Daily:
                setSelectedDate(formatDateKeyLookup(mDate.add(1, 'day').local()))
                break
            case View.Weekly:
                setSelectedDate(formatDateKeyLookup(mDate.add(1, 'week').local()))
                break
            case View.Monthly:
                setSelectedDate(formatDateKeyLookup(mDate.add(1, 'month').local()))
                break
            case View.AllTime:
                setSelectedDate(formatDateKeyLookup(mDate.add(1, 'year').local()))
                break
        }
    }

    const { start, end } = getDateRange(currentView, selectedDate)

    return (
        <div>
            <ToggleButtonGroup
                value={currentView}
                exclusive
                onChange={handleViewChange}
                aria-label="view selection"
            >
                <ToggleButton value={View.Daily} aria-label="daily">
                    Daily
                </ToggleButton>
                <ToggleButton value={View.Weekly} aria-label="weekly">
                    Weekly
                </ToggleButton>
                <ToggleButton value={View.Monthly} aria-label="monthly">
                    Monthly
                </ToggleButton>
                <ToggleButton value={View.AllTime} aria-label="all time">
                    All Time
                </ToggleButton>
            </ToggleButtonGroup>
            <div>
                <input disabled={currentView === View.AllTime} type="date" value={selectedDate} onChange={handleDateChange} />
                <button disabled={currentView === View.AllTime} onClick={handlePreviousDate}>Previous</button>
                <button disabled={currentView === View.AllTime} onClick={handleCurrentDate}>Current</button>
                <button disabled={currentView === View.AllTime} onClick={handleNextDate}>Next</button>
            </div>
            <ChartHoursPerProject start={start} end={end} />
        </div>
    )
}

export default Charts