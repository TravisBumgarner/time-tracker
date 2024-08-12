import { Box, Button, Container, css, FormControl, FormLabel, Input, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import db from 'database'
import { EProjectStatus, type TProjectEntry } from 'types'

const TimeInput = () => {
    const startTime = useRef<Date | null>(null)
    const [timerRunning, setTimerRunning] = useState(false)
    const [selectedProjectId, setSelectedProjectId] = useState('')
    const [newProjectTitle, setNewProjectTitle] = useState('')
    const [percentFocus, setPercentFocus] = useState(100)

    const handleProjectChange = useCallback((event: SelectChangeEvent) => {
        setSelectedProjectId(event.target.value)
    }, [])

    const projects = useLiveQuery(async () => {
        return await db.projects.toArray()
    }, [])

    const projectEntries = useLiveQuery(async () => {
        return await db.projectEntries.toArray()
    }, [])

    const addProject = useCallback(async () => {
        if (!newProjectTitle) throw Error('Something went wrong')

        const newProject = {
            id: uuidv4(),
            title: newProjectTitle,
            status: EProjectStatus.ACTIVE
        }

        await db.projects.add(newProject)
        return newProject
    }, [newProjectTitle])

    const startTimer = useCallback(() => {
        startTime.current = new Date()
        setTimerRunning(true)
        console.log(startTime.current)
    }, [])

    const endTimer = useCallback(async () => {
        if (!startTime.current) return
        setTimerRunning(false)
        const durationMS = new Date().getTime() - startTime.current.getTime()
        let projectId = selectedProjectId
        if (newProjectTitle.length > 0) {
            console.log('adding new')
            projectId = (await addProject()).id
        }

        const newEntry: TProjectEntry = {
            date: new Date().toLocaleDateString(),
            durationMS,
            id: uuidv4(),
            projectId,
            details: 'Some details'
        }

        await db.projectEntries.add(newEntry)

        startTime.current = null
    }, [startTime, selectedProjectId, newProjectTitle, addProject])
    console.log('ruda', startTime.current)
    return (
        <Container>
            <div>
                {
                    timerRunning
                        ? (
                            <Box css={endTimerContainerCSS}>
                                <FormLabel>% Focus</FormLabel>
                                <Input onChange={(e) => { setPercentFocus(parseInt(e.target.value)) }} value={percentFocus} type='number' />
                                <Button variant='contained' onClick={endTimer}>End Timer</Button>
                                <Button color="error" >Cancel</Button>
                            </Box>
                        )
                        : (
                            (
                                <Box css={setupTimerContainerCSS}>
                                    <FormControl fullWidth css={selectProjectContainerCSS}>
                                        <InputLabel id="selected-project-id">Selected Project</InputLabel>
                                        <Select
                                            labelId="selected-project-id"
                                            value={selectedProjectId}
                                            label="Selected Project"
                                            onChange={handleProjectChange}
                                        >
                                            <MenuItem value="">Add New</MenuItem>
                                            {projects?.map((project) => (
                                                <MenuItem key={project.id} value={project.id}>{project.title}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {selectedProjectId === '' && (
                                        <FormControl>
                                            <Input value={newProjectTitle} onChange={(e) => { setNewProjectTitle(e.target.value) }} />
                                        </FormControl>
                                    )}
                                    <Button variant='contained' onClick={startTimer}>Start</Button>
                                </Box>

                            )
                        )
                }
            </div>
            {projectEntries?.map((entry) => (
                <div key={entry.id}>
                    <p>Project: {entry.projectId}</p>
                    <p>Duration: {entry.durationMS}</p>
                    <p>Date: {entry.date}</p>
                </div>
            ))}
        </Container>
    )
}

const selectProjectContainerCSS = css`
            width: 300px;
            `

const setupTimerContainerCSS = css`
            display: flex;
            flex-direction: row;
            `

const endTimerContainerCSS = css`
            display: flex;
            flex-direction: row;
            `

export default TimeInput
