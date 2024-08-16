import { Box, Button, ButtonGroup, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment, { type Moment } from 'moment'
import { useState } from 'react'
import { type TDateISODate } from 'types'
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

    console.log('fetching view', view)
    switch (view) {
        case View.Daily: {
            start = date.clone().startOf('day')
            end = date.clone().endOf('day')
            break
        }
        case View.Weekly: {
            start = date.clone().weekday(0).startOf('day')
            end = date.clone().weekday(6).endOf('day')
            break
        }
        case View.Monthly: {
            start = date.clone().startOf('month')
            end = date.clone().endOf('month')
            break
        }
        case View.AllTime: {
            start = moment(0)
            end = moment().add(1, 'day')
            break
        }
    }
    console.log('deets', start, end)
    return {
        start: formatDateKeyLookup(start),
        end: formatDateKeyLookup(end)
    }
}

const Charts = () => {
    const [currentView, setCurrentView] = useState<View>(View.Weekly)
    const [selectedDate, setSelectedDate] = useState<TDateISODate>(formatDateKeyLookup(moment().local()))

    const handleDateChange = (e: any) => {
        console.log(e)
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
        <Box>
            <Box>
                <ToggleButtonGroup
                    sx={{ height: '40px' }}
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
            </Box>
            <Box>
                <DatePicker
                    slotProps={{ textField: { size: 'small' } }}
                    value={moment(selectedDate) ?? null} onChange={handleDateChange} />
                <ButtonGroup sx={{ height: '40px' }} variant="contained" aria-label="outlined primary button group">
                    <Button disabled={currentView === View.AllTime} onClick={handlePreviousDate}>Previous</Button>
                    <Button disabled={currentView === View.AllTime} onClick={handleCurrentDate}>Current</Button>
                    <Button disabled={currentView === View.AllTime} onClick={handleNextDate}>Next</Button>
                </ButtonGroup>
            </Box>
            <Box>
                <Typography variant="h6">{start} - {end}</Typography>
            </Box>
            <ChartHoursPerProject start={start} end={end} />
        </Box>
    )
}

export default Charts
