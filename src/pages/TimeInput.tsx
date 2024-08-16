import TrashIcon from '@mui/icons-material/Delete'
import { Box, Button, css, FormControl, IconButton, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, type SelectChangeEvent } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useContext, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { context } from 'Context'
import db from 'database'
import { ModalID } from 'modals'
import moment, { type Moment } from 'moment'
import { EmptyStateDisplay } from 'sharedComponents'
import { EProjectStatus, type TProject, type TProjectEntry } from 'types'
import { formatDateKeyLookup, formatDurationDisplayString } from 'utilities'

const TimeInput = () => {
    const { dispatch } = useContext(context)
    const startTime = useRef<Moment | null>(null)
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
        startTime.current = moment()
        setTimerRunning(true)
    }, [])

    const triggerDeleteModal = useCallback((id: string) => {
        dispatch({
            type: 'SET_ACTIVE_MODAL',
            payload: {
                id: ModalID.CONFIRMATION_MODAL,
                title: 'Delete Entry?',
                confirmationColor: 'warning',
                confirmationText: 'Delete',
                confirmationCallback: () => {
                    void db.projectEntries.where('id').equals(id).delete()
                }
            }
        })
    }, [dispatch])

    const cancelTimer = useCallback(() => {
        startTime.current = null
        setTimerRunning(false)
        setSelectedProjectId('')
        setNewProjectTitle('')
        setPercentFocus(100)
    }, [])

    const endTimer = useCallback(async () => {
        if (!startTime.current) return
        setTimerRunning(false)
        const durationMS = moment().valueOf() - startTime.current.valueOf()
        let projectId = selectedProjectId
        if (newProjectTitle.length > 0) {
            projectId = (await addProject()).id
        }

        const newEntry: TProjectEntry = {
            date: formatDateKeyLookup(startTime.current),
            durationMS,
            id: uuidv4(),
            projectId,
            details: 'Some details'
        }

        await db.projectEntries.add(newEntry)

        startTime.current = null
        setSelectedProjectId('')
        setNewProjectTitle('')
        setPercentFocus(100)
    }, [startTime, selectedProjectId, newProjectTitle, addProject])

    return (
        <Box css={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
            <div>
                {
                    timerRunning
                        ? (
                            <Box css={endTimerContainerCSS}>
                                <div>
                                    <TextField
                                        id="outlined-number"
                                        label="% Focus"
                                        onChange={(e) => { setPercentFocus(parseInt(e.target.value)) }}
                                        value={percentFocus}
                                        type="number"
                                        size="small"
                                    />
                                </div>
                                <div>
                                    <Button size="small" color="error" onClick={cancelTimer}>Cancel</Button>
                                    <Button size="small" variant='contained' onClick={endTimer}>End Timer</Button>
                                </div>
                            </Box>
                        )
                        : (
                            (
                                <Box css={setupTimerContainerCSS}>
                                    <div>
                                        <FormControl fullWidth css={selectProjectContainerCSS}>
                                            <Select
                                                displayEmpty
                                                size="small"
                                                labelId="selected-project-id"
                                                value={selectedProjectId}
                                                onChange={handleProjectChange}
                                            >
                                                <MenuItem value="">Add New</MenuItem>
                                                {projects && Object.values(projects).map((project) => (
                                                    <MenuItem key={project.id} value={project.id}>{project.title}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {selectedProjectId === '' && (
                                            <FormControl sx={{ marginLeft: '16px' }}>
                                                <TextField size="small" placeholder="New Project" value={newProjectTitle} onChange={(e) => { setNewProjectTitle(e.target.value) }} />
                                            </FormControl>
                                        )}
                                    </div>
                                    <Button size="small" disabled={!selectedProjectId && !newProjectTitle} variant='contained' onClick={startTimer}>Start</Button>
                                </Box>

                            )
                        )
                }
            </div>
            {(!projects || !projectEntries || projectEntries.length === 0)
                ? < EmptyStateDisplay message="Do Soemthing lol" />
                : (
                    <Box css={tableContainerCSS}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Project</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projectEntries?.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>{entry.date}</TableCell>
                                        <TableCell>{projects[entry.projectId]?.title || 'Title not found'}</TableCell>
                                        <TableCell>{formatDurationDisplayString(entry.durationMS)}</TableCell>
                                        <TableCell>
                                            <IconButton aria-label="delete" onClick={() => { triggerDeleteModal(entry.id) }}>
                                                <TrashIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
        </Box>
    )
}

const tableContainerCSS = css`
    overflow: auto;
    flex-grow: 1;
    height: 0; // Magic CSS to make this all work with vertical scroll.
`

const selectProjectContainerCSS = css`
    width: 170px;
`

const setupTimerContainerCSS = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const endTimerContainerCSS = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export default TimeInput
