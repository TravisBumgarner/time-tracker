import { Box, Button, ButtonGroup, css, ToggleButton, ToggleButtonGroup } from '@mui/material'
import moment, { type Moment } from 'moment'
import { useState } from 'react'
import { type TDateISODate } from 'types'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
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

    return {
        start,
        end
    }
}

const Charts = () => {
    const [isHovered, setIsHovered] = useState(false)
    const [currentView, setCurrentView] = useState<View>(View.Weekly)
    const [selectedDate, setSelectedDate] = useState<TDateISODate>(formatDateKeyLookup(moment().local()))

    // const handleDateChange = (e: any) => {
    //     setSelectedDate(formatDateKeyLookup(moment(e.target.value)))
    // }

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
            <Box css={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <ToggleButtonGroup
                    value={currentView}
                    exclusive
                    onChange={handleViewChange}
                    aria-label="view selection"
                >
                    <ToggleButton css={buttonCSS} value={View.Daily} aria-label="daily">
                        D
                    </ToggleButton>
                    <ToggleButton css={buttonCSS} value={View.Weekly} aria-label="weekly">
                        W
                    </ToggleButton>
                    <ToggleButton css={buttonCSS} value={View.Monthly} aria-label="monthly">
                        M
                    </ToggleButton>
                    <ToggleButton css={buttonCSS} value={View.AllTime} aria-label="all time">
                        A
                    </ToggleButton>
                </ToggleButtonGroup>
                <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                    <Button css={buttonCSS} disabled={currentView === View.AllTime} onClick={handlePreviousDate}>{'<'}</Button>
                    <Button
                        onMouseEnter={() => { setIsHovered(true) }}
                        onMouseLeave={() => { setIsHovered(false) }}
                        css={middleButtonCSS}
                        disabled={currentView === View.AllTime}
                        onClick={handleCurrentDate}
                    >{isHovered ? 'Today' : `${formatDateDisplayString(start)} - ${formatDateDisplayString(end)}`}</Button>
                    <Button css={buttonCSS} disabled={currentView === View.AllTime} onClick={handleNextDate}>{'>'}</Button>
                </ButtonGroup>
            </Box>
            <ChartHoursPerProject start={formatDateKeyLookup(start)} end={formatDateKeyLookup(end)} />
        </Box >
    )
}

const buttonCSS = css`
    height: 30px;
`

const middleButtonCSS = css`
    height: 30px;
    width: 200px;
`

export default Charts
