import { Box, Button, Container, css, FormControl, FormLabel, Input, InputLabel, MenuItem, Select, Table, TableCell, TableHead, TableRow, type SelectChangeEvent } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import db from 'database'
import { EmptyStateDisplay } from 'sharedComponents'
import { EProjectStatus, type TProject, type TProjectEntry } from 'types'
import { formatDurationDisplayString } from 'utilities'

const TimeInput = () => {
    const startTime = useRef<Date | null>(null)
    const [timerRunning, setTimerRunning] = useState(false)
    const [selectedProjectId, setSelectedProjectId] = useState('')
    const [newProjectTitle, setNewProjectTitle] = useState('')
    const [percentFocus, setPercentFocus] = useState(100)

    const handleProjectChange = useCallback((event: SelectChangeEvent) => {
        setSelectedProjectId(event.target.value)
    }, [])

    const projects: Record<string, TProject> | undefined = useLiveQuery(async () => {
        const projectsArray = await db.projects.toArray()
        const projectsById = projectsArray.reduce<Record<string, TProject>>((acc, project) => {
            acc[project.id] = project
            return acc
        }, {})
        return projectsById
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

    if (!projects) {
        return <EmptyStateDisplay message="Do Soemthing lol" />
    }

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
                                    <div>
                                        <FormControl fullWidth css={selectProjectContainerCSS}>
                                            <InputLabel id="selected-project-id">Selected Project</InputLabel>
                                            <Select
                                                labelId="selected-project-id"
                                                value={selectedProjectId}
                                                label="Selected Project"
                                                onChange={handleProjectChange}
                                            >
                                                <MenuItem value="">Add New</MenuItem>
                                                {projects && Object.values(projects).map((project) => (
                                                    <MenuItem key={project.id} value={project.id}>{project.title}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {selectedProjectId === '' && (
                                            <FormControl>
                                                <Input value={newProjectTitle} onChange={(e) => { setNewProjectTitle(e.target.value) }} />
                                            </FormControl>
                                        )}
                                    </div>
                                    <Button disabled={!selectedProjectId && !newProjectTitle} variant='contained' onClick={startTimer}>Start</Button>
                                </Box>

                            )
                        )
                }
            </div>
            <Table>
                <TableHead>
                    <TableCell>Date</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Duration</TableCell>
                </TableHead>
                {projectEntries?.map((entry) => (
                    <TableRow key={entry.id}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{projects[entry.projectId]?.title || 'Title not found'}</TableCell>
                        <TableCell>{formatDurationDisplayString(entry.durationMS)}</TableCell>
                    </TableRow>
                ))}
            </Table>
        </Container>
    )
}

const selectProjectContainerCSS = css`
    width: 300px;
`

const setupTimerContainerCSS = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const endTimerContainerCSS = css`
    display: flex;
    flex-direction: row;
`

export default TimeInput
